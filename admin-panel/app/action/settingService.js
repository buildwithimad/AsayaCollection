'use server';

import { createClient } from '@/lib/supabaseServer';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const getAdminSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env");

  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
};

// 1. UPDATE PROFILE
export async function updateProfileAction(formData) {
  const newName = formData.get('name');
  
  // 🌟 Server-Side Validation
  let errors = {};
  if (!newName || newName.trim().length < 2) errors.name = "Name must be at least 2 characters long.";
  if (Object.keys(errors).length > 0) return { success: false, errors };

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { success: false, message: "Not authenticated" };

  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: newName, name: newName }
  });

  if (authError) return { success: false, message: authError.message };

  const { error: dbError } = await supabase
    .from('users') // Change to your actual table name if different (e.g., 'profiles')
    .update({ full_name: newName }) 
    .eq('id', user.id);

  await supabase.auth.refreshSession();

  return { success: true, message: "Profile updated successfully." };
}

// 2. UPDATE PASSWORD
export async function updatePasswordAction(formData, email) {
  const currentPassword = formData.get('currentPassword');
  const newPassword = formData.get('password');

  // 🌟 Server-Side Validation
  let errors = {};
  if (!currentPassword) errors.currentPassword = "Current password is required.";
  if (!newPassword || newPassword.length < 8) errors.password = "New password must be at least 8 characters.";
  if (Object.keys(errors).length > 0) return { success: false, errors };

  const tempClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY, 
    { auth: { persistSession: false } }
  );

  const { error: signInError } = await tempClient.auth.signInWithPassword({
    email: email,
    password: currentPassword
  });

  if (signInError) return { success: false, errors: { currentPassword: "The current password you entered is incorrect." } };

  const supabase = await createClient();
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (updateError) return { success: false, message: updateError.message };
  return { success: true, message: "Password updated successfully." };
}

// 3. GET ALL ADMINS
// 3. GET ONLY SUPER ADMINS
export async function getAllAdmins() {
  try {
    const supabaseAdmin = getAdminSupabase();
    
    // Fetch all users from the Auth system
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) return [];
    
    return data.users
      // 🌟 NEW: Filter out everyone EXCEPT superadmins
      .filter(u => 
        u.user_metadata?.role === 'superadmin' || 
        u.user_metadata?.role === 'superAdmin'
      )
      // 🌟 Map the remaining VIP users
      .map(u => ({
        id: u.id,
        email: u.email,
        name: u.user_metadata?.full_name || 'Admin',
        role: u.user_metadata?.role,
        created_at: u.created_at
      }))
      // Sort newest first
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
  } catch (error) {
    console.error("Admin fetch error:", error);
    return [];
  }
}

// 4. ADD NEW SUPER ADMIN
export async function addAdminAction(formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const name = formData.get('name');

  // 🌟 Server-Side Validation
  let errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || name.trim().length < 2) errors.name = "Full name is required.";
  if (!email || !emailRegex.test(email)) errors.email = "Please enter a valid email address.";
  if (!password || password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (Object.keys(errors).length > 0) return { success: false, errors };

  try {
    const supabaseAdmin = getAdminSupabase();

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: name, role: 'superAdmin' }
    });

    if (error) {
      if (error.message.includes("already registered")) return { success: false, errors: { email: "This email is already registered." } };
      return { success: false, message: error.message };
    }
    return { success: true, message: `Admin account created successfully.` };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// 5. DELETE ADMIN
export async function deleteAdminAction(adminId) {
  try {
    const supabaseAdmin = getAdminSupabase();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(adminId);
    if (error) return { success: false, message: error.message };
    return { success: true, message: "Admin removed successfully." };
  } catch (error) {
    return { success: false, message: error.message };
  }
}