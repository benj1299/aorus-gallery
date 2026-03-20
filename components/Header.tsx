'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/artists', label: t('artists') },
    { href: '/press', label: t('press') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#FAFAFA]/95 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.06)]'
            : 'bg-transparent'
        }`}
        style={{ height: isScrolled ? undefined : undefined }}
      >
        <nav
          className={`relative container-wide px-edge flex items-center justify-between ${
            isScrolled
              ? 'h-[72px] md:h-[72px]'
              : 'h-[60px] md:h-[72px]'
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col items-start hover:opacity-80 transition-opacity duration-300"
          >
            <span
              className="font-display text-2xl md:text-3xl lg:text-4xl tracking-[0.15em] uppercase leading-none"
              style={{ color: '#0B0B0B' }}
            >
              ORUS
            </span>
            <span
              className="text-xs md:text-sm tracking-[0.25em] uppercase"
              style={{ color: '#0B0B0B', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontWeight: 400, opacity: 0.5 }}
            >
              GALLERY
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive(item.href) ? 'nav-link-active' : ''}`}
              >
                {item.label}
              </Link>
            ))}

            {/* Separator */}
            <div className="w-px h-4 bg-noir/15" />

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="relative w-6 h-4">
              <motion.span
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 6 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute top-0 left-0 w-full h-px bg-noir"
              />
              <motion.span
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                  x: isMobileMenuOpen ? 10 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="absolute top-1/2 left-0 w-full h-px bg-noir"
              />
              <motion.span
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -6 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute bottom-0 left-0 w-full h-px bg-noir"
              />
            </div>
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 backdrop-blur-md"
              style={{ backgroundColor: 'rgba(250, 250, 250, 0.95)' }}
              onClick={closeMobileMenu}
            />

            {/* Menu Content */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative flex flex-col items-center justify-center min-h-screen px-edge py-24"
            >
              {/* Navigation Links */}
              <div className="flex flex-col items-center gap-8">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="font-display tracking-[0.15em] uppercase transition-colors duration-300 relative inline-block"
                      style={{
                        fontSize: '28px',
                        color: '#0B0B0B',
                      }}
                    >
                      {item.label}
                      {isActive(item.href) && (
                        <span
                          className="absolute left-0 right-0 -bottom-1 h-px"
                          style={{ backgroundColor: '#4BAF91' }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="h-px my-10"
                style={{ backgroundColor: 'rgba(75, 175, 145, 0.4)', width: '64px' }}
              />

              {/* Language Switcher */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <LanguageSwitcher />
              </motion.div>

              {/* Location Tag */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="text-sm tracking-[0.2em] uppercase mt-10"
                style={{ color: 'rgba(11, 11, 11, 0.4)' }}
              >
                Taiwan — Paris
              </motion.p>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
