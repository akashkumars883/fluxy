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
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  try {
    const redirectUri = `${origin}/api/auth/callback/facebook`;

    // 2. Exchange code for short-lived User Access Token
    const tokenResult = await MetaService.exchangeCodeForToken(code, redirectUri);
    if (!tokenResult.success) throw new Error(tokenResult.error);

    // 3. Convert to Long-Lived User Token (60 days)
    const longLivedResult = await MetaService.getLongLivedToken(tokenResult.accessToken);
    if (!longLivedResult.success) throw new Error(longLivedResult.error);

    const userToken = longLivedResult.accessToken;

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

    // 4. Fetch Instagram accounts linked to this user's pages
    const accountsResult = await MetaService.getInstagramAccounts(userToken);
    if (!accountsResult.success) throw new Error(accountsResult.error);

    if (accountsResult.accounts.length === 0) {
      return NextResponse.redirect(`${origin}/dashboard?error=no_instagram_accounts_found`);
    }

    // 5. Save/Update each account in the database
    for (const account of accountsResult.accounts) {
      const encryptedToken = encryptToken(account.page_token);

      const { error: upsertError } = await supabase
        .from('automations')
        .upsert({
          user_id: user.id,
          page_id: account.page_id,
          page_name: account.page_name,
          access_token: encryptedToken,
          ig_business_id: account.instagram_business_id,
          is_active: true,
          persona: persona // Saving the selected persona
        }, {
          onConflict: 'page_id'
        });

      if (upsertError) {
        console.error(`DB Upsert Error for ${account.page_name}:`, upsertError.message);
      }
    }

    return NextResponse.redirect(`${origin}/dashboard?success=instagram_connected`);

  } catch (err) {
    console.error("Critical Callback Error:", err.message);
    return NextResponse.redirect(`${origin}/dashboard?error=connection_failed`);
  }
}
