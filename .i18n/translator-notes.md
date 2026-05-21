# ORUS Gallery i18n backfill — translator notes
Generated: 2026-05-21T12:05:40.424Z
Total entities: 306

## Stats by operation

- `copy:fr` : 86
- `copy:zh` : 87
- `translate:fr` : 6
- `translate:zh` : 6

## Locales filled, by model

| Model | EN filled | FR filled | ZH filled |
|---|---|---|---|
| collection | 0 | 6 | 6 |
| exhibition | 0 | 86 | 87 |

## Skipped (policy=skip) — 8 fields

- artist:Carlos Romano (bio)
- artist:Ewa Goral (bio)
- artist:Halee Roth (bio)
- artist:Matthieu Scheiffer (bio)
- artist:Owen Rival (bio)
- artist:Rebekka Macht (bio)
- artist:Renée Le Bloas -Julienne (bio)
- artist:Richard Mensah (bio)

## Bio integrity check

All Artist.bio fields are byte-identical between before/after (8 artists).

## Suspicious entries — 0


## Known data quirks (sources untouched, propagated as-is per policy)

- Several FR nationality fields had leading/trailing whitespace (e.g. `' Canada'`, `'États-Unis '`); preserved verbatim since sacred.
- One artist (Carlos Romano) has `nationality.zh = 'Angola'` (English text in zh slot) in source; per 'no invent' rule, this was already filled so we did not modify it.
- `Renée Le Bloas -Julienne` had `nationality.en = 'France'` but the artist is FR-born (per bio: Toronto-born, FR nationality). EN field is sacred per rule; we backfilled FR=`France` and ZH=`法國` from EN.
- One galleryExhibition entity contains `<p>test</p>` placeholder content (`test` entity); these are dev test rows, treated as literal content.
- Several artwork medium FR fields contain English words (e.g. `'résine et filtre dichroïque sur support en bois'` is mixed-language) but Renée's preference appears to be Franglais; preserved.
