/**
 * Helper to get the correct public origin (base URL) from a Request.
 * This handles cases where the Next.js server is running behind Nginx, Cloudflare, or other reverse proxies.
 * 
 * @param {Request} request 
 * @returns {string}
 */
export function getRequestOrigin(request) {
  const { origin } = new URL(request.url);
  
  // Read proxy headers
  const xForwardedHost = request.headers.get('x-forwarded-host');
  const host = request.headers.get('host');
  
  // Prioritize X-Forwarded-Host, then Host header
  const targetHost = xForwardedHost || host;
  if (!targetHost) return origin;
  
  // Determine protocol (HTTPS/HTTP)
  const proto = request.headers.get('x-forwarded-proto') || (request.url.startsWith('https') ? 'https' : 'http');
  
  return `${proto}://${targetHost}`;
}
