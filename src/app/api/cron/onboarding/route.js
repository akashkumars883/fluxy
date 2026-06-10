import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOnboardingEmail } from "@/lib/resend";

export async function GET(req) {
  try {
    const reqUrl = new URL(req.url);
    const authHeader = req.headers.get("authorization");
    const secret = reqUrl.searchParams.get("secret") || (authHeader ? authHeader.replace("Bearer ", "") : "");

    const cronSecret = process.env.CRON_SECRET;

    // SECURITY: Reject if no CRON_SECRET is configured in environment.
    // Previously the code fell back to a hardcoded default which is a critical
    // vulnerability (anyone could trigger bulk emails).
    if (!cronSecret) {
      console.error("CRON_SECRET environment variable is not set. Rejecting request.");
      return new Response("Server misconfigured", { status: 500 });
    }

    if (!secret || secret !== cronSecret) {
      return new Response("Unauthorized", { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // 1. Fetch users from auth admin API
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({ perPage: 1000 });

    if (authError) {
      throw authError;
    }

    const allUsers = authData?.users || [];
    const recentUsers = allUsers.filter(u => new Date(u.created_at) > new Date(sevenDaysAgo));

    // 2. Fetch already sent onboarding emails
    const { data: sentEmails, error: sentError } = await supabase
      .from("onboarding_emails")
      .select("user_id, email_type");

    if (sentError) {
      throw sentError;
    }

    // 3. Find if these recent users have any automations (Instagram connected)
    const userIds = recentUsers.map(u => u.id);
    
    let usersWithInstagram = new Set();
    if (userIds.length > 0) {
      const { data: automations, error: autoError } = await supabase
        .from("automations")
        .select("user_id, id")
        .in("user_id", userIds);
        
      if (!autoError) {
        usersWithInstagram = new Set(automations?.map(a => a.user_id) || []);
      }
    }

    const uniqueUsers = new Map();
    for (const u of recentUsers) {
      uniqueUsers.set(u.id, {
        user_id: u.id,
        email: u.email,
        name: u.user_metadata?.full_name || u.user_metadata?.name || "there",
        created_at: u.created_at,
        hasInstagram: usersWithInstagram.has(u.id)
      });
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
        const { email, name } = userDetails;

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
