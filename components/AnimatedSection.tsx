'use client';

import { motion, type TargetAndTransition, type Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  bg?: 'blanc' | 'blanc-muted';
  padding?: 'default' | 'lg';
  container?: 'narrow' | 'wide' | false;
  className?: string;
  containerClassName?: string;
  initial?: TargetAndTransition;
  transition?: Transition;
  viewportMargin?: string;
  animateOnMount?: boolean;
}

export function AnimatedSection({
  children,
  bg = 'blanc',
  padding = 'default',
  container = 'wide',
  className,
  containerClassName,
  initial,
  transition,
  viewportMargin,
  animateOnMount = false,
}: AnimatedSectionProps) {
  const motionProps = animateOnMount
    ? { animate: { opacity: 1, y: 0, x: 0 } }
    : {
        whileInView: { opacity: 1, y: 0, x: 0 },
        viewport: { once: true, ...(viewportMargin ? { margin: viewportMargin } : {}) },
      };

  return (
    <section
      className={cn(
        bg === 'blanc-muted' ? 'bg-blanc-muted' : 'bg-blanc',
        padding === 'lg' ? 'section-padding-lg' : 'section-padding',
        className
      )}
    >
      <motion.div
        initial={initial ?? { opacity: 0, y: 30 }}
        transition={transition ?? { duration: 0.8 }}
        className={cn(container !== false && `container-${container}`, containerClassName)}
        {...motionProps}
      >
        {children}
      </motion.div>
    </section>
  );
}
