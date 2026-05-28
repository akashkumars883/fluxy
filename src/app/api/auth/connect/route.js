import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import crypto from "node:crypto";

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

  const appId = process.env.FACEBOOK_APP_ID?.trim() || process.env.INSTAGRAM_APP_ID?.trim();
  if (!appId) {
    return NextResponse.json({ error: "Missing FACEBOOK_APP_ID or INSTAGRAM_APP_ID" }, { status: 500 });
  }
  const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
  const redirectUri = isLocal 
    ? `${origin}/api/auth/callback/facebook`
    : "https://www.automixa.in/api/auth/callback/facebook";
  
  // Pass a nonce-bound state to retrieve persona and prevent callback CSRF.
  const nonce = crypto.randomUUID();
  const state = JSON.stringify({ nonce, persona: role, provider: "instagram" });
  
  // 2. Facebook Login for Business requires a Configuration ID
  const configId = process.env.NEXT_PUBLIC_FB_CONFIG_ID || "";

  const authParams = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    state,
    response_type: "code",
    auth_type: "rerequest",
  });

  if (configId) {
    authParams.set("config_id", configId);
    authParams.set("override_default_response_type", "true");
  } else {
    const facebookScopes = [
      "instagram_basic",
      "instagram_manage_comments",
      "instagram_manage_messages",
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_metadata",
      "public_profile"
    ].join(",");
    authParams.set("scope", facebookScopes);
  }

  const fbAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?${authParams.toString()}`;

  const response = NextResponse.redirect(fbAuthUrl);
  response.cookies.set("automixa_meta_oauth_state", nonce, {
    httpOnly: true,
    sameSite: "lax",
    secure: !isLocal,
    maxAge: 10 * 60,
    path: "/",
  });
  return response;
}
