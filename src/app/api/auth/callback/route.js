import { NextResponse } from 'next/server' // Line 1: Response handle karne ke liye
import { createClient } from '@/lib/supabase' // Line 2: Supabase setup

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log(`✅ OAuth Exchange Successful. Redirecting to: ${next}`);
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error("❌ OAuth Exchange Error:", error.message);
      console.error("Full Error Details:", error);
    }
  } else {
    console.warn("⚠️ No code received in OAuth callback");
  }

  // If we're here, something went wrong
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
