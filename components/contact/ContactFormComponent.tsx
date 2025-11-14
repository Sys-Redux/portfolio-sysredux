'use client';

import { useState } from 'react';
import { submitContactForm } from '@/lib/services/contactService';

export default function ContactFormComponent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await submitContactForm(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cyber-card space-y-6">
      <h2 className="font-['Orbitron'] text-2xl font-bold text-center text-primary-cyan">
        SEND MESSAGE
      </h2>

      {success && (
        <div className="p-4 rounded border border-green-500 bg-green-900/20 text-green-400">
          Message sent successfully! I&apos;ll get back to you soon.
        </div>
      )}

      {error && (
        <div className="p-4 rounded border border-red-500 bg-red-900/20 text-red-400">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block mb-2 font-['Rajdhani'] text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={loading}
          className="w-full p-3 rounded border bg-transparent focus:outline-none focus:border-(--color-primary-cyan)"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        />
      </div>

      <div>
        <label htmlFor="email" className="block mb-2 font-['Rajdhani'] text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={loading}
          className="w-full p-3 rounded border bg-transparent focus:outline-none focus:border-(--color-primary-cyan)"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        />
      </div>

      <div>
        <label htmlFor="message" className="block mb-2 font-['Rajdhani'] text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Message
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          disabled={loading}
          rows={6}
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
        {loading ? 'SENDING...' : 'SEND MESSAGE'}
      </button>
    </form>
  );
}