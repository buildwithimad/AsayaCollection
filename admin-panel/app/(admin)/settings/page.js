import { redirect } from 'next/navigation';
import SettingsUI from '@/components/Settings/SettingsUI'; // Ensure this path is correct
import { createClient } from '@/lib/supabaseServer';
import { getAllAdmins } from '@/app/action/settingService'; // Import the fetcher

export const metadata = {
  title: 'Settings | Asaya Admin',
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/');
  }

  const adminDetails = {
    id: user.id, // Needed so they can't delete themselves
    email: user.email,
    name: user.user_metadata?.full_name || 'Admin',
    role: user.user_metadata?.role === 'superAdmin'
  };

  // Fetch the list of all team members
  const allAdmins = await getAllAdmins();

  return <SettingsUI currentAdmin={adminDetails} initialAdmins={allAdmins} />;
}