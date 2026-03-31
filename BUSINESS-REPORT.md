# ORUS Gallery -- Business Report

**Prepared for:** Victor Jouaneau, Founder
**Date:** March 30, 2026
**Version:** 1.0

---

## A. Executive Summary

ORUS Gallery is a contemporary art gallery founded between Paris and Taiwan, positioning itself as a cultural bridge connecting Western contemporary artists with Asian collectors. The name -- Origin + Us -- encapsulates a curatorial philosophy built around intimacy, memory, and cross-cultural dialogue.

### Current State of the Website

The site is live at [aorus-gallery.vercel.app](https://aorus-gallery.vercel.app) and delivers a polished, trilingual (English, French, Traditional Chinese) experience. It runs on a modern Next.js 16 stack with a PostgreSQL database (Neon), Prisma ORM, a full admin CMS, and is deployed on Vercel. The design is refined and appropriately minimal for a luxury gallery -- white space, Cormorant Garamond typography, subtle Framer Motion animations, and a restrained gold-jade-ivory palette.

### Key Strengths

1. **Trilingual from day one.** English, French, and Traditional Chinese -- the three languages that matter most for a Paris-Taipei gallery. This is rare among competitors and a genuine competitive advantage.
2. **Professional-grade CMS.** A full admin panel to manage artists, artworks, exhibitions, press, banners, and contact submissions. This means Victor can operate independently without a developer for day-to-day content updates.
3. **Strong brand identity.** The "Origin + Us" concept, the curatorial voice, and the visual language are coherent and distinctive. The tone is poetic without being pretentious, intimate without being casual.
4. **Solid technical foundation.** Security headers (CSP, X-Frame-Options), SEO infrastructure (sitemap, robots.txt, i18n routing), and authentication (better-auth) are all in place.
5. **Smart schema design.** All content fields (artist bios, artwork titles, exhibition descriptions) are stored as JSON to support multilingual data natively. This is the right architectural choice.

### Key Gaps

1. **No real content.** The site is structurally complete but largely empty. No real artworks with images, no live exhibitions, no press articles. The artists page shows placeholder text. This is the single biggest blocker to business readiness.
2. **No newsletter capture.** There is no email subscription mechanism anywhere on the site. For a pre-launch gallery, building a list is the most valuable marketing asset.
3. **No social proof.** No press coverage, no testimonials, no "as seen at" section. Victor's Sotheby's background is not mentioned anywhere on the public site.
4. **No founder presence.** The About page describes the gallery's philosophy beautifully but never mentions Victor by name. In the gallery world, the founder's reputation IS the gallery's credibility.
5. **Stock/placeholder images.** The gallery images on the About page appear to be generic gallery interiors, not actual ORUS Gallery spaces.

---

## B. Site Audit Summary

| Domain | Score | Assessment |
|--------|-------|------------|
| **Frontend** | 78/100 | Elegant design, smooth animations (Framer Motion), responsive layout, proper component architecture (AnimatedSection, CTAStrip, PageHero). Deducted points for stock imagery and some visual repetition between sections. |
| **Backend** | 82/100 | Full CRUD admin panel for artists, artworks, exhibitions, press, banners, messages. Server actions with Zod validation. better-auth for authentication. Clean separation of queries and actions. Missing: image upload pipeline (relying on external URLs), no API rate limiting. |
| **Data** | 85/100 | Excellent schema design -- JSON fields for multilingual content, proper relations (Artist -> Artwork -> Exhibition), enums for exhibition types and statuses, contact submission tracking. Price field with Decimal precision. Missing: analytics tracking, newsletter subscribers table. |
| **Security** | 72/100 | Good: CSP header, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, poweredByHeader disabled. Concerning: CSP allows 'unsafe-inline' and 'unsafe-eval' for scripts. No CSRF token visible on contact form. Admin routes skip i18n middleware but no explicit auth guard in middleware. |
| **SEO** | 75/100 | Good: dynamic sitemap with artist pages, robots.txt properly blocking /admin and /api, locale-prefixed URLs, meta descriptions per page in all three languages. Missing: structured data (JSON-LD for Gallery, ArtGallery, or Organization schema), Open Graph images, hreflang alternate links in HTML head. |
| **Product** | 45/100 | The feature set exists (artists, artworks, exhibitions, press, contact form) but content is thin. No online viewing room, no e-commerce or "price on request" workflow, no newsletter, no blog/editorial, no events calendar, no collector accounts. Compared to gallery industry standard, the feature gap is significant. |
| **Business Readiness** | 35/100 | Not ready to show to collectors in its current state. The structural foundation is solid, but the empty content makes it feel like a template. A collector visiting today would see placeholder bios, no artworks, and no exhibitions. Victor's personal credibility -- the gallery's strongest asset -- is invisible. |

**Overall: 67/100** -- Strong technical foundation, weak content and business readiness.

---

## C. Target Audience

### Primary: Asian Collectors (Taiwan, Hong Kong, Singapore)

This is the core market. Taiwan's tech boom has created a generation of internationally-minded collectors with significant disposable income. GDP per capita has surpassed Japan, and the semiconductor industry's global orientation means Taiwanese collectors are comfortable with Western art and international transactions. Key characteristics:

- **Established collectors (45-60):** Longtime collectors attending fairs (Art Basel HK, formerly Taipei Dangdai), with 10+ year track records. They value personal relationships, curatorial expertise, and access to Western artists they cannot easily find through local galleries. They speak English and Mandarin.
- **New-generation collectors (30-45):** Tech and finance professionals beginning to build collections in the 5K-50K USD range per piece. They discover art through Instagram, seek education and guided curation, and want to understand before they buy. Digital-first discovery, but relationship-driven conversion.

**Key insight:** The Taichung Art Museum and New Taipei Art Museum both opened in 2025, signaling strong institutional growth. However, Taipei Dangdai has cancelled its 2026 edition after declining participation (from 90+ galleries to ~50), creating a gap in the fair landscape. This is both a risk (less visibility) and an opportunity (collectors seeking new channels).

### Secondary: European Collectors (Paris Network)

Victor's existing network from his Sotheby's career and Parisian art world connections. These are mature collectors looking for:

- New curatorial perspectives
- Exposure to Asian markets and exhibition opportunities
- A trusted intermediary for navigating the Asia pivot

### Tertiary: Artists Seeking Asian Representation

Artists currently represented in Europe or the US but without Asian gallery representation. ORUS offers:

- Access to a growing collector base
- Exhibition opportunities in Taiwan
- A gallerist who understands both markets

### Press and Institutions

Art journalists, curators, and museum professionals covering the Asia-Europe art corridor. They need press kits, high-resolution images, and clear narratives.

---

## D. Brand Identity Analysis

### Name: ORUS (Origin + Us)

The name works exceptionally well. It is short, memorable, pronounceable in English, French, and Mandarin, and carries a layered meaning. "Origin" speaks to artistic heritage and cultural roots; "Us" speaks to community and shared experience. The combination positions the gallery as a place where personal and cultural origins meet collective experience. It avoids the common trap of naming a gallery after its founder (which limits growth) while maintaining intimacy.

### Visual Identity: Paper and Jade

The color palette is restrained and intentional:

- **Noir (#0A0A0A):** Authority, sophistication, gallery-standard darkness
- **Or/Gold (#C9A962):** Luxury, warmth, the accent that signals high-end without being ostentatious
- **Jade (#2D7A5E / #4A7C6F):** The distinctively Asian accent -- jade is culturally significant in Chinese collecting traditions, and its use signals awareness of the target market
- **Blanc/Ivory (#F5F0E8):** Warmth, paper, approachability within luxury

This palette differentiates ORUS from competitors who almost universally use stark black-and-white (Gagosian, White Cube, Pace) or safe neutrals. The jade-gold combination is memorable and culturally resonant.

### Typography

- **Cormorant Garamond** for display: Elegant, timeless, with a serif warmth that avoids the cold minimalism of many gallery sites
- **Inter** for body: Clean, highly legible, modern
- **Noto Serif SC** for Chinese: Correct choice for Traditional Chinese (Taiwan uses Traditional, not Simplified)

### Voice and Tone

The copywriting across all three languages is poetic, curatorial, and intimate. Phrases like "Works capable of shifting context without losing their essence" and "Intimacy as a bridge between cultures" establish a distinctive voice that is neither commercial nor academic. The French version is the most nuanced (likely the original writing language), while the Chinese version is well-localized (not machine-translated) with culturally appropriate phrasing.

**Standout detail:** The Chinese translation includes localized marketing angles not present in the other languages, such as mentioning "nine artists, not ninety" and referencing "Europe, Africa, and Asia" art scenes. This suggests genuine cultural adaptation rather than simple translation.

### Positioning

ORUS occupies a distinctive niche: **the intimate, curatorially-driven bridge gallery between Western contemporary art and Asian collectors.** This is not the mega-gallery model (Gagosian, Pace) nor the regional gallery model. It is closer to how Perrotin or Lehmann Maupin started -- with a specific curatorial vision and a geographic strategy -- but with the unique advantage of being founded specifically for the Asia-Europe corridor rather than expanding into it later.

---

## E. Competitive Analysis

### Gallery Comparison Matrix

| Feature | **ORUS** | **Perrotin** | **Pace** | **Hauser & Wirth** | **White Cube** | **Gagosian** |
|---------|----------|------------|--------|-------------------|--------------|------------|
| **Locations** | Taipei, Paris (by appt) | 9 cities (Paris, HK, Tokyo, Seoul, Shanghai, NY, LA, London, Dubai) | 8 cities (NY, HK, Seoul, London, LA, Tokyo, Geneva, Palo Alto) | 15+ locations globally | 6 cities (London, HK, Seoul, Paris, NY, online) | 18 spaces globally |
| **Website Languages** | EN, FR, ZH (Traditional) | EN, FR | EN | EN, DE | EN | EN |
| **Artist Roster Size** | ~17 (announced) | 80+ | 90+ | 90+ | 60+ | 100+ |
| **Online Viewing Rooms** | No | Yes | Yes (Pace Live since 2019) | Yes (dedicated section) | Yes (Salon programme) | Yes (with pricing) |
| **E-commerce/Shop** | No | Yes (bookstore, editions) | No (inquiry-based) | Yes (editions, prints) | No (inquiry-based) | Yes (Gagosian Shop) |
| **Newsletter** | No | Yes | Yes | Yes | Yes | Yes (Gagosian Quarterly) |
| **Editorial/Blog** | No | Yes (podcast, video) | Yes (journal) | Yes (extensive editorial) | Yes | Yes (Gagosian Quarterly magazine) |
| **Social Media** | Not launched | Instagram: 1.3M+ | Instagram: 800K+ | Instagram: 1.5M+ | Instagram: 1M+ | Instagram: 2M+ |
| **AR/Digital Innovation** | No | No | No (discontinued) | VR platform | No | No |
| **Art Fair Presence** | None yet | ~20 fairs/year | Major fairs globally | Major fairs globally | Major fairs globally | Major fairs globally |
| **Events Programme** | None yet | Workshops, concerts, panels | Pace Live events | Extensive (farms, hospitality) | Monthly Salon | Quarterly publication |

| Feature | **Thaddaeus Ropac** | **Lehmann Maupin** | **Almine Rech** | **Galerie Templon** | **Lisson Gallery** |
|---------|--------------------|--------------------|-----------------|--------------------|--------------------|
| **Locations** | London, Paris (2), Salzburg, Milan, Seoul | NY, Seoul, London | Paris, Brussels, London, Shanghai, Marrakech | Paris (2), Brussels, NY | London (2), NY, LA, Shanghai, Beijing |
| **Website Languages** | EN, FR, DE | EN | EN, FR | EN, FR | EN |
| **Artist Roster Size** | 70+ | 60+ | 50+ | 60+ | 70+ |
| **Online Viewing Rooms** | Yes (dedicated section) | Yes + AR (CollectAR) | Yes | Yes | Yes |
| **E-commerce/Shop** | No | No | Yes | No | No |
| **Newsletter** | Yes | Yes | Yes | Yes | Yes |
| **Editorial/Blog** | Yes | Yes | Yes | Yes | Yes |
| **Social Media** | Active | Active + AR campaigns | Active | Active | Active |
| **AR/Digital Innovation** | No | Yes (CollectAR AR platform) | No | No | No |

### Key Competitive Insights

1. **ORUS has a language advantage.** Of the 10 competitors analyzed, none offer Traditional Chinese on their website. Perrotin (present in 5 Asian cities) offers only English and French. This is a genuine gap in the market. A Taiwanese collector browsing the ORUS site in Mandarin has an experience no mega-gallery currently provides.

2. **Every competitor has a newsletter.** ORUS is the only gallery in this comparison without email capture. This is the most urgent gap to close.

3. **Every competitor has editorial content.** Whether it is Gagosian's Quarterly magazine, Perrotin's podcasts, or Hauser & Wirth's extensive editorial programme, content marketing is table stakes for galleries at any level.

4. **Online viewing rooms are standard.** Since COVID accelerated their adoption, OVRs are expected by collectors. Gagosian even includes pricing in theirs -- a significant industry shift toward transparency.

5. **ORUS's small roster is a strategic advantage, not a weakness.** While mega-galleries represent 70-100+ artists, ORUS's ~17 artists allows for deeper relationships and more focused curation. This mirrors the early strategies of Perrotin and Lehmann Maupin before they scaled.

6. **The Taipei Dangdai cancellation creates urgency.** With the fair's 2026 edition cancelled and its future uncertain, galleries with an Asia strategy need alternative channels to reach Taiwanese collectors. ORUS's digital presence and direct relationships become more valuable.

7. **Lehmann Maupin's CollectAR is the innovation leader.** Their augmented reality platform for experiencing artworks is the most advanced digital feature among competitors. This represents the future direction of digital gallery experiences.

---

## F. Strategic Recommendations

### 1. Acquisition -- How to Drive Traffic

#### Instagram (Priority 1)

Instagram is the primary discovery platform for art collectors -- 65% of art buyers use it to discover new artists. ORUS should launch with a clear strategy:

- **Account setup:** @orusgallery. Bilingual captions (English + Chinese). Bio: "Contemporary Art | Taipei -- Paris | Origin + Us"
- **Content pillars:** (1) Artist studio visits and process videos, (2) Artwork close-ups and details, (3) Curatorial texts as designed quote cards, (4) Behind-the-scenes of gallery life between Taipei and Paris, (5) Collector stories (with permission)
- **Posting cadence:** 4-5 feed posts per week, daily Stories. Wednesdays see highest engagement (up to 2x Monday levels). Peak hours: 9am-4pm in target timezone
- **Reels strategy:** Short-form video (15-30 seconds) of artist studios, artwork reveals, and exhibition walkthroughs. Reels currently receive the highest organic reach on Instagram
- **Hashtag strategy:** Mix of high-volume (#contemporaryart, #artcollector) and niche (#taipeiart, #asianartcollector, #artgallery台北)
- **Growth tactics:** Tag artists in every post, engage with collector accounts in comments, collaborate with art media accounts for features

**Target:** 5,000 followers within 6 months, 15,000 within 12 months.

#### Art Fairs (Priority 2)

With Taipei Dangdai on hiatus, the fair landscape is shifting. Recommended fairs:

- **Art Basel Hong Kong** (March): The anchor fair for Asian collecting. Apply as an emerging gallery for the Discoveries sector
- **Frieze Seoul** (September): Strong momentum, good for Korean and international collectors
- **Art Taipei** (October): Taiwan's longest-running fair, strong local collector base
- **1-54 Contemporary African Art Fair** (London/Marrakech): Relevant given ORUS's roster includes several African and African-diaspora artists
- **Alternative to Taipei Dangdai:** A new fair is reportedly planning a 2026 launch in Taipei and Hong Kong to fill the gap. Monitor this development closely

#### WeChat and LINE (Priority 3)

- **WeChat Official Account:** Essential for reaching mainland Chinese collectors and maintaining visibility in the Chinese-speaking art world. Post translated exhibition announcements, artist features, and fair participation. Consider WeChat Moments advertising for targeted reach
- **LINE:** Taiwan's dominant messaging platform (used by 90%+ of the population). A LINE Official Account allows direct communication with Taiwanese collectors and event announcements
- **Implementation note:** Both platforms require local phone numbers and entity verification. Budget for a part-time social media coordinator in Taipei

#### LinkedIn (Priority 4)

- Position Victor as a thought leader in the Asia-Europe art corridor
- Publish articles on cross-cultural collecting, market insights, and curatorial perspectives
- Target: corporate collection managers, institutional curators, art advisors
- Connect with key stakeholders at TSMC, MediaTek, and other Taiwanese tech companies whose executives are emerging collectors

#### SEO Keywords to Target

| Keyword | Language | Intent |
|---------|----------|--------|
| "contemporary art gallery taipei" | EN | Local discovery |
| "台北當代藝術畫廊" | ZH | Local discovery |
| "galerie art contemporain paris taipei" | FR | Cross-market |
| "buy contemporary art asia" | EN | Commercial |
| "western art for asian collectors" | EN | Niche positioning |
| "emerging artists europe asia" | EN | Artist discovery |
| "art advisory taiwan" | EN | Service discovery |
| "收藏當代藝術" (collecting contemporary art) | ZH | Educational |

### 2. Conversion -- How to Turn Visitors into Inquiries

#### Newsletter (Immediate Priority)

- Add email capture to: homepage (above CTA strip), footer (all pages), dedicated popup (after 30 seconds on artist pages)
- Segment from signup: Collector / Press / Artist / Institution (mirrors the contact form)
- Language preference capture at signup to send content in the right language
- Monthly cadence: (1) New artist spotlight, (2) Exhibition preview, (3) Market insight or curatorial essay
- Tool recommendation: Mailchimp or Brevo (both support CJK characters and multilingual campaigns)

**Technical note:** The database schema already has a ContactSubmission model. Add a NewsletterSubscriber model with email, language, segment, and subscription status fields.

#### WhatsApp and WeChat Widget

- Add a floating WhatsApp button (bottom-right corner) for instant collector inquiries. WhatsApp is widely used in international art transactions
- On Chinese-language pages, swap to a WeChat QR code widget
- Both channels allow Victor to respond personally, reinforcing the gallery's relationship-first positioning

#### "Price on Request" Workflow

The Artwork model already has `price`, `currency`, and `showPrice` fields. Create a flow:

1. Collector clicks "Inquire" on an artwork page
2. Pre-filled contact form opens with the artwork name and artist
3. Submission triggers an email to Victor with collector details and the artwork information
4. Victor follows up personally

This is standard gallery practice and much more effective than showing prices publicly, as it initiates a relationship.

#### Events and Exhibitions as Conversion Drivers

- Every exhibition should have a dedicated landing page with: dates, participating artists, selected works, a "Request Private Viewing" button
- Art fair participation should be announced 4-6 weeks in advance with "Book an Appointment" functionality
- Consider Calendly or a similar tool for scheduling private viewings and studio visits

### 3. Optimization -- How to Improve the Digital Experience

#### Online Viewing Rooms (Phase 3)

Every competitor offers this. An OVR for ORUS should:

- Present a curated selection of 8-12 works with high-resolution zoomable images
- Include artist statement, curatorial text, and artwork details (medium, dimensions, year)
- Offer "Request Information" per artwork
- Optionally: password-protected rooms for VIP collectors

This can be built as a new page type in the existing CMS, leveraging the GalleryExhibition model already in the schema.

#### Collector Accounts (Phase 3-4)

A private area where registered collectors can:

- View works reserved for them (using the existing `visible` flag on artworks)
- Track their inquiries
- Access exclusive content and previews
- Receive personalized recommendations

This builds on the existing better-auth system and User model.

#### Art Advisory Services Page

ORUS's curatorial text already describes advisory-like services ("we build collections, not just sell artworks"). Formalize this with a dedicated page covering:

- Collection building and strategy
- Art advisory for corporate collections
- Due diligence and provenance research
- Exhibition consulting for institutions

#### Blog and Editorial Content

Start with monthly long-form content:

- Artist profiles (deeper than the bio page)
- Exhibition essays and curatorial texts
- Market perspectives on the Asia-Europe corridor
- Collector stories and collection features

This content feeds SEO, newsletter, and social media simultaneously.

### 4. Physical + Digital Synergy

#### Gallery Openings to Digital Follow-Up

- Every physical event should capture attendee emails (tablet signup at entrance)
- Send a digital recap within 48 hours: photos, available works, "continue the conversation" CTA
- Create Instagram Stories and Reels during the event for real-time engagement

#### QR Codes at Fairs

- Each displayed artwork should have a QR code linking to its page on the ORUS website (in the visitor's detected language)
- QR code on business cards linking to the artist roster
- QR code for WeChat/LINE account follow at the booth

#### WeChat Mini-Program (Phase 4)

For deeper engagement with Chinese-speaking collectors, a WeChat Mini-Program could offer:

- Virtual exhibition viewing
- Appointment booking
- Artwork catalog browsing
- Push notifications for new exhibitions

This is a significant investment (10-20K USD) but would position ORUS as the most digitally sophisticated gallery targeting Chinese collectors.

#### Taipei Exhibition Tie-In

Without Taipei Dangdai in 2026, consider:

- A pop-up exhibition during Art Taipei (October 2026)
- A satellite event during Taipei Art Week
- A private viewing event at a Taipei hotel or cultural space, timed to coincide with collector traffic in the city

---

## G. Roadmap

### Phase 1: Content Launch (Now -- 4 weeks)

| Action | Priority | Effort |
|--------|----------|--------|
| Upload real artworks with high-resolution images for all roster artists | P0 | Medium |
| Write and publish real artist biographies in all three languages | P0 | Medium |
| Add Victor's bio and photo to the About page | P0 | Low |
| Replace stock gallery images with real ORUS Gallery photos or commission appropriate photography | P0 | Medium |
| Populate at least one exhibition (even if upcoming/announced) | P1 | Low |
| Add at least one press article or mention | P1 | Low |
| Add newsletter signup to homepage and footer | P1 | Low |
| Set up Google Analytics and Search Console | P1 | Low |

**Exit criteria:** A collector visiting the site can see real artworks, real artists with biographies, and understand who Victor is. They can subscribe to a newsletter and submit an inquiry about a specific work.

### Phase 2: Market Activation (1-3 months)

| Action | Priority | Effort |
|--------|----------|--------|
| Launch Instagram account with 30+ pre-planned posts | P0 | Medium |
| Send first newsletter to existing contacts | P0 | Low |
| Apply to first art fair (Art Basel HK Discoveries or Art Taipei) | P0 | Medium |
| Add structured data (JSON-LD) for Organization and ArtGallery schema | P1 | Low |
| Add Open Graph meta images for social sharing | P1 | Low |
| Implement WhatsApp widget on the site | P1 | Low |
| Set up WeChat Official Account | P2 | Medium |
| Set up LINE Official Account | P2 | Medium |
| Publish first editorial blog post | P2 | Medium |

**Exit criteria:** ORUS has an active Instagram presence, a growing newsletter list, and a confirmed art fair participation. Collectors can reach Victor via WhatsApp directly from the website.

### Phase 3: Digital Experience (3-6 months)

| Action | Priority | Effort |
|--------|----------|--------|
| Build online viewing room feature (CMS-managed) | P1 | High |
| Add "Request Information" per artwork with pre-filled inquiry form | P1 | Medium |
| Launch Calendly or booking integration for private viewings | P1 | Low |
| Add art advisory services page | P2 | Low |
| Implement collector accounts (private login area) | P2 | High |
| Monthly editorial content (blog + newsletter + social) | P2 | Ongoing |
| WeChat QR code on Chinese-language pages | P2 | Low |
| Password-protected OVRs for VIP collectors | P3 | Medium |

**Exit criteria:** Collectors can browse works online, request information on specific pieces, and book private viewings. A viewing room has been used for at least one exhibition or fair.

### Phase 4: Scale and Deepen (6-12 months)

| Action | Priority | Effort |
|--------|----------|--------|
| Launch video content (artist studio visits, curator talks) | P2 | High |
| Consider WeChat Mini-Program for Chinese collector engagement | P3 | High |
| Implement analytics dashboard tracking visitor-to-inquiry conversion | P2 | Medium |
| Launch LinkedIn thought leadership for Victor | P2 | Ongoing |
| Explore AR "View in Room" feature for artworks (following Lehmann Maupin's lead) | P3 | High |
| Multi-currency pricing display (EUR, USD, TWD) | P3 | Low |
| Second art fair participation | P1 | Medium |

**Exit criteria:** ORUS has a functioning content engine (editorial, social, newsletter), a track record at 1-2 art fairs, and a digital experience that matches or exceeds mid-tier competitors.

---

## H. KPIs to Track

### Awareness Metrics

| KPI | Baseline | 3-Month Target | 12-Month Target |
|-----|----------|----------------|-----------------|
| Monthly unique website visitors | ~0 (pre-launch) | 500 | 3,000 |
| Instagram followers | 0 | 2,000 | 15,000 |
| Newsletter subscribers | 0 | 200 | 1,500 |
| WeChat/LINE followers | 0 | 100 | 500 |

### Engagement Metrics

| KPI | Baseline | Target |
|-----|----------|--------|
| Average session duration | -- | > 2 minutes |
| Pages per session | -- | > 3 |
| Artist page views per month | -- | Track growth MoM |
| Instagram engagement rate | -- | > 3% (gallery average) |
| Newsletter open rate | -- | > 35% (art industry average) |

### Conversion Metrics

| KPI | Baseline | 3-Month Target | 12-Month Target |
|-----|----------|----------------|-----------------|
| Form submissions per month | 0 | 5 | 25 |
| Visit-to-inquiry conversion rate | -- | 1% | 2% |
| Art fair appointments booked | 0 | 10 per fair | 25 per fair |
| Private viewing requests per month | 0 | 2 | 10 |

### Revenue Metrics

| KPI | Target |
|-----|--------|
| Average deal value | Track per transaction |
| Revenue per collector per year | Track and grow |
| New collectors acquired per quarter | 3-5 initially |
| Repeat collector rate | > 30% within 12 months |

### Tracking Implementation

- **Google Analytics 4:** Website traffic, user flows, conversion events (form submit, newsletter signup, artwork inquiry)
- **Search Console:** Keyword rankings, click-through rates, indexing status
- **Instagram Insights:** Follower growth, reach, engagement, demographic breakdown
- **CRM tracking:** The existing ContactSubmission model should be extended to track inquiry source (website, fair, referral, social) and outcome (converted, in progress, lost)

---

## Appendix: Competitive Research Sources

- [Perrotin](https://www.perrotin.com/) -- 9 global locations, 80+ artists, editorial content and podcast
- [Pace Gallery](https://www.pacegallery.com/) -- Online exhibitions platform, Pace Live since 2019
- [Hauser & Wirth](https://www.hauserwirth.com/) -- Online viewing rooms, VR platform, 15+ locations
- [White Cube](https://www.whitecube.com/) -- Monthly Salon programme online, 6 cities
- [Gagosian](https://gagosian.com/) -- 18 spaces, Gagosian Quarterly, online viewing rooms with pricing
- [Thaddaeus Ropac](https://ropac.net/) -- Online exhibitions, 70+ artists across 6 cities including Seoul
- [Lehmann Maupin](https://www.lehmannmaupin.com/) -- CollectAR augmented reality platform, Seoul presence
- [Almine Rech](https://www.alminerech.com/) -- Shanghai location, 50+ artists
- [Galerie Templon](https://www.templon.com/) -- Paris, Brussels, New York, established 1966
- [Lisson Gallery](https://www.lissongallery.com/) -- 70+ artists, Shanghai and Beijing locations since 2019/2021
- [Taipei Dangdai cancellation](https://www.artnews.com/art-news/news/taipei-dangdai-cancels-2026-edition-art-assembly-1234748049/) -- 2026 edition cancelled, fair landscape shifting
- [Asian art market trends 2025-2026](https://news.artnet.com/market/the-asia-pivot-recap-2025-2726775) -- New collector demographics and market dynamics
- [Art gallery Instagram strategy](https://artworldmarketing.com/marketing-for-galleries/) -- 65% of art buyers discover artists on Instagram
- [Artlogic gallery software](https://artlogic.net/) -- Industry-standard OVR and collector management tools

---

*This report was prepared based on a full technical analysis of the ORUS Gallery codebase, all three language translation files, competitive research on 10 leading international galleries, and current art market data for the Asia-Europe corridor. All recommendations are designed to be actionable by a non-technical gallery owner working with a development partner.*
