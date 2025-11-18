'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useUserData } from '@/lib/hooks/useUserData';
import { LogOut, User } from 'lucide-react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { data: userData } = useUserData();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-20 z-1000 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-[rgba(10,10,10,0.98)] shadow-[0_2px_20px_rgba(0,255,255,0.1)]'
          : 'bg-[rgba(10,10,10,0.95)]'
      }`}
      style={{
        backdropFilter: 'blur(10px)',
        borderBottomColor: 'var(--color-border)'
      }}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-full flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3 relative no-underline group"
          onClick={closeMenu}>
          <div className="relative w-10 h-10 md:w-12 md:h-12 transition-all duration-300 group-hover:scale-110">
            <Image
              src="/images/logo.png"
              alt="SYS-REDUX Logo"
              fill
              className="object-contain"
              priority
              style={{
                filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.5))'
              }}
            />
          </div>
          <span
            className="font-['Orbitron'] text-[1rem] md:text-[1.5rem] font-black tracking-[1px] md:tracking-[2px] leading-none inline-block transition-all duration-300 group-hover:scale-105"
            style={{
              color: 'var(--color-primary-cyan)',
              textShadow: '0 0 10px var(--color-primary-cyan)'
            }}>
            SYS-REDUX
          </span>
        </Link>

        {/* Hamburger Menu (Always) */}
        <div
          className={`
            fixed top-20 left-0 w-full md:w-1/3 h-[calc(100vh-5rem)]
            flex flex-col justify-start items-center pt-8
            transition-transform duration-300 border-t border-r
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          style={{
            backgroundColor: 'rgba(10, 10, 10, 0.98)',
            backdropFilter: 'blur(10px)',
            borderTopColor: 'var(--color-border)',
            borderRightColor: 'var(--color-border)'
          }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative font-['Rajdhani'] text-[1.2rem] font-medium
                  uppercase tracking-[1px] my-4 px-8 py-4 w-4/5
                  text-center border rounded-md transition-all duration-300
                  overflow-hidden no-underline
                  ${isActive ? 'border-primary-cyan' : 'border-transparent'}
                `}
                style={{
                  color: isActive
                    ? 'var(--color-primary-cyan)'
                    : 'var(--color-text-secondary)',
                  textShadow: isActive
                    ? '0 0 5px var(--color-primary-cyan)'
                    : undefined,
                  borderColor: isActive ? 'var(--color-primary-cyan)' : 'var(--color-border)'
                }}
                onClick={closeMenu}>
                <span className="relative z-2 transition-all duration-300 hover:text-(--color-primary-cyan) hover:shadow-[0_0_10px_var(--color-primary-cyan)]">
                  {link.label}
                </span>
                <span
                  className="absolute top-0 left-0 w-full h-full opacity-0 -translate-x-full transition-all duration-300 z-1 hover:opacity-10 hover:translate-x-0"
                  style={{
                    background: 'linear-gradient(45deg, var(--color-primary-cyan), var(--color-primary-pink))'
                  }}
                />
              </Link>
            );
          })}

          {/* Auth Section */}
          {user ? (
            <>
              {/* Only show Admin button if user is admin */}
              {userData?.isAdmin && (
                <Link
                  href="/adminPanel"
                  className="flex items-center justify-center gap-2 my-4 px-8 py-4 w-4/5 border rounded-md font-['Rajdhani'] text-[1.2rem] font-medium uppercase tracking-[1px] transition-all duration-300 no-underline text-center"
                  style={{
                    color: 'var(--color-primary-green)',
                    borderColor: 'var(--color-border)'
                  }}
                  onClick={closeMenu}
                >
                  <User size={18} />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                href="/settings"
                className="flex items-center justify-center gap-2 my-4 px-8 py-4 w-4/5 border rounded-md font-['Rajdhani'] text-[1.2rem] font-medium uppercase tracking-[1px] transition-all duration-300 no-underline text-center"
                style={{
                  color: 'var(--color-text-secondary)',
                  borderColor: 'var(--color-border)'
                }}
                onClick={closeMenu}
              >
                <User size={18} />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 my-4 px-8 py-4 w-4/5 border rounded-md font-['Rajdhani'] text-[1.2rem] font-medium uppercase tracking-[1px] transition-all duration-300 bg-transparent cursor-pointer text-center"
                style={{
                  color: 'var(--color-primary-pink)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="cyber-btn text-sm w-4/5 text-center my-4"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}
        </div>

        {/* Hamburger Menu Toggle (Always Visible) */}
        <div
          className={`flex flex-col cursor-pointer p-2 ${isOpen ? 'active' : ''}`}
          onClick={toggleMenu}>
          <span
            className={`w-[25px] h-[3px] my-[3px] rounded-sm transition-all duration-300 ${
              isOpen ? '-rotate-45 translate-y-[9px]' : ''
            }`}
            style={{
              background: 'var(--color-primary-cyan)',
              boxShadow: '0 0 5px var(--color-primary-cyan)'
            }}
          />
          <span
            className={`w-[25px] h-[3px] my-[3px] rounded-sm transition-all duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}
            style={{
              background: 'var(--color-primary-cyan)',
              boxShadow: '0 0 5px var(--color-primary-cyan)'
            }}
          />
          <span
            className={`w-[25px] h-[3px] my-[3px] rounded-sm transition-all duration-300 ${
              isOpen ? 'rotate-45 -translate-y-[9px]' : ''
            }`}
            style={{
              background: 'var(--color-primary-cyan)',
              boxShadow: '0 0 5px var(--color-primary-cyan)'
            }}
          />
        </div>
      </div>
    </nav>
  );
}