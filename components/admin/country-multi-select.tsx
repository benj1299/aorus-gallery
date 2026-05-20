'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Locale } from '@/i18n/routing';

interface CountryMultiSelectProps {
  name: string;
  defaultValue?: string[];
}

// Maps next-intl locale → BCP-47 region label locale.
// zh → zh-Hant (Traditional, Taiwan/HK display).
function localeForDisplay(locale: Locale): string {
  if (locale === 'zh') return 'zh-Hant';
  return locale;
}

// ISO 3166-1 alpha-2 codes (249 territoires officiels). Hardcoded car
// `Intl.supportedValuesOf('region')` n'existe PAS dans la spec ECMA-402 —
// les seules keys valides sont calendar, collation, currency,
// numberingSystem, timeZone, unit. Hotfix d'un bug runtime client
// `RangeError: Invalid key : region` qui crashait toute page admin form
// après l'intégration de CountryMultiSelect.
//
// Labels traduits via `Intl.DisplayNames` qui supporte bien type:'region'.
const ISO_3166_1_ALPHA_2 = [
  'AD','AE','AF','AG','AI','AL','AM','AO','AQ','AR','AS','AT','AU','AW','AX','AZ',
  'BA','BB','BD','BE','BF','BG','BH','BI','BJ','BL','BM','BN','BO','BQ','BR','BS','BT','BV','BW','BY','BZ',
  'CA','CC','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO','CR','CU','CV','CW','CX','CY','CZ',
  'DE','DJ','DK','DM','DO','DZ',
  'EC','EE','EG','EH','ER','ES','ET',
  'FI','FJ','FK','FM','FO','FR',
  'GA','GB','GD','GE','GF','GG','GH','GI','GL','GM','GN','GP','GQ','GR','GS','GT','GU','GW','GY',
  'HK','HM','HN','HR','HT','HU',
  'ID','IE','IL','IM','IN','IO','IQ','IR','IS','IT',
  'JE','JM','JO','JP',
  'KE','KG','KH','KI','KM','KN','KP','KR','KW','KY','KZ',
  'LA','LB','LC','LI','LK','LR','LS','LT','LU','LV','LY',
  'MA','MC','MD','ME','MF','MG','MH','MK','ML','MM','MN','MO','MP','MQ','MR','MS','MT','MU','MV','MW','MX','MY','MZ',
  'NA','NC','NE','NF','NG','NI','NL','NO','NP','NR','NU','NZ',
  'OM',
  'PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PW','PY',
  'QA',
  'RE','RO','RS','RU','RW',
  'SA','SB','SC','SD','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','SS','ST','SV','SX','SY','SZ',
  'TC','TD','TF','TG','TH','TJ','TK','TL','TM','TN','TO','TR','TT','TV','TW','TZ',
  'UA','UG','UM','US','UY','UZ',
  'VA','VC','VE','VG','VI','VN','VU',
  'WF','WS',
  'YE','YT',
  'ZA','ZM','ZW',
] as const;

function getCountryList(displayLocale: string): { code: string; label: string }[] {
  const display = new Intl.DisplayNames([displayLocale], { type: 'region', fallback: 'code' });
  return ISO_3166_1_ALPHA_2
    .map((code) => ({ code, label: display.of(code) ?? code }))
    .sort((a, b) => a.label.localeCompare(b.label, displayLocale));
}

export function CountryMultiSelect({ name, defaultValue = [] }: CountryMultiSelectProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('admin.forms');
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const countries = useMemo(() => getCountryList(localeForDisplay(locale)), [locale]);
  const labelByCode = useMemo(() => {
    const map = new Map<string, string>();
    countries.forEach((c) => map.set(c.code, c.label));
    return map;
  }, [countries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries.filter((c) => !selected.includes(c.code)).slice(0, 50);
    return countries
      .filter((c) => !selected.includes(c.code))
      .filter((c) => c.label.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
      .slice(0, 50);
  }, [countries, selected, query]);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function add(code: string) {
    if (selected.includes(code)) return;
    setSelected([...selected, code]);
    setQuery('');
  }

  function remove(code: string) {
    setSelected(selected.filter((c) => c !== code));
  }

  return (
    <div ref={wrapperRef} className="relative">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((code) => (
            <span
              key={code}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-900 text-sm rounded-full border border-gray-200"
            >
              <span className="text-xs text-gray-500 font-mono">{code}</span>
              <span>{labelByCode.get(code) ?? code}</span>
              <button
                type="button"
                onClick={() => remove(code)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
                aria-label={`Remove ${code}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search + dropdown */}
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t('countriesPlaceholder')}
          autoComplete="off"
        />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-full max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {filtered.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => add(c.code)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs text-gray-500 font-mono w-8">{c.code}</span>
              <span className="text-gray-900">{c.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Hidden inputs : FormData.getAll('countries') retourne tous les codes */}
      {selected.map((code) => (
        <input key={code} type="hidden" name={name} value={code} />
      ))}
    </div>
  );
}
