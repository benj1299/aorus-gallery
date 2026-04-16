'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface TablePaginationBaseProps {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface ClientPaginationProps extends TablePaginationBaseProps {
  serverSide?: false;
  onPageChange: (page: number) => void;
  basePath?: never;
  searchParams?: never;
}

interface ServerPaginationProps extends TablePaginationBaseProps {
  serverSide: true;
  basePath: string;
  searchParams?: Record<string, string>;
  onPageChange?: never;
}

type TablePaginationProps = ClientPaginationProps | ServerPaginationProps;

function buildPageUrl(basePath: string, page: number, searchParams?: Record<string, string>) {
  const params = new URLSearchParams(searchParams);
  params.set('page', String(page));
  return `${basePath}?${params.toString()}`;
}

export function TablePagination(props: TablePaginationProps) {
  const { totalItems, totalPages, currentPage } = props;
  const t = useTranslations('admin.table');

  const buttonClass =
    'px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors';
  const disabledLinkClass =
    'px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-200 rounded-md opacity-50 pointer-events-none transition-colors';

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        {totalItems === 1 ? t('results_one', { count: totalItems }) : t('results_other', { count: totalItems })}
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          {props.serverSide ? (
            currentPage <= 1 ? (
              <span className={disabledLinkClass}>{t('previous')}</span>
            ) : (
              <Link
                href={buildPageUrl(props.basePath, currentPage - 1, props.searchParams)}
                className={buttonClass}
              >
                {t('previous')}
              </Link>
            )
          ) : (
            <button
              className={buttonClass}
              disabled={currentPage <= 1}
              onClick={() => props.onPageChange(currentPage - 1)}
            >
              {t('previous')}
            </button>
          )}
          <span className="text-sm text-gray-500">
            {currentPage} / {totalPages}
          </span>
          {props.serverSide ? (
            currentPage >= totalPages ? (
              <span className={disabledLinkClass}>{t('next')}</span>
            ) : (
              <Link
                href={buildPageUrl(props.basePath, currentPage + 1, props.searchParams)}
                className={buttonClass}
              >
                {t('next')}
              </Link>
            )
          ) : (
            <button
              className={buttonClass}
              disabled={currentPage >= totalPages}
              onClick={() => props.onPageChange(currentPage + 1)}
            >
              {t('next')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
