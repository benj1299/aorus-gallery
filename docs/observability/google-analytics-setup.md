# Google Analytics 4 — Setup

## État technique (Benjamin)

✅ Le code est en place (commit `feat(orus-gallery): observability — GA4 via @next/third-parties + Consent Mode v2`).

- Composant : `<GoogleAnalytics gaId={...} />` du package officiel `@next/third-parties/google` dans `app/layout.tsx`
- Consent Mode v2 par défaut **denied** sur tous les axes (RGPD-friendly) — GA4 reçoit uniquement des "consent signals" (trafic agrégé) tant qu'aucun banner cookie n'est déployé. Aucune donnée personnelle ne fuite.
- CSP mise à jour pour autoriser `googletagmanager.com` et `google-analytics.com`
- Variable d'env : `NEXT_PUBLIC_GA_MEASUREMENT_ID` (vide = composant non rendu, site fully GA-free)
- Validé : `pnpm build` clean

**Tant que la variable d'env n'est pas settée sur Vercel, rien ne se charge.** Pas de risque de mauvais collecte/double tracking.

---

## Ce qu'il faut faire (Victor)

### Option A — Recommandée : tu crées la propriété GA4 et tu me partages le Measurement ID + un accès Editor

C'est ~5 minutes côté toi. Bénéfices :
- Tu gardes la propriété de la donnée (compte Google = ton compte).
- Je peux configurer/réconcilier les events, les conversions, les dashboards sans te déranger.
- Si demain tu veux retirer mon accès, c'est un clic.

**Étapes pour toi** :

1. Va sur https://analytics.google.com (avec le compte Google que tu veux utiliser pour la galerie — perso ou pro, le tien).
2. Si pas encore de compte GA :
   - Clic sur **Admin** (engrenage en bas à gauche) → **Créer** → **Compte**.
   - Nom du compte : `ORUS Gallery`.
   - Pays : France (ou Taiwan).
   - Coche les options de partage de données par défaut, puis **Suivant**.
3. **Créer une propriété** :
   - Nom : `orusgallery.com`
   - Fuseau : `(GMT+01:00) Paris`
   - Devise : `EUR`
   - **Suivant** → secteur `Arts et divertissement` → taille `Petite`.
   - Objectifs : `Examiner le comportement des utilisateurs`.
   - **Créer**, accepter les CGU.
4. **Configurer le flux de données Web** :
   - URL du site : `https://www.orusgallery.com`
   - Nom du flux : `ORUS Gallery — Production`
   - **Création de flux**.
   - Sur la page suivante, GA affiche un **Measurement ID** au format `G-XXXXXXXXXX` (10 caractères après `G-`). **C'est lui dont j'ai besoin.**
5. **Me donner accès** (optionnel mais recommandé) :
   - Toujours dans **Admin** → **Gestion des accès aux comptes** (au niveau Compte, pas au niveau Propriété, pour que je voie tout).
   - **+** en haut à droite → **Ajouter des utilisateurs**.
   - Mon email Google : `<À REMPLIR PAR BENJAMIN — l'email Google que tu utilises pour analytics>`
   - Rôle : **Éditeur** (pas Administrateur — Éditeur suffit pour configurer les events/conversions sans pouvoir supprimer le compte).
   - Décoche "Notifier l'utilisateur par e-mail" si tu préfères pas spammer ma boîte.
6. **M'envoyer le Measurement ID** par WhatsApp ou email, format : `G-XXXXXXXXXX`.

### Option B — Plus rapide : tu me donnes juste le Measurement ID, sans accès

Si tu préfères pas me donner d'accès Editor (totalement OK), tu fais juste les étapes 1-4 de l'option A et tu m'envoies le `G-XXXXXXXXXX`. Le tracking marchera identiquement. La seule chose que je ne pourrai pas faire à distance, c'est :
- Configurer les "events" customs (clic sur un artwork, soumission contact, etc.)
- Créer des audiences/segments
- Lier à Google Ads ou Search Console

Si plus tard tu veux qu'on push le tracking plus loin (ex : "je veux savoir quel artiste génère le plus d'inquiries"), tu pourras me donner l'accès à ce moment-là.

### Option C — Tu crées un sous-compte Google "ops" et tu me le partages

Si tu veux compartimenter, tu peux créer un Google Account séparé style `ops@orusgallery.com` (gratuit, prend 2 minutes via Gmail), créer la propriété GA4 dessus, et m'en donner les credentials. C'est plus opérationnel pour une galerie qui veut "tout l'observability dans un compte ops" mais pas encore nécessaire à ce stade.

---

## Ce que ça permet (à attendre dans GA4 sous 24-48h)

Une fois le `G-XXXXXXXXXX` setté côté Vercel :

- **Audience** : visiteurs uniques, sessions, géographie, devices, pages vues
- **Acquisition** : d'où viennent les visiteurs (Google search, social, direct, referral)
- **Engagement** : pages les plus visitées, durée moyenne, scroll depth
- **Funnel** : combien de visiteurs arrivent sur une page artiste vs page œuvre vs contact

Pas activé pour l'instant (à activer plus tard via events customs) :
- Quel artwork est le plus cliqué
- Combien de personnes envoient un mail "inquire"
- Conversions par campagne/source

---

## Workflow post-handoff (Benjamin)

Quand Victor envoie le Measurement ID :

```bash
cd data/development/Clients/En-cours/aorus-gallery
bash -c 'set -a; source .env; set +a; \
  echo -n "G-XXXXXXXXXX" | vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID production --token "$VERCEL_TOKEN" --force'
bash -c 'set -a; source .env; set +a; \
  vercel deploy --prod --token "$VERCEL_TOKEN" --yes'
```

Vérification (sous 5min après deploy) :
- Ouvrir le site en navigation privée
- Vérifier le network tab : requête à `googletagmanager.com/gtag/js?id=G-XXXXXXXXXX` doit charger sans CSP error
- Sur GA4 dashboard → Reports → Realtime → "1 user active" doit apparaître

---

## RGPD / cookie banner — phase 2 (à planifier)

Pour ÊTRE complètement conforme RGPD avec tracking complet (analytics_storage = granted), il faut un cookie banner CMP. Recommandations :

- **Axeptio** (français, design propre, free tier généreux jusqu'à 10k visiteurs/mois) — match bien avec un site galerie.
- **Cookiebot** (plus enterprise, plus cher).
- **Tarteaucitron.js** (open source, à customiser, gratuit).

Quand le banner sera là, il appellera `gtag('consent', 'update', { ... })` pour faire passer les axes en `granted` quand l'utilisateur accepte. Le code GA actuel attend déjà ce signal (Consent Mode v2 default-denied).

Pour l'instant, on tourne en **mode tracking minimal conforme RGPD** : pas de cookies, pas de PII, juste des stats agrégées via consent signals — légalement OK même sans banner.
