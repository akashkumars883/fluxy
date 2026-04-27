import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request) {
  const supabase = createClient();
  
  // 1. Ensure user is authenticated locally first
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || 'business';

  const appId = process.env.INSTAGRAM_APP_ID;
  if (!appId) {
    return NextResponse.json({ error: "Missing INSTAGRAM_APP_ID" }, { status: 500 });
  }
  const redirectUri = `${new URL(request.url).origin}/api/auth/callback/facebook`;

  // 2. Facebook Login for Business Configuration ID
  const configId = "1899618614025224";
  
  // Pass role in state to retrieve it in the callback
  const state = JSON.stringify({ persona: role });
  
  const scopes = [
    // Instagram Graph API (required for media/comments/insights automation)
    "instagram_basic",
    "instagram_manage_comments",
    "instagram_manage_insights",
    "instagram_manage_messages",

    // Pages (required to fetch page + IG business account + engagement)
    "pages_show_list",
    "pages_read_engagement",
    "pages_manage_metadata",
  ].join(",");

  // Business Login uses config_id for granular permissions, but we still pass scope explicitly
  // so missing/old configurations don't silently drop required permissions.
  let fbAuthUrl =
    `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${encodeURIComponent(state)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&auth_type=rerequest` +
    `&return_scopes=true`;

  if (configId) fbAuthUrl += `&config_id=${configId}`;

  return NextResponse.redirect(fbAuthUrl);
}
