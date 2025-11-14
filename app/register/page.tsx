import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Register | SYS-REDUX',
  description: 'Create admin account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-8">
      <RegisterForm />
    </div>
  );
}