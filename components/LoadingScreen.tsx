'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LoadingScreenProps {
  logoSrc?: string;
}

export function LoadingScreen({ logoSrc }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-blanc flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex flex-col items-center gap-6"
      >
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt="ORUS Gallery"
            width={120}
            height={120}
            priority
            className="opacity-90"
          />
        ) : (
          <div className="text-or font-display text-4xl md:text-5xl tracking-[0.3em] uppercase">
            ORUS
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-noir/40 text-sm tracking-[0.2em] uppercase"
        >
          Gallery
        </motion.div>

        {/* Subtle loading indicator */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          transition={{
            delay: 0.8,
            duration: 1.5,
            ease: 'easeInOut',
          }}
          className="h-px bg-gradient-to-r from-transparent via-or/50 to-transparent"
        />
      </motion.div>
    </div>
  );
}
