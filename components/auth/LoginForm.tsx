'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cyber-card max-w-md mx-auto">
      <h2 className="font-['Orbitron'] text-2xl font-bold mb-6 text-center neon-text-dim">
        ADMIN LOGIN
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded border border-red-500 bg-red-900/20 text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-['Rajdhani'] text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded border bg-transparent focus:outline-none focus:border-(--color-primary-cyan)"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        <div>
          <label className="block mb-2 font-['Rajdhani'] text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded border bg-transparent focus:outline-none focus:border-(--color-primary-cyan)"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cyber-btn w-full"
        >
          {loading ? 'LOGGING IN...' : 'LOGIN'}
        </button>
      </form>

      <p className="text-center mt-4" style={{ color: 'var(--color-text-secondary)' }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-(--color-primary-cyan) hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}