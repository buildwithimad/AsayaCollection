'use server';

import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import { createClient as createAdminClient } from '@supabase/supabase-js';




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


export async function forgotPasswordAction(formData) {
  const email = formData.get('email')?.toLowerCase().trim();

  if (!email) {
    return { success: false, message: "Email is required." };
  }

  // 1. Initialize Admin Supabase to securely check user roles bypassing RLS
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return { success: false, message: "Server configuration error." };

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // 2. Fetch the user list to inspect their hidden metadata
  const { data: { users }, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (fetchError) {
    return { success: false, message: "Failed to verify system permissions." };
  }

  // 3. Find the user by email
  const targetUser = users.find(u => u.email?.toLowerCase() === email);

  // 4. 🌟 SECURITY CHECK: Verify if they exist AND if they are a SuperAdmin
  const userRole = targetUser?.user_metadata?.role?.toLowerCase();
  const isSuperAdmin = userRole === 'superadmin' || userRole === 'superAdmin';

  if (!targetUser || !isSuperAdmin) {
    // We reject the request if they are not an admin (or if the email doesn't exist)
    return { success: false, message: "Unauthorized: This email does not have Admin privileges." };
  }

  // 5. If they passed the check, initialize the standard client and send the email
  const supabase = await createClient(); 
  
  // Note: Ensure this URL matches the URL Configuration in your Supabase Auth settings

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/auth/callback?next=/update-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetUrl,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "A secure reset link has been sent to your email." };
}


// Action for your new /update-password page
export async function setRecoveredPassword(formData) {
  const newPassword = formData.get('password');
  const supabase = await createClient();

  // 1. Get the current user (Supabase auto-logs them in when they click the email link)
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "Invalid or expired recovery link. Please try again." };
  }

  // 2. 🌟 ULTIMATE SECURITY CHECK: Verify they are actually a SuperAdmin
  const userRole = user.user_metadata?.role?.toLowerCase();
  
  if (userRole !== 'superadmin' && userRole !== 'superAdmin') {
    // If they aren't an admin, immediately destroy their session and kick them out
    await supabase.auth.signOut();
    return { success: false, message: "Unauthorized: You do not have Admin privileges." };
  }

  // 3. Updates the password for the verified Admin
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) return { success: false, message: error.message };
  
  return { success: true, message: "Password successfully recovered!" };
}