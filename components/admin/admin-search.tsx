'use client';

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
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 bg-white text-gray-900 border-gray-300"
        data-testid="table-search"
      />
    </div>
  );
}
