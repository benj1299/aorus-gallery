import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <div className="min-h-screen flex items-center justify-center bg-blanc px-6">
      <div className="text-center max-w-md">
        <p className="font-display text-6xl md:text-7xl text-or mb-6">404</p>
        <h1 className="font-display text-2xl md:text-3xl text-noir tracking-wide mb-4">
          {t('title')}
        </h1>
        <p className="text-noir/60 text-sm leading-relaxed mb-10">
          {t('description')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-noir/70 tracking-[0.1em] uppercase hover:text-noir transition-colors duration-300"
        >
          {t('backHome')}
        </Link>
      </div>
    </div>
  );
}
