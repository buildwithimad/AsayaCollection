import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// 1. Add "async" here
export async function createClient() {
  // 2. Add "await" here!
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // This catches errors if we try to set cookies from a read-only Server Component
          }
        },
      },
    }
  );
}