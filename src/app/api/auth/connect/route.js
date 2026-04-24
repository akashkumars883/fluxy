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

  // 2. Facebook Login for Business requires a Configuration ID
  // You can create this in: App Dashboard > Facebook Login for Business > Configurations
  const configId = process.env.NEXT_PUBLIC_FB_CONFIG_ID || "";
  
  // Pass role in state to retrieve it in the callback
  const state = JSON.stringify({ persona: role });
  
  // Use config_id instead of raw scope strings for v21.0 business permissions
  let fbAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&response_type=code`;
  
  if (configId) {
    fbAuthUrl += `&config_id=${configId}`;
  } else {
    // Fallback to traditional scopes if no configId is provided (unlikely to work for granular review permissions)
    const scopes = [
        'instagram_basic',
        'instagram_manage_comments',
        'instagram_manage_insights',
        'instagram_manage_messages',
        'pages_show_list',
        'pages_read_engagement',
        'pages_manage_metadata'
    ].join(',');
    fbAuthUrl += `&scope=${scopes}`;
  }

  return NextResponse.redirect(fbAuthUrl);
}
