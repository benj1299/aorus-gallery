'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
// DropdownMenu removed — using direct icon buttons instead
import { AdminSearchInput } from './admin-search';
import { AdminBreadcrumb } from './admin-breadcrumb';
import { DeleteButton } from './delete-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Pencil, Trash2, ArrowUpDown, Eye, EyeOff } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render: (item: T) => React.ReactNode;
  getValue?: (item: T) => string | number;
}

interface AdminTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  searchKeys: string[];
  searchPlaceholder?: string;
  newHref?: string;
  newLabel?: string;
  editHref: (item: T) => string;
  deleteAction?: (id: string) => Promise<void>;
  getId: (item: T) => string;
  itemsPerPage?: number;
}

type SortDir = 'asc' | 'desc';

export function AdminTable<T extends Record<string, unknown>>({
  title,
  data,
  columns,
  searchKeys,
  searchPlaceholder = 'Rechercher...',
  newHref,
  newLabel = 'Nouveau',
  editHref,
  deleteAction,
  getId,
  itemsPerPage = 10,
}: AdminTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const lower = query.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((key) => {
        const val = item[key];
        if (typeof val === 'string') return val.toLowerCase().includes(lower);
        if (val && typeof val === 'object' && 'en' in (val as Record<string, unknown>)) {
          const t = val as Record<string, string>;
          return Object.values(t).some((v) => v?.toLowerCase().includes(lower));
        }
        if (val && typeof val === 'object' && 'name' in (val as Record<string, unknown>)) {
          const name = (val as Record<string, string>).name;
          return name?.toLowerCase().includes(lower);
        }
        return false;
      })
    );
  }, [data, searchKeys, query]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.getValue) return filtered;
    const getValue = col.getValue;
    return [...filtered].sort((a, b) => {
      const aVal = getValue(a);
      const bVal = getValue(b);
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const paginated = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const totalColumns = columns.length + 1;

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: title }]} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {newHref && (
          <Button asChild>
            <Link href={newHref}>
              <Plus className="w-4 h-4 mr-1" />
              {newLabel}
            </Link>
          </Button>
        )}
      </div>

      <AdminSearchInput value={query} onChange={setQuery} placeholder={searchPlaceholder} />

      <div className="rounded-lg border" style={{ background: '#fff' }}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>
                  {col.sortable ? (
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((item) => (
              <TableRow key={getId(item)}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.render(item)}</TableCell>
                ))}
                <TableCell className="text-right">
                  <TooltipProvider delayDuration={300}>
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={editHref(item)}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Modifier</TooltipContent>
                      </Tooltip>
                      {deleteAction && (
                        <DeleteButton
                          id={getId(item)}
                          action={deleteAction}
                        />
                      )}
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={totalColumns} className="h-24 text-center text-muted-foreground">
                  Aucun élément pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sorted.length} résultat{sorted.length !== 1 ? 's' : ''}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Précédent
            </Button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
