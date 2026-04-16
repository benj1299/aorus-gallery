'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AdminSearchInput({ value, onChange, placeholder }: AdminSearchProps) {
  const t = useTranslations('admin.table');
  const resolvedPlaceholder = placeholder ?? t('search');
  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={resolvedPlaceholder}
        className="pl-9 bg-white text-gray-900 border-gray-300"
        data-testid="table-search"
      />
    </div>
  );
}
