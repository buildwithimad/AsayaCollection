import ForgotPasswordUI from '@/components/ForgotPassword/ForgotPassword'; // Adjust path
import { forgotPasswordAction } from '@/app/action/authActions'; // Adjust path

export const metadata = {
  title: 'Recover Access | Asaya Admin',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordUI forgotPasswordAction={forgotPasswordAction} />;
}