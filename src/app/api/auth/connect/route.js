import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import crypto from "node:crypto";
import { getRequestOrigin } from '@/lib/request';

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

  const origin = getRequestOrigin(request);
  const { searchParams } = new URL(request.url);
  if (!user) {
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      user = { id: 'dev-bypass' };
    } else {
      return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
    }
  }
  const role = searchParams.get('role') || 'business';
  const provider = searchParams.get('provider') || 'facebook';

  const appId = process.env.FACEBOOK_APP_ID?.trim() || process.env.INSTAGRAM_APP_ID?.trim();
  const igAppId = process.env.INSTAGRAM_APP_ID?.trim() || appId;
  
  if (!appId) {
    return NextResponse.json({ error: "Missing INSTAGRAM_APP_ID or FACEBOOK_APP_ID" }, { status: 500 });
  }
  const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
  
  const redirectUri = isLocal 
    ? `${origin}/api/auth/callback/${provider}`
    : `https://www.automixa.in/api/auth/callback/${provider}`;
  
  // Pass a nonce-bound state to retrieve persona and prevent callback CSRF.
  const nonce = crypto.randomUUID();
  const state = JSON.stringify({ nonce, persona: role, provider });
  
  let authUrl = "";
  if (provider === 'instagram') {
    const igAuthParams = new URLSearchParams({
      client_id: igAppId,
      redirect_uri: redirectUri,
      state,
      response_type: "code",
      scope: ["instagram_business_basic", "instagram_business_manage_messages", "instagram_business_content_publish"].join(",")
    });
    authUrl = `https://api.instagram.com/oauth/authorize?${igAuthParams.toString()}`;
  } else {
    const authParams = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      state,
      response_type: "code",
      auth_type: "rerequest",
      scope: ["pages_show_list", "instagram_basic", "instagram_manage_messages", "instagram_manage_comments", "pages_manage_metadata", "pages_read_engagement", "pages_messaging"].join(",")
    });
    authUrl = `https://www.facebook.com/v21.0/dialog/oauth?${authParams.toString()}`;
  }

  const response = NextResponse.redirect(authUrl);
  response.cookies.set("automixa_meta_oauth_state", nonce, {
    httpOnly: true,
    sameSite: "lax",
    secure: !isLocal,
    maxAge: 10 * 60,
    path: "/",
  });
  return response;
}
