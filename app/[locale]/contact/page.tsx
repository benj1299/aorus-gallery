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
import { PageHero } from '@/components/PageHero';
import { FormField } from '@/components/FormField';
import { submitContactForm } from '@/lib/actions/contact';
import { toast } from 'sonner';

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

const inputClassName = 'w-full h-14 px-4 bg-blanc border border-noir/15 text-noir placeholder:text-noir/40 focus:border-noir focus:ring-1 focus:ring-noir/20 focus:outline-none tracking-wide transition-colors';
const selectClassName = `${inputClassName} appearance-none`;

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
    try {
      const result = await submitContactForm({
        status: data.status,
        name: data.name,
        email: data.email,
        message: data.message,
        interestedIn: data.interestedIn || undefined,
        preferredLanguage: data.preferredLanguage || undefined,
      });
      if ('error' in result) {
        setFormStatus('error');
        toast.error(result.error);
        return;
      }
      setFormStatus('success');
    } catch {
      setFormStatus('error');
      toast.error(t('form.error'));
    }
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
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        subtitleClassName="text-noir/60 text-lg leading-relaxed max-w-2xl mx-auto"
        dividerClassName="mt-10"
      />

      <section className="bg-blanc-muted section-padding">
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
                  src="/images/gallery/image-contact.png"
                  alt="ORUS Gallery"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-8">
                <div>
                  <p className="text-or text-xs tracking-[0.2em] uppercase font-medium mb-2">
                    {t('contactInfo.email')}
                  </p>
                  <a
                    href="mailto:contact@orusgallery.com"
                    className="text-noir hover:text-noir text-lg font-display transition-colors duration-300"
                  >
                    contact@orusgallery.com
                  </a>
                  <p className="text-noir/60 text-sm mt-1">{t('contactInfo.general')}</p>
                </div>
                <div>
                  <p className="text-or text-xs tracking-[0.2em] uppercase font-medium mb-2">
                    {t('contactInfo.locations')}
                  </p>
                  <p className="text-noir/60 text-base">{t('contactInfo.cities')}</p>
                </div>
                <div>
                  <p className="text-or text-xs tracking-[0.2em] uppercase font-medium mb-2">
                    {t('contactInfo.hours')}
                  </p>
                  <p className="text-noir/60 text-base">{t('contactInfo.byAppointment')}</p>
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
                  <div className="w-20 h-20 mx-auto mb-8 border-2 border-noir flex items-center justify-center">
                    <svg className="w-8 h-8 text-or" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-noir text-xl font-display mb-2">{t('form.success')}</p>
                  <p className="text-noir/50 text-sm mb-6">{t('form.successSubtext')}</p>
                  <Link href="/artists" className="btn-text">
                    {t('form.backToArtists')} →
                  </Link>
                </motion.div>
              ) : (
                <div className="bg-blanc p-8 md:p-12 border border-noir/10">
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
                              className="border-noir/30 text-[#0A0A0A] data-[state=checked]:border-[#0A0A0A]"
                            />
                            <Label htmlFor={`status-${option.value}`} className="text-noir text-sm cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.status && <p className="text-red-600 text-xs">{errors.status.message}</p>}
                    </div>

                    <FormField label={t('form.name')} id="name" required error={errors.name?.message}>
                      <input
                        id="name"
                        type="text"
                        {...register('name')}
                        className={inputClassName}
                        placeholder={t('form.namePlaceholder')}
                        autoComplete="name"
                      />
                    </FormField>

                    <FormField label={t('form.email')} id="email" required error={errors.email?.message}>
                      <input
                        id="email"
                        type="text"
                        inputMode="email"
                        {...register('email')}
                        className={inputClassName}
                        placeholder="your@email.com"
                        autoComplete="email"
                      />
                    </FormField>

                    <FormField label={t('form.message')} id="message" required error={errors.message?.message}>
                      <Textarea
                        id="message"
                        {...register('message')}
                        rows={5}
                        className="bg-blanc border border-noir/15 text-noir placeholder:text-noir/40 focus:border-noir focus:ring-1 focus:ring-noir/20 resize-none tracking-wide px-4 py-4"
                        placeholder={t('form.messagePlaceholder')}
                      />
                    </FormField>

                    <FormField label={t('form.interestedIn')} id="interestedIn">
                      <select id="interestedIn" {...register('interestedIn')} className={selectClassName}>
                        {interestedInOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label={t('form.preferredLanguage')} id="preferredLanguage">
                      <select id="preferredLanguage" {...register('preferredLanguage')} className={selectClassName}>
                        {languageOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </FormField>

                    {/* RGPD Checkbox */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="rgpd"
                          {...register('rgpd')}
                          className="mt-1 h-4 w-4 accent-[#0A0A0A] border-noir/15"
                        />
                        <Label htmlFor="rgpd" className="text-noir/60 text-sm leading-relaxed cursor-pointer">
                          {t('form.rgpdText')}
                        </Label>
                      </div>
                      {errors.rgpd && <p className="text-red-600 text-xs">{errors.rgpd.message}</p>}
                    </div>

                    <Button type="submit" disabled={formStatus === 'sending'} className="w-full h-14 btn-primary mt-4">
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
    </div>
  );
}
