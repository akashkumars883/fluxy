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
  const redirectUri = `${new URL(request.url).origin}/api/auth/callback/facebook`;
  
  // 2. Scopes needed for Instagram Automation
  const scopes = [
    'instagram_basic',
    'instagram_manage_comments',
    'instagram_manage_messages',
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_metadata'
  ].join(',');

  // Pass role in state to retrieve it in the callback
  const state = JSON.stringify({ persona: role });
  const fbAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&state=${encodeURIComponent(state)}&response_type=code`;

  return NextResponse.redirect(fbAuthUrl);
}
