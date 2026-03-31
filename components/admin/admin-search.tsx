'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AdminSearchProps<T> {
  items: T[];
  searchKeys: (keyof T)[];
  children: (filteredItems: T[]) => ReactNode;
  placeholder?: string;
}

export function AdminSearch<T extends Record<string, unknown>>({
  items,
  searchKeys,
  children,
  placeholder = 'Rechercher...',
}: AdminSearchProps<T>) {
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

  return (
    <>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      {children(filtered)}
    </>
  );
}
