'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Props {
  items: { label: string; href?: string }[];
}

export function AdminBreadcrumb({ items }: Props) {
  const t = useTranslations('admin.breadcrumb');

  return (
    <nav className="text-sm text-gray-500">
      <ol className="flex items-center">
        <li>
          <Link href="/admin" className="text-gray-500 hover:text-gray-900 transition-colors">
            {t('administration')}
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            <span className="text-gray-300 mx-2">/</span>
            {item.href ? (
              <Link href={item.href} className="text-gray-500 hover:text-gray-900 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
