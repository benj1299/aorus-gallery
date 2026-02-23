'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  zh: '中文',
  fr: 'FR',
};

export function Header() {
  const t = useTranslations('nav');
  const tHeader = useTranslations('header');
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: tHeader('home') },
    { href: '/artists', label: t('artists') },
    { href: '/press', label: t('press') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  // Sticky after 16px scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
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

  return (
    <>
      {/* Desktop/Mobile Header Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-hairline transition-all duration-300 ${
          isScrolled
            ? 'bg-paper/95 backdrop-blur-sm'
            : 'bg-paper'
        }`}
        style={{ height: 'var(--header-height, 60px)' }}
      >
        <style>{`
          :root { --header-height: 60px; }
          @media (min-width: 768px) { :root { --header-height: 72px; } }
        `}</style>
        <div className="container-wide px-edge h-full flex items-center justify-between">
          {/* Logo: ORUS serif + Gallery sans */}
          <Link
            href="/"
            className="flex items-baseline gap-2 hover:opacity-70 transition-opacity duration-200"
            aria-label="ORUS Gallery — Home"
          >
            <span className="font-display text-2xl tracking-[0.08em] text-ink leading-none">
              ORUS
            </span>
            <span className="font-sans text-xs tracking-[0.18em] uppercase text-stone leading-none">
              Gallery
            </span>
          </Link>

          {/* Desktop Navigation — centered */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm tracking-[0.12em] uppercase transition-colors duration-200 pb-0.5 ${
                    isActive
                      ? 'text-ink'
                      : 'text-stone hover:text-ink'
                  }`}
                >
                  {item.label}
                  {/* Jade underline for active state */}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-px bg-jade"
                      style={{ height: '1px' }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side: CTA + Lang switcher */}
          <div className="hidden md:flex items-center gap-6">
            {/* CTA */}
            <Link
              href="/contact"
              className="text-sm tracking-[0.12em] uppercase text-ink border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-all duration-200"
            >
              {tHeader('cta')}
            </Link>

            {/* Lang switcher */}
            <div className="flex items-center gap-2">
              {routing.locales.map((loc, index) => (
                <span key={loc} className="flex items-center gap-2">
                  <button
                    onClick={() => handleLocaleChange(loc)}
                    className={`text-[12px] tracking-[0.12em] uppercase transition-colors duration-200 ${
                      locale === loc
                        ? 'text-ink'
                        : 'text-stone hover:text-ink'
                    }`}
                  >
                    {localeLabels[loc]}
                  </button>
                  {index < routing.locales.length - 1 && (
                    <span className="text-hairline text-[10px]">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Mobile: Burger button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="relative w-5 h-3.5">
              <motion.span
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 7 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute top-0 left-0 w-full h-px bg-ink"
              />
              <motion.span
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                  x: isMobileMenuOpen ? 8 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="absolute top-1/2 left-0 w-full h-px bg-ink"
              />
              <motion.span
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -7 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute bottom-0 left-0 w-full h-px bg-ink"
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay — full-screen, paper background */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-0 z-40 md:hidden bg-paper"
          >
            <motion.nav
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex flex-col items-center justify-center min-h-screen px-edge gap-8"
            >
              {navItems.map((item, index) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`relative font-display text-[28px] tracking-[0.08em] text-ink transition-opacity duration-200 hover:opacity-60 pb-1 ${
                        isActive ? 'text-ink' : 'text-ink'
                      }`}
                    >
                      {item.label}
                      {/* Active micro-trait jade underline */}
                      {isActive && (
                        <span
                          className="absolute bottom-0 left-0 right-0 bg-jade"
                          style={{ height: '1px' }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                className="w-12 h-px bg-hairline"
              />

              {/* Language switcher */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex items-center gap-3"
              >
                {routing.locales.map((loc, index) => (
                  <span key={loc} className="flex items-center gap-3">
                    <button
                      onClick={() => { handleLocaleChange(loc); closeMobileMenu(); }}
                      className={`text-[12px] tracking-[0.12em] uppercase transition-colors duration-200 ${
                        locale === loc
                          ? 'text-ink'
                          : 'text-stone hover:text-ink'
                      }`}
                    >
                      {localeLabels[loc]}
                    </button>
                    {index < routing.locales.length - 1 && (
                      <span className="text-hairline text-[10px]">|</span>
                    )}
                  </span>
                ))}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
