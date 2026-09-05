'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AdaptiveImage } from '@/components/ui/adaptive-image';

/**
 * Multi-format artwork display primitives.
 *
 * Design decisions (data/development/briefs/orus-gallery/multi-format-strategy.md Â§ 6):
 *
 * - `<ArtworkRail>` â€” horizontal rail, constant row height, width adapts to
 *   each image's native aspect ratio. Gagosian pattern. Extreme-ratio items
 *   are capped (panorama â‰¤ 1.5Ã—row-height) or widened (tall â‰¥ 0.5Ã—row-height).
 *   Items with ratio > 3:1 or < 1:3 are rendered as `<ArtworkHighlight>`
 *   outside the rail (responsibility of the caller).
 *
 * - `<ArtworkGrid>` â€” fixed-column grid, each cell uses its image's native
 *   aspect ratio via CSS aspect-ratio. Zwirner/Perrotin pattern. Ratios in
 *   the "stretched" zone span 2 columns; ratios in the "extreme" zone render
 *   as full-width rows (via `<ArtworkHighlight>` above the grid, not here).
 *
 * - `<ArtworkHero>` â€” artwork detail main image. Container matches the image's
 *   aspect ratio exactly. Max-height 90vh, max-width 1400px, centered, zero crop.
 *
 * When dimensions are unknown (legacy rows pre-backfill), the components fall
 * back to `aspect-[4/5]` + `object-contain` â€” never crop on native fit, even
 * when ratios are missing (pre-launch feedback 2026-05).
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
  /** Optional link â€” wraps the cell if provided. */
  href?: string;
  /** Real-world dimensions in cm â€” used by ArtworkSalon for proportional scaling. */
  widthCm?: number | null;
  heightCm?: number | null;
  dimensionsLabel?: string | null;
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
  paddingClass = 'px-4 md:px-8 lg:px-12',
  dataTestId = 'artwork-rail',
}: ArtworkRailProps) {
  if (items.length === 0) return <>{emptyState ?? null}</>;

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-blanc to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-blanc to-transparent z-10 pointer-events-none" />
      <div
        className={cn(
          'flex items-start gap-6 md:gap-10 overflow-x-auto overflow-y-hidden overscroll-y-none scrollbar-hide snap-x snap-mandatory scroll-smooth pb-8 cursor-grab active:cursor-grabbing',
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

  // Cap widths for stretched/extreme ratios (designer Â§ 6.2)
  const imageBoxStyle = {
    aspectRatio,
    maxWidth:
      zone === 'extreme-wide'
        ? 'calc(var(--rail-h, 280px) * 3)'
        : zone === 'wide'
          ? 'calÊ˜\ŠK\˜Z[Z
H
ˆK
IÂˆˆ[™Yš[™YˆZ[•ÚY‚ˆ›Û™HOOH	Ù^™[YK][	ÂˆÈ	ØØ[Ê˜\ŠK\˜Z[Z
H
ˆJIÂˆˆ›Û™HOOH	İ[	ÂˆÈ	ØØ[2‡f"‚Ò×&–ÂÖ‚Â#ƒ‚’¢ãSR’p¢¢VæFVf–æVBÀ¢Ò2&V7Bä555&÷W'F–W3° ¢&WGW&â€¢ÆÖ÷F–öâæf–wW&P¢–æ—F–Ã×·²÷6—G“¢Â“¢#×Ğ¢v†–ÆT–åf–Ws×·²÷6—G“¢Â“¢×Ğ¢f–Ww÷'C×·²öæ6S¢G'VRÂÖ&v–ã¢rÓƒ‚r×Ğ¢G&ç6—F–öã×·²GW&F–öã¢ãb×Ğ¢6Æ74æÖSÒ&w&÷WfÆW‚fÆW‚Ö6öÂ ¢FF×&F–ò×¦öæS×·¦öæWĞ¢à¢ÆF—`¢6Æ74æÖS×¶6â‚w&VÆF—fR&rÖ&Ææ2Ö×WFVB÷fW&fÆ÷rÖ†–FFVârÂ&÷t†V–v‡D6Æ72—Ğ¢7G–ÆS×¶–ÖvT&÷…7G–ÆWĞ¢à¢ÄFF—fT–ÖvP¢7&3×¶—FVÒæ–ÖvUW&ÇĞ¢ÇC×¶—FVÒçF—FÆWĞ¢f—CÒ&æF—fR ¢v–GFƒ×¶—FVÒæ–ÖvUv–GF‡Ğ¢†V–v‡C×¶—FVÒæ–ÖvT†V–v‡GĞ¢&–÷&—G“×·&–÷&—G—Ğ¢6—¦W3×·6—¦W7Ğ¢6Æ74æÖSÒ'G&ç6—F–öâÖ÷6—G’GW&F–öâÓSw&÷WÖ†÷fW#¦÷6—G’Ó“ ¢óà¢ÂöF—cà¢Æf–v6F–öâ6Æ74æÖSÒ&×BÓR‚ÓãRÖ‚×rÖgVÆÂ#à¢¶—FVÒæ6F–öâbb€¢Ç6Æ74æÖSÒ'FW‡BÕ³ãcW&VÕÒÖC§FW‡B×‡2G&6¶–ærÕ³ã&VÕÒWW&66RFW‡BÖæö—"óSR#à¢¶—FVÒæ6F–öçĞ¢Â÷à¢—Ğ¢Ç6Æ74æÖSÒ&föçBÖF—7Æ’—FÆ–2FW‡B×6ÒÖC§FW‡BÕ³ã“W&VÕÒFW‡BÖæö—"óƒRG&6¶–ær×v–FR×BÓãRG'Væ6FR#à¢¶—FVÒçF—FÆWĞ¢Â÷à¢Âöf–v6F–öãà¢ÂöÖ÷F–öâæf–wW&Sà¢“°§Ğ ¢òòÒÒÒ'Gv÷&´w&–BÒÒĞ ¦–çFW&f6R'Gv÷&´w&–E&÷2°¢—FV×3¢'Gv÷&´ÖVF–µÓ°¢ò¢¢6öÇVÖâ6÷VçG2'’'&V·ö–çBâFVfVÇG3¢ó"ó2â¢ğ¢6öÇVÖç3ó¢²&6Só¢çVÖ&W#²ÖCó¢çVÖ&W#²Æsó¢çVÖ&W"Ó°¢vó¢7G&–æs°¢Æ–æµ&VæFW&W#ó¢†‡&Vc¢7G&–ærÂ6†–ÆG&Vã¢&V7DæöFRÂ6Æ74æÖSó¢7G&–ær’Óâ&V7DæöFS°¢V×G•7FFSó¢&V7DæöFS°¢FFFW7D–Có¢7G&–æs°§Ğ ¦W‡÷'BgVæ7F–öâ'Gv÷&´w&–B‡°¢—FV×2À¢6öÇVÖç2Ò²&6S¢ÂÖC¢"ÂÆs¢2ÒÀ¢vÒvvÓbÖC¦vÓrÀ¢Æ–æµ&VæFW"À¢V×G•7FFRÀ¢FFFW7D–BÒv'Gv÷&²Öw&–BrÀ§Ó¢'Gv÷&´w&–E&÷2’°¢–b†—FV×2æÆVæwF‚ÓÓÒ’&WGW&âÃç¶V×G•7FFRóòçVÆÇÓÂóã° ¢6öç7Bw&–D6öÇ46Æ72Ò6â€¢6öÇVÖç2æ&6RÓÓÒbbvw&–BÖ6öÇ2ÓrÀ¢6öÇVÖç2æ&6RÓÓÒ"bbvw&–BÖ6öÇ2Ó"rÀ¢6öÇVÖç2æÖBÓÓÒ"bbvÖC¦w&–BÖ6öÇ2Ó"rÀ¢6öÇVÖç2æÖBÓÓÒ2bbvÖC¦w&–BÖ6öÇ2Ó2rÀ¢6öÇVÖç2æÆrÓÓÒ"bbvÆs¦w&–BÖ6öÇ2Ó"rÀ¢6öÇVÖç2æÆrÓÓÒ2bbvÆs¦w&–BÖ6öÇ2Ó2rÀ¢6öÇVÖç2æÆrÓÓÒBbbvÆs¦w&–BÖ6öÇ2ÓBrÀ¢“° ¢&WGW&â€¢ÆF—b6Æ74æÖS×¶6â‚wG&–B—FV×2×7F'BrÂw&–D6öÇ46Æ72Âv—ÒFF×FW7F–C×¶FFFW7D–GÓà¢¶—FV×2æÖ‚†—FVÒÂ–æFW‚’Óâ°¢6öç7B6öçFVçBÒÄ'Gv÷&´w&–D6VÆÂ—FVÓ×¶—FV×Ò&–÷&—G“×¶–æFW‚Â7Òóã°¢–b†—FVÒæ‡&VbbbÆ–æµ&VæFW&W"’°¢&WGW&â€¢ÆF—b¶W“×¶—FVÒæ–GÓà¢¶Æ–æµ&VæFW&W"†—FVÒæ‡&VbÂ6öçFVçBÂv&Æö6²r—Ğ¢ÂöF—cà¢“°¢Ğ¢–b†—FVÒæ‡&Vb’°¢&WGW&â€¢Æ¶W“×¶—FVÒæ–GÒ‡&Vc×¶—FVÒæ‡&VgÒ6Æ74æÖSÒ&&Æö6²#à¢¶6öçFVçGĞ¢Âöà¢“°¢Ğ¢&WGW&âÆF—b¶W“×¶—FVÒæ–GÓç¶6öçFVçGÓÂöF—cã°¢Ò—Ğ¢ÂöF—cà¢“°§Ğ ¦–çFW&f6R'Gv÷&´w&–D6VÆÅ&÷2°¢—FVÓ¢'Gv÷&´ÖVF–°¢&–÷&—G“¢&ööÆVã°§Ğ ¦gVæ7F–öâ'Gv÷&´w&–D6VÆÂ‡²—FVÒÂ&–÷&—G’Ó¢'Gv÷&´w&–D6VÆÅ&÷2’°¢6öç7B¦öæRÒ6Æ76–g•&F–ò†—FVÒæ–ÖvUv–GF‚Â—FVÒæ–ÖvT†V–v‡B“°¢6öç7B7ä6Æ72Ò¦öæRÓÓÒwv–FRrÇÂ¦öæRÓÓÒvW‡G&VÖR×v–FRròvÖC¦6öÂ×7âÓ"r¢rs° ¢&WGW&â€¢ÆÖ÷F–öâæf–wW&P¢–æ—F–Ã×·²÷6—G“¢Â“¢#×Ğ¢v†–ÆT–åf–Ws×·²÷6—G“¢Â“¢×Ğ¢f–Ww÷'C×·²öæ6S¢G'VRÂÖ&v–ã¢rÓƒ‚r×Ğ¢G&ç6—F–öã×·²GW&F–öã¢ãb×Ğ¢6Æ74æÖS×¶6â‚wG&÷WrÂ7ä6Æ72—Ğ¢FF×&F–ò×¦öæS×·¦öæWĞ¢à¢ÆF—b6Æ74æÖSÒ'&VÆF—fR÷fW&fÆ÷rÖ†–FFVâ&rÖ&Ææ2Ö×WFVB#à¢ÄFF—fT–ÖvP¢7&3×¶—FVÒæ–ÖvUW&ÇĞ¢ÇC×¶—FVÒçF—FÆWĞ¢f—CÒ&æF—fR ¢v–GFƒ×¶—FVÒæ–ÖvUv–GF‡Ğ¢†V–v‡C×¶—FVÒæ–ÖvT†V–v‡GĞ¢&–÷&—G“×·&–÷&—G—Ğ¢6—¦W3Ò"†Ö‚×v–GFƒ¢sc‡‚’grÂ†Ö‚×v–GFƒ¢#G‚’SgrÂ37gr ¢6Æ74æÖSÒ'G&ç6—F–öâ×G&ç6f÷&ÒGW&F–öâÓsw&÷WÖ†÷fW#§66ÆRÕ³ã%Ò ¢óà¢ÂöF—cà¢Æf–v6F–öâ6Æ74æÖSÒ&×BÓB#à¢Ç6Æ74æÖSÒ&föçBÖF—7Æ’FW‡BÖ&6RFW‡BÖæö—"G&6¶–ær×v–FR#ç¶—FVÒçF—FÆWÓÂ÷à¢¶—FVÒæ6F–öâbbÇ6Æ74æÖSÒ'FW‡BÖæö—"óSFW‡B×6ÒG&6¶–ær×v–FR×BÓ#ç¶—FVÒæ6F–öçÓÂ÷çĞ¢Âöf–v6F–öãà¢ÂöÖ÷F–öâæf–wW&Sà¢“°§Ğ 