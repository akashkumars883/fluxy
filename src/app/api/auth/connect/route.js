import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request) {
  const supabase = createClient();
  
  // 1. Ensure user is authenticated locally first
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  } catch {
    console.warn("Auth check failed in connect, checking local dev bypass");
  }

  const { searchParams, origin } = new URL(request.url);
  if (!user) {
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      user = { id: 'dev-bypass' };
    } else {
      return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
    }
  }
  const role = searchParams.get('role') || 'business';

  const appId = process.env.INSTAGRAM_APP_ID?.trim();
  if (!appId) {
    return NextResponse.json({ error: "Missing INSTAGRAM_APP_ID" }, { status: 500 });
  }
  const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
  const redirectUri = isLocal 
    ? `${origin}/api/auth/callback/facebook`
    : "https://www.automixa.in/api/auth/callback/facebook";
  
  // Pass role in state to retrieve it in the callback
  const state = JSON.stringify({ persona: role, provider: "instagram" });
  
  const instagramScopes = [
    "instagram_business_basic",
    "instagram_business_manage_comments",
    "instagram_business_manage_messages"
  ].join(",");

  const authUrl =
    `https://www.instagram.com/oauth/authorize?client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${encodeURIComponent(state)}` +
    `&scope=${encodeURIComponent(instagramScopes)}` +
    `&response_type=code` +
    `&enable_fb_login=0` +
    `&force_authentication=1`;

  return NextResponse.redirect(authUrl);
}
