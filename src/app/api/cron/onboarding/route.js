import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOnboardingEmail } from "@/lib/resend";

export async function GET(req) {
  try {
    const reqUrl = new URL(req.url);
    const authHeader = req.headers.get("authorization");
    const secret = reqUrl.searchParams.get("secret") || (authHeader ? authHeader.replace("Bearer ", "") : "");

    const cronSecret = process.env.CRON_SECRET || "automixa_cron_secret_key_2026";

    if (!secret || secret !== cronSecret) {
      return new Response("Unauthorized", { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // 1. Fetch workspaces created in the last 7 days, along with their connected Instagrams
    const { data: workspaces, error: wsError } = await supabase
      .from("workspaces")
      .select(`
        id,
        user_id,
        created_at,
        automations ( id )
      `)
      .gt("created_at", sevenDaysAgo)
      .order("created_at", { ascending: true });

    if (wsError) {
      throw wsError;
    }

    // 2. Fetch already sent onboarding emails
    const { data: sentEmails, error: sentError } = await supabase
      .from("onboarding_emails")
      .select("user_id, email_type");

    if (sentError) {
      throw sentError;
    }

    // Deduplicate by user_id, keeping the oldest workspace creation date
    const uniqueUsers = new Map();
    for (const w of workspaces || []) {
      if (!uniqueUsers.has(w.user_id)) {
        uniqueUsers.set(w.user_id, {
          user_id: w.user_id,
          created_at: w.created_at,
          hasInstagram: w.automations && w.automations.length > 0
        });
      } else {
        if (w.automations && w.automations.length > 0) {
          uniqueUsers.get(w.user_id).hasInstagram = true;
        }
      }
    }

    const processedLogs = [];

    // 3. Process each user
    for (const [userId, userDetails] of uniqueUsers.entries()) {
      const { created_at, hasInstagram } = userDetails;
      const createdAt = new Date(created_at);
      const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      const userSent = (sentEmails || [])
        .filter(e => e.user_id === userId)
        .map(e => e.email_type);

      let emailTypeToSend = null;

      // Welcome Email: Send instantly (diffHours >= 0)
      if (!userSent.includes("welcome")) {
        emailTypeToSend = "welcome";
      }
      // Nudges: If they haven't connected Instagram
      else if (!hasInstagram) {
        if (diffHours >= 72 && !userSent.includes("feedback_72h")) {
          emailTypeToSend = "feedback_72h";
        } else if (diffHours >= 24 && !userSent.includes("case_study_24h")) {
          emailTypeToSend = "case_study_24h";
        } else if (diffHours >= 2 && !userSent.includes("nudge_2h")) {
          emailTypeToSend = "nudge_2h";
        }
      }

      if (emailTypeToSend) {
        // Fetch user from auth to get email and metadata
        const { data: authUserObj, error: userError } = await supabase.auth.admin.getUserById(userId);
        
        if (userError || !authUserObj?.user) {
          console.warn(`Could not fetch auth details for user ${userId}:`, userError?.message);
          continue;
        }

        const userObj = authUserObj.user;
        const email = userObj.email;
        const name = userObj.user_metadata?.full_name || userObj.user_metadata?.name || "there";

        if (!email) {
          console.warn(`User ${userId} does not have an email address`);
          continue;
        }

        // Send Email via Resend
        console.log(`Sending ${emailTypeToSend} onboarding email to ${email} (User: ${userId})...`);
        const sendResult = await sendOnboardingEmail({
          email,
          name,
          type: emailTypeToSend
        });

        if (sendResult) {
          // Log to database
          const { error: insertError } = await supabase
            .from("onboarding_emails")
            .insert({
              user_id: userId,
              user_email: email,
              email_type: emailTypeToSend
            });

          if (insertError) {
            console.error(`Failed to log sent email to DB for ${email}:`, insertError.message);
          } else {
            processedLogs.push({ userId, email, type: emailTypeToSend });
          }
        } else {
          console.error(`Failed to send email to ${email} via Resend`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedLogs.length,
      logs: processedLogs
    });

  } catch (err) {
    console.error("Onboarding cron error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
