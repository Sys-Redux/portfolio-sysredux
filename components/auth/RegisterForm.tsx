'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setError('');
    setLoading(true);

    try {
      await register(email, password, displayName);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cyber-card max-w-md mx-auto">
      <h2 className="font-['Orbitron'] text-2xl font-bold mb-6 text-center neon-text-dim">
        CREATE ACCOUNT
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded border border-red-500 bg-red-900/20 text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-['Rajdhani'] text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
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
            minLength={6}
            className="w-full p-3 rounded border bg-transparent focus:outline-none focus:border-(--color-primary-cyan)"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        <div>
          <label className="block mb-2 font-['Rajdhani'] text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
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
          className="cyber-btn success w-full"
        >
          {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
        </button>
      </form>

      <p className="text-center mt-4" style={{ color: 'var(--color-text-secondary)' }}>
        Already have an account?{' '}
        <Link href="/login" className="text-(--color-primary-cyan) hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}