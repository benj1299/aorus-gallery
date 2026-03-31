'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AdminSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AdminSearchInput({ value, onChange, placeholder = 'Rechercher...' }: AdminSearchProps) {
  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}

export function useSearch<T extends Record<string, unknown>>(items: T[], searchKeys: (keyof T)[]) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase();
    return items.filter((item) =>
      searchKeys.some((key) => {
        const val = item[key];
        if (typeof val === 'string') return val.toLowerCase().includes(lower);
        if (val && typeof val === 'object' && 'en' in (val as Record<string, unknown>)) {
          const t = val as Record<string, string>;
          return Object.values(t).some((v) => v?.toLowerCase().includes(lower));
        }
        return false;
      })
    );
  }, [items, searchKeys, query]);

  return { query, setQuery, filtered };
}
