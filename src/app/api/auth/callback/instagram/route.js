import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { MetaService } from '@/lib/meta';
import { encryptToken } from '@/lib/security';
import { cookies } from "next/headers";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description') || searchParams.get('error_reason');

  if (error || !code) {
    console.error("Instagram OAuth Error:", error, errorDescription || "");
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

  // Local development bypass if not logged in to Supabase
  if (!user) {
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      user = { id: 'dev-bypass' };
    } else {
      return NextResponse.redirect(`${origin}/login`);
    }
  }

  try {
    const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
    const redirectUri = isLocal
      ? `${origin}/api/auth/callback/instagram`
      : "https://www.automixa.in/api/auth/callback/instagram";

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

    // 2. Exchange code for short-lived user token (Instagram Flow)
    const tokenResult = await MetaService.exchangeInstagramCodeForToken(code, redirectUri);
    if (!tokenResult.success) throw new Error(tokenResult.error);

    // 3. Convert to Long-Lived User Token
    const longLivedResult = await MetaService.getLongLivedInstagramToken(tokenResult.accessToken);
    if (!longLivedResult.success) throw new Error(longLivedResult.error);

    const userToken = longLivedResult.accessToken;
    const instagramId = tokenResult.userId;

    // 4. Fetch IG profile details
    const profileResult = await MetaService.getInstagramProfile(userToken);
    if (!profileResult.success) throw new Error(profileResult.error);
    const profile = profileResult.data;
    const username = profile.username || `instagram_${instagramId}`;
    const accountType = profile.account_type || "BUSINESS";

    // 5. Subscribe the Instagram account to Webhooks
    console.log(`Subscribing Instagram Account ID: ${instagramId} to Webhooks...`);
    const subscriptionResult = await MetaService.subscribeAccount(userToken);
    if (!subscriptionResult.success) {
      console.warn(`⚠️ Webhook Subscription Warning for ${username}:`, subscriptionResult.error);
    } else {
      console.log(`✅ Webhook Subscription Successful for ${username} (${instagramId})`);
    }

    const encryptedToken = encryptToken(userToken);

    const { data: savedAutomation, error: upsertError } = await supabase
      .from('automations')
      .upsert({
        user_id: user.id,
        page_id: instagramId, // In direct IG auth, page_id is essentially the IG Business ID
        page_name: username,
        access_token: encryptedToken,
        ig_business_id: instagramId,
        is_active: true,
        persona,
        metadata: {
          auth_provider: "instagram_login",
          username,
          account_type: accountType,
          profile_picture_url: profile.profile_picture_url || null,
          token_expires_in: longLivedResult.expiresIn || "60_days"
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
      `${origin}/dashboard?success=instagram_connected&account=${encodeURIComponent(username)}&ig=${encodeURIComponent(instagramId)}&automation=${encodeURIComponent(savedAutomation?.id || "")}`
    );

  } catch (err) {
    console.error("Critical Callback Error:", err.message);
    return NextResponse.redirect(`${origin}/dashboard?error=connection_failed&reason=${encodeURIComponent(err.message)}`);
  }
}
