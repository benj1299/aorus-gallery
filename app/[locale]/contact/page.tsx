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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

const contactSchema = z.object({
  status: z.enum(['collector', 'press', 'institution', 'corporate', 'artist', 'other']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  interestedIn: z.string().optional(),
  preferredLanguage: z.string().optional(),
  rgpd: z.literal(true, { message: 'You must accept the privacy policy' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const t = useTranslations('contact');
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      status: undefined,
      interestedIn: '',
      preferredLanguage: '',
    },
  });

  const selectedStatus = watch('status');

  const onSubmit = async (data: ContactFormData) => {
    setFormStatus('sending');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Form data:', data);
    setFormStatus('success');
  };

  const statusOptions = [
    { value: 'collector', label: t('form.statusOptions.collector') },
    { value: 'press', label: t('form.statusOptions.press') },
    { value: 'institution', label: t('form.statusOptions.institution') },
    { value: 'corporate', label: t('form.statusOptions.corporate') },
    { value: 'artist', label: t('form.statusOptions.artist') },
    { value: 'other', label: t('form.statusOptions.other') },
  ] as const;

  const interestedInOptions = [
    { value: '', label: t('form.selectOption') },
    { value: 'artist', label: t('form.interestedInOptions.artist') },
    { value: 'work', label: t('form.interestedInOptions.work') },
    { value: 'advisory', label: t('form.interestedInOptions.advisory') },
    { value: 'event', label: t('form.interestedInOptions.event') },
  ];

  const languageOptions = [
    { value: '', label: t('form.selectOption') },
    { value: 'en', label: t('form.languageOptions.en') },
    { value: 'fr', label: t('form.languageOptions.fr') },
    { value: 'zh', label: t('form.languageOptions.zh') },
  ];

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
              <div className="aspect-[4/3] relative overflow-hidden mb-10">
                <Image
                  src="https://images.unsplash.com/photo-1577720643272-265f09367456?w=800&q=80"
                  alt="Gallery interior"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/30 to-transparent" />
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-or text-xs tracking-[0.2em] uppercase font-medium mb-2">
                    {t('contactInfo.email')}
                  </p>
                  <a
                    href="mailto:info@orusgallery.com"
                    className="text-noir hover:text-or text-lg font-display transition-colors duration-300"
                  >
                    info@orusgallery.com
                  </a>
                  <p className="text-noir/50 text-sm mt-1">{t('contactInfo.general')}</p>
                  <a
                    href="mailto:press@orusgallery.com"
                    className="text-noir hover:text-or text-lg font-display transition-colors duration-300 block mt-2"
                  >
                    press@orusgallery.com
                  </a>
                  <p className="text-noir/50 text-sm mt-1">{t('contactInfo.press')}</p>
                </div>

                <div>
                  <p className="text-or text-xs tracking-[0.2em] uppercase font-medium mb-2">
                    {t('contactInfo.locations')}
                  </p>
                  <p className="text-noir/70 text-base">
                    {t('contactInfo.cities')}
                  </p>
                </div>

                <div>
                  <p className="text-or text-xs tracking-[0.2em] uppercase font-medium mb-2">
                    {t('contactInfo.hours')}
                  </p>
                  <p className="text-noir/70 text-base">
                    {t('contactInfo.byAppointment')}
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
              {formStatus === 'success' ? (
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
                  <p className="text-noir/60 text-sm mb-6">{t('form.successSubtext')}</p>
                  <Link href="/artists" className="btn-text">
                    {t('form.backToArtists')} →
                  </Link>
                </motion.div>
              ) : (
                <div className="bg-blanc-muted p-8 md:p-12">
                  <h2 className="font-display text-2xl text-noir mb-8">{t('form.title')}</h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Status (RadioGroup) */}
                    <div className="space-y-3">
                      <Label className="text-or text-xs tracking-[0.2em] uppercase font-medium">
                        {t('form.status')}
                      </Label>
                      <RadioGroup
                        value={selectedStatus}
                        onValueChange={(val) => setValue('status', val as ContactFormData['status'])}
                        className="grid grid-cols-2 gap-3"
                      >
                        {statusOptions.map((option) => (
                          <div key={option.value} className="flex items-center gap-2">
                            <RadioGroupItem
                              value={option.value}
                              id={`status-${option.value}`}
                              className="border-noir/30 text-[#C9A227] data-[state=checked]:border-[#C9A227]"
                            />
                            <Label
                              htmlFor={`status-${option.value}`}
                              className="text-noir text-sm cursor-pointer"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.status && (
                        <p className="text-red-600 text-xs">{errors.status.message}</p>
                      )}
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-or text-xs tracking-[0.2em] uppercase font-medium">
                        {t('form.name')} *
                      </Label>
                      <input
                        id="name"
                        type="text"
                        {...register('name')}
                        className="w-full h-14 px-4 bg-blanc border border-noir/15 text-noir placeholder:text-noir/40 focus:border-or focus:ring-1 focus:ring-or/20 focus:outline-none tracking-wide transition-colors"
                        placeholder={t('form.namePlaceholder')}
                        autoComplete="name"
                      />
                      {errors.name && (
                        <p className="text-red-600 text-xs">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-or text-xs tracking-[0.2em] uppercase font-medium">
                        {t('form.email')} *
                      </Label>
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="w-full h-14 px-4 bg-blanc border border-noir/15 text-noir placeholder:text-noir/40 focus:border-or focus:ring-1 focus:ring-or/20 focus:outline-none tracking-wide transition-colors"
                        placeholder="your@email.com"
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-xs">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-or text-xs tracking-[0.2em] uppercase font-medium">
                        {t('form.message')} *
                      </Label>
                      <Textarea
                        id="message"
                        {...register('message')}
                        rows={5}
                        className="bg-blanc border border-noir/15 text-noir placeholder:text-noir/40 focus:border-or focus:ring-1 focus:ring-or/20 resize-none tracking-wide px-4 py-4"
                        placeholder={t('form.messagePlaceholder')}
                      />
                      {errors.message && (
                        <p className="text-red-600 text-xs">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Interested In (optional select) */}
                    <div className="space-y-2">
                      <Label htmlFor="interestedIn" className="text-or text-xs tracking-[0.2em] uppercase font-medium">
                        {t('form.interestedIn')}
                      </Label>
                      <select
                        id="interestedIn"
                        {...register('interestedIn')}
                        className="w-full h-14 px-4 bg-blanc border border-noir/15 text-noir focus:border-or focus:ring-1 focus:ring-or/20 focus:outline-none tracking-wide transition-colors appearance-none"
                      >
                        {interestedInOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred Language (optional select) */}
                    <div className="space-y-2">
                      <Label htmlFor="preferredLanguage" className="text-or text-xs tracking-[0.2em] uppercase font-medium">
                        {t('form.preferredLanguage')}
                      </Label>
                      <select
                        id="preferredLanguage"
                        {...register('preferredLanguage')}
                        className="w-full h-14 px-4 bg-blanc border border-noir/15 text-noir focus:border-or focus:ring-1 focus:ring-or/20 focus:outline-none tracking-wide transition-colors appearance-none"
                      >
                        {languageOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* RGPD Checkbox */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="rgpd"
                          {...register('rgpd')}
                          className="mt-1 h-4 w-4 accent-[#C9A227] border-noir/15"
                        />
                        <Label htmlFor="rgpd" className="text-noir/70 text-sm leading-relaxed cursor-pointer">
                          {t('form.rgpdText')}
                        </Label>
                      </div>
                      {errors.rgpd && (
                        <p className="text-red-600 text-xs">{errors.rgpd.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="w-full h-14 btn-primary mt-4"
                    >
                      {formStatus === 'sending' ? t('form.sending') : t('form.submit')}
                    </Button>

                    {formStatus === 'error' && (
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
