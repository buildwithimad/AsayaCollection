'use server';

import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';

export async function processAdminLogin(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // 🌟 IMPORTANT: Add 'await' right here
  const supabase = await createClient(); 

  // 1. Attempt standard authentication
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return { success: false, message: "Invalid credentials." };
  }

  // 2. STRICT ROLE VERIFICATION
  const userRole = data.user?.user_metadata?.role;

  if (userRole !== 'superAdmin') {
    await supabase.auth.signOut();
    return { 
      success: false, 
      message: "Access Denied. SuperAdmin clearance required." 
    };
  }

  // 3. Success! 
  redirect('/dashboard');
}


export async function processAdminLogout() {
  const supabase = await createClient();
  
  // Destroys the session and clears the secure cookies
  await supabase.auth.signOut();
  
  // Instantly redirect back to the login page
  redirect('/');
}