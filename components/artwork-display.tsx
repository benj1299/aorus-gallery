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
  /** Real-world dimensions in cm — used by ArtworkSalon for proportional scaling. */
  widthCm?: number | null;
  heightCm?: number | null;
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
          'flex items-start gap-6 md:gap-10 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-2 cursor-grab active:cursor-grabbing',
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
  const imageBoxStyle = {
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
      className="group flex flex-col"
      data-ratio-zone={zone}
    >
      <div
        className={cn('relative bg-blanc-muted overflow-hidden', rowHeightClass)}
        style={imageBoxStyle}
      >
        <AdaptiveImage
          src={item.imageUrl}
          alt={item.title}
          fit="native"
          width={item.imageWidth}
          height={item.imageHeight}
          priority={priority}
          sizes={sizes}
          className="transition-opacity duration-500 group-hover:opacity-90"
        />
      </div>
      <figcaption className="mt-5 px-0.5 max-w-full">
        {item.caption && (
          <p className="text-[0.65rem] md:text-xs tracking-[0.2em] uppercase text-noir/55">
            {item.caption}
          </p>
        )}
        <p className="font-display italic text-sm md:text-[0.95rem] text-noir/85 tracking-wide mt-1.5 truncate">
          {item.title}
        </p>
      </figcaption>
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

// --- ArtworkSalon ---

/**
 * Salon-hang display for an artist's body of work.
 *
 * - Desktop (≥md): proportional scale based on real-world dimensions (widthCm/heightCm).
 *   Items align on a baseline (items-end) like a museum wall. Tallest piece at full
 *   reference height; smaller pieces scale down to a 40% floor for legibility.
 * - Mobile (<md): uniform 2-col grid with native aspect-ratio + dimensions caption,
 *   for a clean readable layout where proportional scaling would be unreadable.
 *
 * Items missing widthCm/heightCm fall back to the mobile (uniform) layout on every
 * breakpoint. To enable proportional desktop, backfill cm dimensions in DB.
 */
interface ArtworkSalonProps {
  items: ArtworkMedia[];
  linkRenderer?: (href: string, children: ReactNode, className?: string) => ReactNode;
  emptyState?: ReactNode;
  /** Reference height in px for the largest piece (desktop). */
  referenceHeight?: number;
  /** Floor for proportional scaling (avoid invisible miniatures). 0–1, default 0.4. */
  scaleFloor?: number;
  dataTestId?: string;
}

export function ArtworkSalon({
  items,
  linkRenderer,
  emptyState,
  referenceHeight = 460,
  scaleFloor = 0.4,
  dataTestId = 'artwork-salon',
}: ArtworkSalonProps) {
  if (items.length === 0) return <>{emptyState ?? null}</>;

  const itemsWithCm = items.filter((it) => it.widthCm && it.heightCm);
  const proportionalEnabled = itemsWithCm.length === items.length && items.length > 0;
  const maxHeightCm = proportionalEnabled
    ? Math.max(...itemsWithCm.map((it) => it.heightCm ?? 0))
    : 0;

  const renderCell = (item: ArtworkMedia, mode: 'proportional' | 'uniform', index: number) => {
    const aspectRatio = item.imageWidth && item.imageHeight ? `${item.imageWidth} / ${item.imageHeight}` : '4 / 5';
    const cell = (
      <ArtworkSalonCell
        item={item}
        mode={mode}
        aspectRatio={aspectRatio}
        referenceHeight={referenceHeight}
        scaleFloor={scaleFloor}
        maxHeightCm={maxHeightCm}
        priority={index < 3}
      />
    );
    if (item.href && linkRenderer) {
      return <div key={item.id}>{linkRenderer(item.href, cell, 'block h-full')}</div>;
    }
    if (item.href) {
      return (
        <a key={item.id} href={item.href} className="block h-full">
          {cell}
        </a>
      );
    }
    return <div key={item.id}>{cell}</div>;
  };

  return (
    <div data-testid={dataTestId}>
      {/* Desktop — proportional scale (Option A) */}
      {proportionalEnabled && (
        <div className="hidden md:flex flex-wrap items-end gap-x-10 lg:gap-x-14 gap-y-16 lg:gap-y-20">
          {items.map((item, index) => renderCell(item, 'proportional', index))}
        </div>
      )}

      {/* Mobile — uniform grid + dimensions caption (Option B) — also fallback when cm missing */}
      <div className={cn('grid grid-cols-2 gap-6 sm:gap-8', proportionalEnabled && 'md:hidden')}>
        {items.map((item, index) => renderCell(item, 'uniform', index))}
      </div>
    </div>
  );
}

interface ArtworkSalonCellProps {
  item: ArtworkMedia;
  mode: 'proportional' | 'uniform';
  aspectRatio: string;
  referenceHeight: number;
  scaleFloor: number;
  maxHeightCm: number;
  priority: boolean;
}

function ArtworkSalonCell({
  item,
  mode,
  aspectRatio,
  referenceHeight,
  scaleFloor,
  maxHeightCm,
  priority,
}: ArtworkSalonCellProps) {
  const isProportional = mode === 'proportional' && item.heightCm && item.widthCm && maxHeightCm > 0;
  const scale = isProportional
    ? Math.max(scaleFloor, (item.heightCm as number) / maxHeightCm)
    : 1;
  const cellHeight = Math.round(referenceHeight * scale);

  const dimsCaption = item.widthCm && item.heightCm ? `${item.widthCm} × ${item.heightCm} cm` : null;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="group flex flex-col"
    >
      <div
        className="relative bg-blanc-muted overflow-hidden"
        style={
          isProportional
            ? { height: `${cellHeight}px`, aspectRatio }
            : { aspectRatio }
        }
      >
        <AdaptiveImage
          src={item.imageUrl}
          alt={item.title}
          fit="native"
          width={item.imageWidth}
          height={item.imageHeight}
          priority={priority}
          sizes={isProportional ? `${cellHeight}px` : '(max-width: 768px) 50vw, 33vw'}
          className="transition-opacity duration-500 group-hover:opacity-90"
        />
      </div>
      <figcaption className="mt-4 px-0.5">
        <p className="font-display italic text-sm text-noir/85 tracking-wide truncate">
          {item.title}
        </p>
        {item.caption && (
          <p className="text-noir/50 text-xs tracking-wide mt-1 truncate">{item.caption}</p>
        )}
        {/* In uniform/mobile mode, display real cm dimensions to remove visual ambiguity */}
        {!isProportional && dimsCaption && (
          <p className="text-noir/45 text-[0.7rem] tracking-[0.15em] uppercase mt-1.5">
            {dimsCaption}
          </p>
        )}
      </figcaption>
    </motion.figure>
  );
}
