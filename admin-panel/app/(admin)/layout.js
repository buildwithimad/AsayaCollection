import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer'; 
import AdminLayoutClient from '@/components/AdminLayoutClient';

export default async function AdminMasterLayout({ children }) {
  
  // 🌟 IMPORTANT: Add 'await' right here
  const supabase = await createClient();

  // 1. Securely read the authentication cookie
  const { data, error } = await supabase.auth.getUser();

  const user = data?.user;
  const userRole = user?.user_metadata?.role;

  // 2. If no cookie or wrong role, kick them out
  if (error || !user || userRole !== 'superAdmin') {
    redirect('/'); 
  }

  // 3. Granted Access
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}