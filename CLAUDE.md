# ORUS Gallery — Project Notes

## Deploy

**⚠️ Auto-deploy GitHub webhook = OFF.** Le projet ne build pas automatiquement
sur push (vérifié : 0 GitHub status sur les commits récents). Tout deploy
**doit** passer par le Vercel CLI avec un token.

### Procédure

1. Token Vercel stocké dans `.env` (gitignored) :
   ```
   VERCEL_TOKEN=...
   ```
2. Le compte CLI courant (`vercel whoami`) n'a **pas** accès au team du projet
   (`team_gpR80fkDqB2bIo2MBQGIutfp`), donc **toujours passer le token explicitement** :
   ```bash
   set -a && . .env && set +a
   vercel deploy --prod --token "$VERCEL_TOKEN" --yes
   ```
3. Build attendu : ~3-5 min (Next.js 16 + Prisma generate).
4. Domaine prod : https://www.orusgallery.com — l'alias `aorus-gallery.vercel.app`
   peut renvoyer `DEPLOYMENT_NOT_FOUND` (anciennement utilisé, plus actif).

### Monitoring sans accès dashboard

Comme le CLI n'a pas accès au team, pour vérifier qu'un deploy est live, poll
le HTML prod et grep un changement attendu :
```bash
curl -s https://www.orusgallery.com/fr/about | grep -q "<needle>"
```

## Stack

- Next.js 16.1.7, React 19.2.3, Tailwind v4
- Prisma 7 + Neon (Postgres serverless via `@neondatabase/serverless`)
- better-auth, next-intl (FR/EN/ZH), framer-motion, Tiptap
- R2 (S3-compat) pour les images via `@aws-sdk/client-s3`
- Playwright e2e (`pnpm e2e` local, `pnpm e2e:prod` contre prod)

## Conventions de nommage commits

`<type>(orus-gallery): <description>` — type ∈ {feat, fix, chore, refactor, test, seo}.
Description en français, scope toujours `orus-gallery`.
