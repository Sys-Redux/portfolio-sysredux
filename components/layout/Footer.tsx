'use client';

import Link from 'next/link';
import { GitPullRequestDraft, Link as LinkIcon, X, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden border-t-2"
      style={{
        background: 'linear-gradient(135deg, var(--color-darker-bg) 0%, var(--color-dark-bg) 100%)',
        borderTopColor: 'var(--color-border)',
        color: 'var(--color-text-primary)'
      }}>
      {/* Animated top border glow */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 animate-[footerGlow_3s_linear_infinite]"
        style={{
          background: 'linear-gradient(90deg, var(--color-primary-cyan), var(--color-primary-pink), var(--color-primary-green), var(--color-primary-purple))'
        }}
      />

      <div className="max-w-[1200px] mx-auto px-8 pt-12 pb-4">
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 mb-8 max-md:text-center">
          {/* Brand Section */}
          <div className="flex flex-col">
            <h3
              className="font-['Orbitron'] text-[2rem] font-black mb-4 tracking-[2px]"
              style={{
                color: 'var(--color-primary-cyan)',
                textShadow: '0 0 10px var(--color-primary-cyan)'
              }}>
              SYS-REDUX
            </h3>
            <p
              className="font-['Rajdhani'] text-[1.1rem] leading-[1.6]"
              style={{ color: 'var(--color-text-secondary)' }}>
              Systems Developer • Digital Architect • Code Warrior
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col max-md:items-center">
            <h4
              className="font-['Orbitron'] text-[1.2rem] font-bold mb-4 uppercase tracking-[1px]"
              style={{ color: 'var(--color-text-primary)' }}>
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/projects', label: 'Projects' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative font-['Rajdhani'] text-base py-2 transition-all duration-300 hover:translate-x-2.5 no-underline"
                  style={{ color: 'var(--color-text-secondary)' }}>
                  <span
                    className="opacity-0 group-hover:opacity-100 mr-2 transition-all duration-300 -translate-x-2.5 group-hover:translate-x-0"
                    style={{ color: 'var(--color-primary-cyan)' }}>
                    &gt;
                  </span>
                  <span className="transition-all duration-300 group-hover:text-(--color-primary-cyan) group-hover:shadow-[0_0_5px_var(--color-primary-cyan)]">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Social Links Section */}
          <div className="flex flex-col max-md:items-center">
            <h4
              className="font-['Orbitron'] text-[1.2rem] font-bold mb-4 uppercase tracking-[1px]"
              style={{ color: 'var(--color-text-primary)' }}>
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { href: 'https://github.com/Sys-Redux', Icon: GitPullRequestDraft, label: 'GitHub' },
                { href: 'https://www.linkedin.com/in/t-edge/', Icon: LinkIcon, label: 'LinkedIn' },
                { href: 'https://x.com/sys_redux', Icon: X, label: 'X' },
                { href: 'mailto:edge.t.xyz@gmail.com', Icon: Mail, label: 'Email' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group flex items-center font-['Rajdhani'] text-base py-2 px-2 rounded-md border border-transparent transition-all duration-300 hover:translate-x-1.5 no-underline"
                  style={{ color: 'var(--color-text-secondary)' }}>
                  <social.Icon
                    className="mr-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                    size={20}
                    style={{
                      color: 'var(--color-primary-cyan)',
                      filter: 'drop-shadow(0 0 4px var(--color-primary-cyan))'
                    }}
                  />
                  <span className="transition-all duration-300 group-hover:text-(--color-primary-cyan)">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center">
          {/* Divider */}
          <div
            className="w-full h-px my-8"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--color-border), transparent)'
            }}
          />

          {/* Bottom Content */}
          <div className="flex justify-between items-center flex-wrap gap-4 max-md:flex-col max-md:text-center">
            <p
              className="font-['Rajdhani'] text-[0.9rem]"
              style={{ color: 'var(--color-text-secondary)' }}>
              © {currentYear} SYS-REDUX. All rights reserved.
            </p>
            <p className="font-['Orbitron'] font-bold text-[0.9rem] tracking-[2px]">
              <span className="neon-text">HACK THE PLANET</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes footerGlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </footer>
  );
}
