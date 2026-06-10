import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getRequestOrigin } from '@/lib/request';
import { cookies } from 'next/headers';

function safeInternalPath(value) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard';
  }
  return value;
}

export async function GET(request) {
  const origin = getRequestOrigin(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeInternalPath(searchParams.get('next'));
  const cookieStore = await cookies();

  // Initialize Supabase client with request cookies for proper session handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookieList) {
          cookieList.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      console.log(`✅ OAuth Exchange Successful. Redirecting to: ${next}`);
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('❌ OAuth Exchange Error:', error);
  } else {
    console.warn('⚠️ No code received in OAuth callback');
  }

  // Fallback: redirect to login with error query param
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
