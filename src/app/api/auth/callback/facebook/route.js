import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase';
import { MetaService } from '@/lib/meta';
import { encryptToken } from '@/lib/security';
import { cookies } from "next/headers";
import { getRequestOrigin } from '@/lib/request';

export async function GET(request) {
  const origin = getRequestOrigin(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description') || searchParams.get('error_reason');

  if (error || !code) {
    console.error("Meta OAuth Error:", error, errorDescription || "");
    const reason = errorDescription || error || "missing_code";
    return NextResponse.redirect(`${origin}/dashboard?error=meta_auth_failed&reason=${encodeURIComponent(reason)}`);
  }

  const supabase = createClient();
  
  // 1. Get current logged-in user
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  } catch (e) {
    console.warn("Auth check failed, checking for local dev bypass:", e.message);
  }

  const supabaseAdmin = createAdminClient();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  try {
    const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
    const redirectUri = isLocal
      ? `${origin}/api/auth/callback/facebook`
      : "https://www.automixa.in/api/auth/callback/facebook";

    // 2. Exchange code for short-lived user token (Facebook Flow)
    const tokenResult = await MetaService.exchangeCodeForToken(code, redirectUri);
    if (!tokenResult.success) throw new Error(tokenResult.error);

    // 3. Convert to Long-Lived User Token
    const longLivedResult = await MetaService.getLongLivedToken(tokenResult.accessToken);
    if (!longLivedResult.success) throw new Error(longLivedResult.error);

    const userToken = longLivedResult.accessToken;

    // 1b. Parse persona from state
    let persona = 'business';
    const stateParam = searchParams.get('state');
    const cookieStore = await cookies();
    const expectedNonce = cookieStore.get("automixa_meta_oauth_state")?.value;
    if (stateParam) {
      try {
        const state = JSON.parse(stateParam);
        if (!expectedNonce || state.nonce !== expectedNonce) {
          throw new Error("Invalid OAuth state");
        }
        persona = state.persona || 'business';
      } catch (e) {
        console.error("Error parsing state:", e);
        return NextResponse.redirect(`${origin}/dashboard?error=invalid_oauth_state`);
      }
    } else {
      return NextResponse.redirect(`${origin}/dashboard?error=missing_oauth_state`);
    }

    // 4. Fetch Instagram Accounts connected to the user's Facebook Pages
    const accountsResult = await MetaService.getInstagramAccounts(userToken);
    if (!accountsResult.success) throw new Error(accountsResult.error);

    if (!accountsResult.accounts || accountsResult.accounts.length === 0) {
      throw new Error("No connected Instagram Business accounts found on your Facebook Pages.");
    }

    // We take the first connected Instagram account
    const account = accountsResult.accounts[0];
    const { page_id: pageId, page_name: pageName, page_token: pageToken, instagram_business_id: instagramId } = account;

    if (!instagramId) {
      throw new Error("Instagram profile did not return a connected account ID");
    }

    // 5. Fetch IG profile details using the business ID and page token
    const profileResult = await MetaService.getInstagramBusinessProfile(instagramId, pageToken);
    if (!profileResult.success) throw new Error(profileResult.error);
    const profile = profileResult.data;
    const username = profile.username || `instagram_${instagramId}`;
    const accountType = "BUSINESS";

    // 6. Subscribe the Facebook Page to Webhooks (for DMs via FB Messenger)
    console.log(`Subscribing Facebook Page ID: ${pageId} to Webhooks...`);
    const subscriptionResult = await MetaService.subscribePageToWebhooks(pageId, pageToken);
    if (!subscriptionResult.success) {
      console.warn(`⚠️ FB Page Webhook Subscription Warning for ${username}:`, subscriptionResult.error);
    } else {
      console.log(`✅ FB Page Webhook Subscription Successful for ${username}`);
    }

    // 7. Instagram webhooks (Comments) are configured in App Dashboard.
    // Instagram Messaging webhooks are routed through the Facebook Page subscription above.
    console.log(`Instagram Business Account ID: ${instagramId} is ready.`);

    const encryptedToken = encryptToken(pageToken);

    const { data: savedAutomation, error: upsertError } = await supabaseAdmin
      .from('automations')
      .upsert({
        user_id: user.id,
        page_id: instagramId,
        page_name: username,
        access_token: encryptedToken,
        ig_business_id: instagramId,
        is_active: true,
        persona,
        metadata: {
          auth_provider: "facebook_login",
          username,
          account_type: accountType,
          profile_picture_url: profile.profile_picture_url || null,
          token_expires_in: "never",
          facebook_page_id: pageId,
          facebook_page_name: pageName
        },
      }, {
        onConflict: 'page_id'
      })
      .select("id,page_name,ig_business_id")
      .single();

    if (upsertError) {
      console.error(`DB Upsert Error for ${username}:`, upsertError.message);
      throw new Error(upsertError.message);
    }

    return NextResponse.redirect(
      `${origin}/dashboard?success=instagram_connected&account=${encodeURIComponent(username)}&ig=${encodeURIComponent(instagramId)}&automation=${encodeURIComponent(savedAutomation?.id || "")}&profile_pic=${encodeURIComponent(profile.profile_picture_url || "")}`
    );

  } catch (err) {
    console.error("Critical Callback Error:", err.message);
    return NextResponse.redirect(`${origin}/dashboard?error=connection_failed&reason=${encodeURIComponent(err.message)}`);
  }
}
