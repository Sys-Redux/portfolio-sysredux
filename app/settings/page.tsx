'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Shield, Trash2, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { user, loading, deleteAccount } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount();
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. You may need to re-authenticate and try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-8">
      <div className="max-w-[800px] mx-auto">
        <h1 className="font-['Orbitron'] text-4xl font-bold text-text-secondary mb-8">
          ACCOUNT SETTINGS
        </h1>

        {/* Account Info */}
        <div className="cyber-card mb-8">
          <h2 className="font-['Orbitron'] text-2xl font-bold glitch mb-4"
            data-text="ACCOUNT INFORMATION"
          >
            ACCOUNT INFORMATION
          </h2>
          <div className="space-y-2 font-['Rajdhani']" style={{ color: 'var(--color-text-secondary)' }}>
            <p>
              <span className="font-bold" style={{ color: 'var(--color-primary-cyan)' }}>Email:</span>{' '}
              {user.email}
            </p>
            <p>
              <span className="font-bold" style={{ color: 'var(--color-primary-cyan)' }}>Display Name:</span>{' '}
              {user.displayName || 'Not set'}
            </p>
            <p>
              <span className="font-bold" style={{ color: 'var(--color-primary-cyan)' }}>User ID:</span>{' '}
              {user.uid}
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="cyber-card border-2 border-red-900/50">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={24} className="text-red-400" />
            <h2 className="font-['Orbitron'] text-2xl font-bold text-red-400">
              DANGER ZONE
            </h2>
          </div>

          <div className="mb-2 p-4 rounded border border-red-900/50 bg-red-900/10">
            <div className="flex gap-3 mb-2">
              <AlertTriangle size={20} className="text-red-400 shrink-0 mt-1" />
              <div style={{ color: 'var(--color-text-secondary)' }}>
                <p className="font-bold text-red-400 mb-1">Warning: This action cannot be undone!</p>
                <p className="text-sm">Deleting your account will permanently remove:</p>
                <ul className="text-xs list-disc list-inside ml-4 mt-1">
                  <li>Your user profile and authentication</li>
                  <li>All contact form submissions you&apos;ve made</li>
                  <li>Your profile images from storage</li>
                  <li>Any other data associated with your account</li>
                </ul>
              </div>
            </div>
          </div>

          {!showConfirmation ? (
            <button
              onClick={() => setShowConfirmation(true)}
              className="cyber-btn w-full bg-red-900/20 border-red-500 hover:bg-red-900/40 text-red-400 flex items-center justify-center gap-2"
            >
              <Trash2 size={20} />
              Delete My Account
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-['Rajdhani'] text-sm text-red-400">
                  Type <span className="font-bold">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE here"
                  disabled={isDeleting}
                  className="w-full p-3 rounded border bg-transparent"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || confirmText !== 'DELETE'}
                  className="cyber-btn flex-1 bg-red-900/20 border-red-500 hover:bg-red-900/40 text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'DELETING...' : 'CONFIRM DELETE'}
                </button>
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setConfirmText('');
                  }}
                  disabled={isDeleting}
                  className="cyber-btn secondary flex-1"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
