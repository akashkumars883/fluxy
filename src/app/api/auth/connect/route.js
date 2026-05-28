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

  const appId = process.env.INSTAGRAM_APP_ID?.trim() || process.env.FACEBOOK_APP_ID?.trim();
  if (!appId) {
    return NextResponse.json({ error: "Missing INSTAGRAM_APP_ID or FACEBOOK_APP_ID" }, { status: 500 });
  }
  const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
  
  // Use the new instagram callback URI
  const redirectUri = isLocal 
    ? `${origin}/api/auth/callback/instagram`
    : "https://www.automixa.in/api/auth/callback/instagram";
  
  // Pass a nonce-bound state to retrieve persona and prevent callback CSRF.
  const nonce = crypto.randomUUID();
  const state = JSON.stringify({ nonce, persona: role, provider: "instagram" });
  
  const authParams = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    state,
    response_type: "code",
    scope: ["instagram_business_basic", "instagram_business_manage_messages", "instagram_business_manage_comments"].join(",")
  });

  // Direct Instagram Login for Business Endpoint
  const igAuthUrl = `https://www.instagram.com/oauth/authorize?${authParams.toString()}`;

  const response = NextResponse.redirect(igAuthUrl);
  response.cookies.set("automixa_meta_oauth_state", nonce, {
    httpOnly: true,
    sameSite: "lax",
    secure: !isLocal,
    maxAge: 10 * 60,
    path: "/",
  });
  return response;
}
