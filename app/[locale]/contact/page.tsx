'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

// Simplified schema - only email and message
const contactSchema = z.object({
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('sending');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, you'd send this to your email service
    console.log('Form data:', data);

    setStatus('success');
  };

  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="section-noir hero-offset">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="container-narrow text-center"
        >
          {/* 24h Response Promise */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-8 py-4 border border-or mb-10"
          >
            <svg className="w-5 h-5 text-or" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-or text-sm md:text-base tracking-[0.12em] uppercase font-medium">
              {t('response')}
            </span>
          </motion.div>

          <h1 className="title-section text-blanc mb-6">{t('title')}</h1>
          <p className="text-blanc/60 text-lg tracking-wide">{t('subtitle')}</p>
          <div className="divider-gold mx-auto mt-10" />
        </motion.div>
      </section>

      {/* Main Content Section */}
      <section className="section-blanc section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left Column - Image & Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Gallery Image */}
              <div className="aspect-[4/3] relative overflow-hidden mb-10">
                <Image
                  src="https://images.unsplash.com/photo-1577720643272-265f09367456?w=800&q=80"
                  alt="Gallery interior"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/30 to-transparent" />
              </div>

              {/* Contact Details */}
              <div className="space-y-8">
                <div>
                  <p className="text-or text-xs tracking-[0.2em] uppercase font-medium mb-2">
                    Email
                  </p>
                  <a
                    href="mailto:info@orusgallery.com"
                    className="text-noir hover:text-or text-lg font-display transition-colors duration-300"
                  >
                    info@orusgallery.com
                  </a>
                </div>

                <div>
                  <p className="text-or text-xs tracking-[0.2em] uppercase font-medium mb-2">
                    Locations
                  </p>
                  <p className="text-noir/70 text-base">
                    Taipei, Taiwan<br />
                    Paris, France
                  </p>
                </div>

                <div>
                  <p className="text-or text-xs tracking-[0.2em] uppercase font-medium mb-2">
                    Hours
                  </p>
                  <p className="text-noir/70 text-base">
                    By appointment only
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-blanc border border-noir/10 p-16 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-8 border-2 border-or flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-or"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-noir text-xl font-display mb-2">{t('form.success')}</p>
                  <p className="text-noir/60 text-sm">{t('response')}</p>
                </motion.div>
              ) : (
                <div className="bg-blanc-muted p-8 md:p-12">
                  <h2 className="font-display text-2xl text-noir mb-8">Send a Message</h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-noir text-sm tracking-[0.1em] uppercase">
                        {t('form.email')}
                      </Label>
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="w-full h-14 px-4 bg-blanc border border-noir/15 text-noir placeholder:text-noir/40 focus:border-or focus:outline-none tracking-wide transition-colors"
                        placeholder="your@email.com"
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-noir text-sm tracking-[0.1em] uppercase">
                        {t('form.message')}
                      </Label>
                      <Textarea
                        id="message"
                        {...register('message')}
                        rows={6}
                        className="bg-blanc border border-noir/15 text-noir placeholder:text-noir/40 focus:border-or resize-none tracking-wide px-4 py-4"
                        placeholder={t('form.messagePlaceholder')}
                      />
                      {errors.message && (
                        <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full h-14 btn-primary mt-4"
                    >
                      {status === 'sending' ? t('form.sending') : t('form.submit')}
                    </Button>

                    {status === 'error' && (
                      <p className="text-red-600 text-sm text-center mt-4">{t('form.error')}</p>
                    )}
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-blanc" />
      </div>
    </div>
  );
}
