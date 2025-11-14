import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login | SYS-REDUX',
  description: 'Admin login page',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-8">
      <LoginForm />
    </div>
  );
}