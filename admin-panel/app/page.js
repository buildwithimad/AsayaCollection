import AdminLoginUI from '@/components/AdminLoginUi';
import { processAdminLogin } from '@/app/action/authActions'; // Adjust the import path if needed

export const metadata = {
  title: 'Admin Panel | Asaya Collection',
  robots: 'noindex, nofollow', 
};

// Notice we don't even need 'async' here anymore!
export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#fdfbfb] flex items-center justify-center font-sans">
      {/* Now it safely passes the standalone server function */}
      <AdminLoginUI loginAction={processAdminLogin} />
    </main>
  );
}