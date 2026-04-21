import { createServerClient, createBrowserClient } from "@supabase/ssr";

/**
 * Universal Supabase Client
 * Automatically detects if running on Server (SSR) or Browser (Client)
 */
export function createClient() {
    if (typeof window !== "undefined") {
        return createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
    }

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
                    } catch (e) {
                        return undefined;
                    }
                },
                async set(name, value, options) {
                    try {
                        const { cookies } = await import("next/headers");
                        const cookieStore = await cookies();
                        cookieStore.set(name, value, options);
                    } catch (e) {
                    }
                },
                async remove(name, options) {
                    try {
                        const { cookies } = await import("next/headers");
                        const cookieStore = await cookies();
                        cookieStore.set(name, "", { ...options, maxAge: 0 });
                    } catch (e) {
                    }
                },
            },
        }
    )
}

/**
 * Admin client for background tasks (Bypasses RLS)
 */
export function createAdminClient() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            cookies: {
                get() { return "" },
                set() {},
                remove() {},
            },
        }
    )
}
