import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    // Ignore API routes, static files, next internals, etc.
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Define our base domains (including localhost for dev if needed)
  const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");
  const mainDomain = isLocalhost ? "localhost:3000" : "automixa.in";

  // Check if we are on a subdomain (e.g. username.automixa.in)
  // Exclude "www" from being treated as a user profile
  if (
    hostname !== mainDomain &&
    hostname !== `www.${mainDomain}` &&
    hostname.endsWith(`.${mainDomain}`)
  ) {
    const subdomain = hostname.replace(`.${mainDomain}`, "");

    // Rewrite subdomain requests to the bio page
    // e.g., username.automixa.in/ -> /bio/username/
    // e.g., username.automixa.in/contact -> /bio/username/contact
    return NextResponse.rewrite(new URL(`/bio/${subdomain}${url.pathname}`, req.url));
  }

  // Otherwise, just continue normally
  return NextResponse.next();
}
