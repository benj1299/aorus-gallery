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

## Git workflow

**Règle absolue : ne JAMAIS commit sur `main` directement.** Toujours créer une feature branch `feat/...` ou `fix/...` depuis `origin/main` (pas local main), travailler dessus, ouvrir PR, squash-merge, puis ré-aligner local main.

GitHub fait du **squash merge** (paramètre du repo). Conséquence : si tu as un commit orphelin sur local main qui n'est jamais pushé, le squash recrée ce contenu sur origin/main et local main "diverge" (chacun a un commit unique que l'autre n'a pas, ancêtre commun = avant l'orphan).

### Avant chaque PR

```bash
# Repartir d'origin/main, JAMAIS de local main
git fetch origin
git switch -c <branch-name> origin/main
```

### Après merge d'une PR

```bash
git fetch origin --prune          # remote refs cleanup
git switch <some-other-branch>    # quitter main si on est dessus
git branch -f main origin/main    # ré-aligner local main (non-destructif)
git switch main
```

Ne jamais utiliser `git reset --hard` pour résoudre la divergence — `git branch -f` suffit puisque le contenu est déjà dans le squash sur origin/main. Les commits orphelins sur local main restent dans le reflog 90 jours (récupérables si besoin).
