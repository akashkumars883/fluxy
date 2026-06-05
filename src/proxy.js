import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, fonts (static files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|manifest.json|manifest.webmanifest).*)',
  ],
};

export async function proxy(req) {
  const url = req.nextUrl.clone();
  
  // 1. Establish the response object and Supabase server client to manage authentication
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Authenticate user session against Supabase Auth API
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;
  const isLocalDev = req.nextUrl.hostname === 'localhost' || req.nextUrl.hostname === '127.0.0.1';

  // Protect /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!user && !isLocalDev) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Redirect authenticated users away from /login
  if (pathname.startsWith("/login")) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // 2. Original Subdomain / Bio Rewriting Logic
  const hostname = req.headers.get('host') || '';
  const isLocalhost = hostname.includes('localhost');
  const domain = isLocalhost ? 'localhost:3000' : 'automixa.in';
  const subdomain = hostname.replace(`.${domain}`, '');

  if (subdomain && subdomain !== hostname && subdomain !== 'www' && subdomain !== domain) {
    url.pathname = `/bio/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
    const rewriteResponse = NextResponse.rewrite(url);
    
    // Copy any set-cookie headers from Supabase response to the rewritten response
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        rewriteResponse.headers.append(key, value);
      }
    });
    return rewriteResponse;
  }

  return response;
}
