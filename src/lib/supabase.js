import { createBrowserClient, createServerClient } from "@supabase/ssr";

/**
 * Universal Supabase client.
 * - Browser: createBrowserClient with realtime and auth options.
 * - Server: createServerClient with cookie helpers.
 */
export function createClient() {
  // Browser (client-side)
  if (typeof window !== "undefined") {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        realtime: {}, // enables realtime using derived WS URL
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    );
  }

  // Server-side (SSR)
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        async get(name) {
          try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            return cookieStore.get(name)?.value;
          } catch {
            return undefined;
          }
        },
        async set(name, value, options) {
          try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            cookieStore.set(name, value, options);
          } catch {}
        },
        async remove(name, options) {
          try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          } catch {}
        },
      },
      realtime: {}, // ensure WS URL works on server side
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );
}

/**
 * Admin client for background tasks (bypasses RLS).
 */
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get() {
          return "";
        },
        set() {},
        remove() {},
      },
    }
  );
}
