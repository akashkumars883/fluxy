import { NextResponse } from 'next/server' // Line 1: Response handle karne ke liye
import { createClient } from '@/lib/supabase' // Line 2: Supabase setup

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url) // Line 5: URL se parameters nikal rahe hain
  const code = searchParams.get('code') // Line 6: Meta/Google se aaya hua temporary code
  
  // Agla path kahan jana hai (Defualt: Dashboard)
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient() // Line 11: Server-side client
    
    // Line 13: Temporary code ko exchange karke ek real User Session banana
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
