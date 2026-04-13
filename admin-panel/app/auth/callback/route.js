import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // 'next' is where we want to send them after setting the cookie
  const next = searchParams.get('next') ?? '/update-password';

  if (code) {
    const supabase = await createClient();
    
    // 🌟 Because this is a Route Handler, it is ALLOWED to save the cookie!
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Cookie saved successfully! Redirect to the clean UI.
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If the code is broken or expired, kick them back to login
  return NextResponse.redirect(`${origin}/login?error=Invalid_link`);
}