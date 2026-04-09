import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer'; 
import AdminLayoutClient from '@/components/AdminLayoutClient';
import { UserProvider } from '@/context/userContext';
import AdminSyncHandler from '@/components/AdminSyncHandler'; // 🌟 Import here

export default async function AdminMasterLayout({ children }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  const user = data?.user;
  const userRole = user?.user_metadata?.role;

  if (error || !user || userRole !== 'superAdmin') {
    redirect('/'); 
  }

  return (
    <UserProvider user={user}>
      {/* 🌟 Add it here. It renders nothing, but runs the useEffect logic */}
      <AdminSyncHandler /> 
      
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </UserProvider>
  );
}