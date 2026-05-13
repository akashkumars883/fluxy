import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { MetaService } from '@/lib/meta';
import { encryptToken } from '@/lib/security';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    console.error("Meta OAuth Error:", error);
    return NextResponse.redirect(`${origin}/dashboard?error=meta_auth_failed`);
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
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || origin).replace(/\/+$/, '');
    const redirectUri = `${baseUrl}/api/auth/callback/facebook`;
    console.log("[CALLBACK] redirect_uri used for token exchange:", JSON.stringify(redirectUri));

    // 2. Exchange Instagram Login for Business code for a short-lived token
    const tokenResult = await MetaService.exchangeInstagramCodeForToken(code, redirectUri);
    if (!tokenResult.success) throw new Error(tokenResult.error);

    // 3. Convert to Long-Lived Instagram Token (60 days)
    const longLivedResult = await MetaService.getLongLivedInstagramToken(tokenResult.accessToken);
    if (!longLivedResult.success) throw new Error(longLivedResult.error);

    const instagramToken = longLivedResult.accessToken;

    // 1b. Parse persona from state
    let persona = 'business';
    const stateParam = searchParams.get('state');
    if (stateParam) {
      try {
        const state = JSON.parse(stateParam);
        persona = state.persona || 'business';
      } catch (e) {
        console.error("Error parsing state:", e);
      }
    }

    // 4. Fetch the connected Instagram Business/Creator account
    const profileResult = await MetaService.getInstagramProfile(instagramToken);
    if (!profileResult.success) throw new Error(profileResult.error);

    const profile = profileResult.data;
    const instagramId = String(profile.user_id || profile.id || tokenResult.userId);
    if (!instagramId || instagramId === "undefined") {
      throw new Error("Instagram profile did not return a connected account ID");
    }
    const username = profile.username || `instagram_${instagramId}`;
    const accountType = profile.account_type || "BUSINESS";
    const encryptedToken = encryptToken(instagramToken);

    const { data: savedAutomation, error: upsertError } = await supabase
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
          auth_provider: "instagram_login_for_business",
          username,
          account_type: accountType,
          profile_picture_url: profile.profile_picture_url || null,
          permissions: tokenResult.permissions || [],
          token_expires_in: longLivedResult.expiresIn || null,
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
    return NextResponse.redirect(`${origin}/dashboard?error=connection_failed`);
  }
}
