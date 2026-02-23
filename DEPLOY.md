# ORUS Gallery — Deployment & Renaming Guide

## Vercel Project Rename (aorus-gallery → orusgallery)

The current Vercel project is named `aorus-gallery`, which creates brand collision
with AORUS (gaming hardware brand). The public-facing domain should reflect **ORUS Gallery**.

### Steps

1. **Vercel Dashboard** → Project Settings → General → Project Name
   - Change from `aorus-gallery` to `orusgallery`

2. **Custom Domain** (recommended)
   - Add `orusgallery.com` as primary domain
   - DNS: Point A record to Vercel's IP (`76.76.21.21`)
   - Or CNAME `cname.vercel-dns.com` for subdomain

3. **Remove default subdomain**
   - After custom domain is verified, the `*.vercel.app` URL becomes secondary
   - Vercel auto-redirects old project URLs after rename

4. **Environment variables**
   - Update `NEXT_PUBLIC_SITE_URL` if set (e.g., to `https://orusgallery.com`)
   - Update any webhook URLs pointing to the old `.vercel.app` domain

5. **Email alignment**
   - Email already uses `@orusgallery.com` — no change needed
   - Verify SPF/DKIM records if adding new domain

### Post-Rename Checklist

- [ ] Vercel project name updated
- [ ] Custom domain added and SSL provisioned
- [ ] Old `.vercel.app` URL redirects correctly
- [ ] OpenGraph URLs in metadata point to new domain
- [ ] Contact form action URL updated (if applicable)
- [ ] Google Search Console updated with new domain
