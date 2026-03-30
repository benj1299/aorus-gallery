'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  subtitleClassName?: string;
  children?: React.ReactNode;
  className?: string;
  divider?: 'default' | 'wide' | false;
  dividerClassName?: string;
}

export function PageHero({
  title,
  subtitle,
  subtitleClassName,
  children,
  className,
  divider = 'default',
  dividerClassName,
}: PageHeroProps) {
  return (
    <section className={cn('bg-blanc hero-offset', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="container-narrow text-center"
      >
        <h1 className="title-section text-noir mb-6">{title}</h1>
        {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
        {divider !== false && (
          <div
            className={cn(
              divider === 'wide' ? 'divider-gold-wide' : 'divider-gold',
              'mx-auto',
              dividerClassName
            )}
          />
        )}
        {children}
      </motion.div>
    </section>
  );
}
