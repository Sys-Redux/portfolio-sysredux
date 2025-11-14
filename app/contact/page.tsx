import ContactFormComponent from '@/components/contact/ContactFormComponent';
import { Mail, GitPullRequestDraft, Link } from 'lucide-react';

export const metadata = {
  title: 'Contact | SYS-REDUX',
  description: 'Get in touch with Trevor Edge',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-24 px-8">
      <div className="max-w-[1000px] mx-auto">
        <h1
          className="font-['Orbitron'] text-5xl font-black text-center mb-4 glitch text-primary-cyan"
          data-text="CONTACT ME"
        >
          CONTACT ME
        </h1>

        <p className="text-center mb-12 text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Have a project in mind? Let&apos;s build something amazing together.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <ContactFormComponent />
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="cyber-card">
              <h3 className="font-['Orbitron'] text-xl font-bold mb-4" style={{ color: 'var(--color-primary-cyan)' }}>
                GET IN TOUCH
              </h3>
              <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                I&apos;m always interested in hearing about new projects and opportunities.
                Feel free to reach out through the form or connect with me on social media.
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:edge.t.xyz@gmail.com"
                  className="flex items-center gap-3 p-3 rounded border border-transparent hover:border-(--color-primary-cyan) transition-all"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <Mail size={20} style={{ color: 'var(--color-primary-cyan)' }} />
                  <span>edge.t.xyz@gmail.com</span>
                </a>

                <a
                  href="https://github.com/Sys-Redux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded border border-transparent hover:border-(--color-primary-cyan) transition-all"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <GitPullRequestDraft size={20} style={{ color: 'var(--color-primary-cyan)' }} />
                  <span>github.com/Sys-Redux</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/t-edge/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded border border-transparent hover:border-(--color-primary-cyan) transition-all"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <Link size={20} style={{ color: 'var(--color-primary-cyan)' }} />
                  <span>linkedin.com/in/t-edge</span>
                </a>
              </div>
            </div>

            <div className="cyber-card">
              <h3 className="font-['Orbitron'] text-xl font-bold mb-4" style={{ color: 'var(--color-primary-cyan)' }}>
                RESPONSE TIME
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                I typically respond within 24-48 hours. For urgent inquiries,
                please mention it in your message.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}