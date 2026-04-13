import UpdatePasswordUI from '@/components/ForgotPassword/UpdatePasswordUi';
import { setRecoveredPassword } from '@/app/action/authActions'; 
import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Set New Password | Asaya Admin',
};

export default async function UpdatePasswordPage() {
  // 🌟 Optional but smart: Double check they actually have a cookie before showing the UI
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return <UpdatePasswordUI setRecoveredPassword={setRecoveredPassword} />;
}