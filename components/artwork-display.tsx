'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AdaptiveImage } from '@/components/ui/adaptive-image';

/**
 * Multi-format artwork display primitives.
 *
 * Design decisions (data/development/briefs/orus-gallery/multi-format-strategy.md § 6):
 *
 * - `<ArtworkRail>` — horizontal rail, constant row height, width adapts to
 *   each image's native aspect ratio. Gagosian pattern. Extreme-ratio items
 *   are capped (panorama ≤ 1.5×row-height) or widened (tall ≥ 0.5×row-height).
 *   Items with ratio > 3:1 or < 1:3 are rendered as `<ArtworkHighlight>`
 *   outside the rail (responsibility of the caller).
 *
 * - `<ArtworkGrid>` — fixed-column grid, each cell uses its image's native
 *   aspect ratio via CSS aspect-ratio. Zwirner/Perrotin pattern. Ratios in
 *   the "stretched" zone span 2 columns; ratios in the "extreme" zone render
 *   as full-width rows (via `<ArtworkHighlight>` above the grid, not here).
 *
 * - `<ArtworkHero>` — artwork detail main image. Container matches the image's
 *   aspect ratio exactly. Max-height 90vh, max-width 1400px, centered, zero crop.
 *
 * When dimensions are unknown (legacy rows pre-backfill), the components fall
 * back to `aspect-[4/5]` + `object-cover` (per designer § 6.4 backfill strategy).
 */

// --- Shared types ---

export interface ArtworkMedia {
  id: string;
  title: string;
  imageUrl: string;
  imageWidth: number | null;
  imageHeight: number | null;
  /** Optional caption shown below the image (artist name, year, etc.). */
  caption?: string;
  /** Optional link — wraps the cell if provided. */
  href?: string;
}

/** Classify ratio for surface-specific handling. */
export type RatioZone = 'normal' | 'wide' | 'tall' | 'extreme-wide' | 'extreme-tall' | 'unknown';

export function classifyRatio(width: number | null, height: number | null): RatioZone {
  if (!width || !height) return 'unknown';
  const ratio = width / height;
  if (ratio > 3) return 'extreme-wide';
  if (ratio < 1 / 3) return 'extreme-tall';
  if (ratio > 2) return 'wide';
  if (ratio < 0.5) return 'tall';
  return 'normal';
}

// --- ArtworkRail ---

interface ArtworkRailProps {
  items: ArtworkMedia[];
  /** Constant row height via Tailwind class (e.g. "h-[420px] md:h-[420px]"). */
  rowHeightClass?: string;
  /** Priority flag passed to the first N images for LCP. */
  priorityCount?: number;
  sizes?: string;
  /** Custom link renderer (e.g. next-intl's Link). Defaults to `<a>`. */
  linkRenderer?: (href: string, children: ReactNode, className?: string) => ReactNode;
  emptyState?: ReactNode;
  /** Padding applied at rail container edges. */
  paddingClass?: string;
  dataTestId?: string;
}

export function ArtworkRail({
  items,
  rowHeightClass = 'h-[280px] md:h-[360px] lg:h-[420px]',
  priorityCount = 2,
  sizes = '(max-width: 768px) 85vw, (max-width: 1024px) 55vw, 40vw',
  linkRenderer,
  emptyState,
  paddingClass = 'px-6 md:px-12 lg:px-20',
  dataTestId = 'artwork-rail',
}: ArtworkRailProps) {
  if (items.length === 0) return <>{emptyState ?? null}</>;

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-blanc to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-blanc to-transparent z-10 pointer-events-none" />
      <div
        className={cn(
          'flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4 cursor-grab active:cursor-grabbing',
          paddingClass,
        )}
        data-testid={dataTestId}
      >
        {items.map((item, index) => {
          const content = (
            <ArtworkRailCell
              item={item}
              rowHeightClass={rowHeightClass}
              priority={index < priorityCount}
              sizes={sizes}
            />
          );
          if (item.href && linkRenderer) {
            return (
              <div key={item.id} className="snap-start shrink-0">
                {linkRenderer(item.href, content, 'block h-full')}
              </div>
            );
          }
          if (item.href) {
            return (
              <a key={item.id} href={item.href} className="snap-start shrink-0 block">
                {content}
              </a>
            );
          }
          return (
            <div key={item.id} className="snap-start shrink-0">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ArtworkRailCellProps {
  item: ArtworkMedia;
  rowHeightClass: string;
  priority: boolean;
  sizes: string;
}

function ArtworkRailCell({ item, rowHeightClass, priority, sizes }: ArtworkRailCellProps) {
  const zone = classifyRatio(item.imageWidth, item.imageHeight);
  const aspectRatio = item.imageWidth && item.imageHeight ? `${item.imageWidth} / ${item.imageHeight}` : '4 / 5';

  // Cap widths for stretched/extreme ratios (designer § 6.2)
  // Extreme ratios (>3:1 or <1:3) should be promoted to <ArtworkHighlight> by the caller.
  // Here in the rail we cap them conservatively so the rail doesn't break.
  const widthCapStyle = {
    aspectRatio,
    maxWidth:
      zone === 'extreme-wide'
        ? 'calc(var(--rail-h, 280px) * 3)'
        : zone === 'wide'
          ? 'calc(var(--rail-h, 280px) * 1.8)'
          : undefined,
    minWidth:
      zone === 'extreme-tall'
        ? 'calc(var(--rail-h, 280px) * 0.45)'
        : zone === 'tall'
          ? 'calc(var(--rail-h, 280px) * 0.55)'
          : undefined,
  } as React.CSSProperties;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className={cn('relative bg-blanc-muted group', rowHeightClass)}
      style={widthCapStyle}
      data-ratio-zone={zone}
    >
      <div className="relative h-full" style={{ aspectRatio }}>
        <AdaptiveImage
          src={item.imageUrl}
          alt={item.title}
          fit="native"
          width={item.imageWidth}
          height={item.imageHeight}
          priority={priority}
          sizes={sizes}
          className="transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>
      {item.caption && (
        <figcaption className="absolute left-0 right-0 -bottom-8 pt-3 text-xs text-noir/60 tracking-[0.1em] uppercase">
          <p className="font-display text-sm text-noir truncate normal-case tracking-wide">{item.title}</p>
          <p className="text-noir/50 mt-0.5 normal-case">{item.caption}</p>
        </figcaption>
      )}
    </motion.figure>
  );
}

// --- ArtworkGrid ---

interface ArtworkGridProps {
  items: ArtworkMedia[];
  /** Column counts by breakpoint. Defaults: 1/2/3. */
  columns?: { base?: number; md?: number; lg?: number };
  gap?: string;
  linkRenderer?: (href: string, children: ReactNode, className?: string) => ReactNode;
  emptyState?: ReactNode;
  dataTestId?: string;
}

export function ArtworkGrid({
  items,
  columns = { base: 1, md: 2, lg: 3 },
  gap = 'gap-6 md:gap-10',
  linkRenderer,
  emptyState,
  dataTestId = 'artwork-grid',
}: ArtworkGridProps) {
  if (items.length === 0) return <>{emptyState ?? null}</>;

  const gridColsClass = cn(
    columns.base === 1 && 'grid-cols-1',
    columns.base === 2 && 'grid-cols-2',
    columns.md === 2 && 'md:grid-cols-2',
    columns.md === 3 && 'md:grid-cols-3',
    columns.lg === 2 && 'lg:grid-cols-2',
    columns.lg === 3 && 'lg:grid-cols-3',
    columns.lg === 4 && 'lg:grid-cols-4',
  );

  return (
    <div className={cn('grid items-start', gridColsClass, gap)} data-testid={dataTestId}>
      {items.map((item, index) => {
        const content = <ArtworkGridCell item={item} priority={index < 3} />;
        if (item.href && linkRenderer) {
          return (
            <div key={item.id}>
              {linkRenderer(item.href, content, 'block')}
            </div>
          );
        }
        if (item.href) {
          return (
            <a key={item.id} href={item.href} className="block">
              {content}
            </a>
          );
        }
        return <div key={item.id}>{content}</div>;
      })}
    </div>
  );
}

interface ArtworkGridCellProps {
  item: ArtworkMedia;
  priority: boolean;
}

function ArtworkGridCell({ item, priority }: ArtworkGridCellProps) {
  const zone = classifyRatio(item.imageWidth, item.imageHeight);
  const spanClass = zone === 'wide' || zone === 'extreme-wide' ? 'md:col-span-2' : '';

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className={cn('group', spanClass)}
      data-ratio-zone={zone}
    >
      <div className="relative overflow-hidden bg-blanc-muted">
        <AdaptiveImage
          src={item.imageUrl}
          alt={item.title}
          fit="native"
          width={item.imageWidth}
          height={item.imageHeight}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>
      <figcaption className="mt-4">
        <p className="font-display text-base text-noir tracking-wide">{item.title}</p>
        {item.caption && <p className="text-noir/50 text-sm tracking-wide mt-1">{item.caption}</p>}
      </figcaption>
    </motion.figure>
  );
}

// --- ArtworkHero ---

interface ArtworkHeroProps {
  src: string;
  alt: string;
  imageWidth: number | null;
  imageHeight: number | null;
  priority?: boolean;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  ariaLabel?: string;
  dataTestId?: string;
}

export function ArtworkHero({
  src,
  alt,
  imageWidth,
  imageHeight,
  priority = true,
  onClick,
  onKeyDown,
  ariaLabel,
  dataTestId = 'artwork-main-image',
}: ArtworkHeroProps) {
  const hasDims = !!imageWidth && !!imageHeight;
  const zone = classifyRatio(imageWidth, imageHeight);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={cn(
        'relative mx-auto bg-blanc-muted border border-noir/10 overflow-hidden',
        onClick && 'cursor-zoom-in',
      )}
      style={{
        aspectRatio: hasDims ? `${imageWidth} / ${imageHeight}` : '4 / 5',
        maxWidth: zone === 'extreme-wide' ? '100%' : '1400px',
        maxHeight: '90vh',
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
      data-testid={dataTestId}
      data-ratio-zone={zone}
    >
      <AdaptiveImage
        src={src}
        alt={alt}
        fit="native"
        width={imageWidth}
        height={imageHeight}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1400px"
      />
    </motion.div>
  );
}

// --- ArtworkHighlight ---

/**
 * Full-width editorial moment for extreme ratios (panoramas > 3:1, very-tall < 1:3).
 * Used by callers who want to promote an extreme-ratio item out of the rail/grid.
 */
interface ArtworkHighlightProps {
  src: string;
  alt: string;
  imageWidth: number | null;
  imageHeight: number | null;
  caption?: string;
  priority?: boolean;
}

export function ArtworkHighlight({
  src,
  alt,
  imageWidth,
  imageHeight,
  caption,
  priority = false,
}: ArtworkHighlightProps) {
  const zone = classifyRatio(imageWidth, imageHeight);
  return (
    <motion.figure
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1 }}
      className="w-full my-12 md:my-20"
      data-testid="artwork-highlight"
      data-ratio-zone={zone}
    >
      <div className="relative">
        <AdaptiveImage
          src={src}
          alt={alt}
          fit="native"
          width={imageWidth}
          height={imageHeight}
          priority={priority}
          sizes="100vw"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-sm text-noir/50 tracking-wide italic text-center">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
