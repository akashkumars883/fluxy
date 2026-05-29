import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, fonts (static files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|manifest.json).*)',
  ],
};

export function proxy(req) {
  const url = req.nextUrl.clone();
  
  // Get hostname from request headers
  const hostname = req.headers.get('host') || '';

  // Determine if it's a subdomain
  // For dev: username.localhost:3000
  // For prod: username.automixa.in
  const isLocalhost = hostname.includes('localhost');
  const domain = isLocalhost ? 'localhost:3000' : 'automixa.in';
  
  // Clean the hostname by removing the domain
  const subdomain = hostname.replace(`.${domain}`, '');

  // If there's a valid subdomain (and it's not the root domain or www)
  if (subdomain && subdomain !== hostname && subdomain !== 'www' && subdomain !== domain) {
    // Rewrite the request to our dynamic bio page route
    // e.g. username.automixa.in/ -> /bio/username
    // e.g. username.automixa.in/contact -> /bio/username/contact
    url.pathname = `/bio/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
