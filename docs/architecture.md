# Architecture

## Overview

![Architecture diagram](images/architecture.png)
*Editors work in Contentful; the Next.js storefront on Vercel composes Contentful content with BigCommerce commerce data. The editable source is `images/source/architecture.html`.*

<details>
<summary>Text version of the diagram</summary>

```
                          ┌────────────────────────── Editors ───────────────────────────┐
                          │ Contentful web app: entry forms + Live Preview               │
                          └───────────────┬───────────────────────────────▲──────────────┘
                                          │ publish                       │ frame (draft)
                                          ▼                               │
   ┌──────────────────────────┐   ┌────────────────────┐      ┌───────────┴────────────┐
   │ Contentful (US)          │   │ BigCommerce        │      │ Next.js 16 storefront  │
   │ • 18 content types       │   │ "commerce b2b"     │      │ proxy.ts → [locale]    │
   │ • locales en, fr         │   │ headless channel   │◄─────┤ Server Components      │
   │ • draft / published      │◄──┤ catalog, prices,   │ GQL  │ Server Actions (cart)  │
   └──────────────▲───────────┘   │ carts, checkout    │      │ small Client Components│
                  │ Delivery /    └────────────────────┘      └───────────┬────────────┘
                  │ Preview API                                           │
                  └───────────────────────────────────────────────────────┘
                                                                           ▼
                                                                  Visitors (EN at /, FR at /fr)
```

</details>

Two systems of record, one composition layer:

| Concern | Lives in | Why |
|---|---|---|
| Pages (as ordered blocks), articles, guides, FAQs, banners, navigation, announcements, product *storytelling* | Contentful | Editors own wording, imagery, structure, order of the blocks and translations |
| Catalog, categories, brands, prices, stock, carts, checkout | BigCommerce | Commerce data must stay authoritative and live |
| Product spotlight ↔ product link | `productSpotlight.bcProductId` | Editorial content is *keyed* to a product ID; price and stock are never copied into the CMS |

## Technology

| Layer | Choice |
|---|---|
| Framework | Next.js 16.3 (App Router, Turbopack), React 19.2, TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties (see [design-system.md](design-system.md)) |
| Content | Contentful Delivery and Preview APIs through plain `fetch` (`providers/cms/contentful/client.ts`), mapped into the content model in `core/content.ts`; rich text through `@contentful/rich-text-html-renderer` |
| Editing | `@contentful/live-preview` (inspector mode, edit and save events) plus a server-action overlay for typed edits |
| Commerce | BigCommerce Storefront GraphQL API (plain `fetch`) |
| Fonts | Archivo (display, variable width) and IBM Plex Sans via `next/font/google` |
| Tooling | Python 3 + Pillow for the seeding scripts |

> The project's `AGENTS.md` warns that this Next.js version has breaking changes. The docs in
> `node_modules/next/dist/docs/` are the reference (e.g. `params` and `searchParams` are Promises, the middleware file is
> now `proxy.ts`).

## Request lifecycle

1. **`proxy.ts`** runs first (catalog URLs are translated: `/products/...` and `/fr/produits/...`; the translated root is rewritten onto
   `/products/...` and travels in the `x-catalog-root` header, see [implementation.md](implementation.md#the-catalog-routes)). `/fr/...` passes through.
   `/en/...` redirects (308) to the clean URL. `/home` and `/fr/home` (the URLs Live Preview opens for the home page) are rewritten to the home
   pages. Every other path is *rewritten* internally to `/en/...`, so English keeps clean URLs while still matching `app/[locale]`.
   The proxy also checks the editor's `cf_preview` secret and, only when it matches, forwards `x-preview: 1` (any `x-preview` sent by a client is
   dropped), and sets `Content-Security-Policy: frame-ancestors` for Contentful's web app.
2. **`app/[locale]/layout.tsx`** validates the locale, sets `<html lang>`, and renders the edit support (preview only), the announcement bar,
   header (with the mega menu) and footer. These fetch their own data in parallel with the page.
3. **The page** (a Server Component) reads `params`, fetches its Page (an ordered list of blocks) from Contentful through `lib/content.ts`, and
   renders each block (`components/page-blocks.tsx`); blocks that need commerce data (spotlights) fetch from BigCommerce in parallel. Whether the
   request is a draft is decided by `isPreviewRequest()` (`lib/request.ts`), not by the page.
4. **Client Components** hydrate only where interaction is needed (listed below).
5. **Server Actions** handle cart mutations (they set the cart cookie and revalidate the layout so the header badge updates) and, in preview, the
   Live Preview overlay.

```
Browser ──► proxy.ts ──► app/[locale]/…page.tsx ──┬─► lib/content.ts ──► providers/cms/contentful ──► Contentful CDN / Preview API
                                                  └─► lib/bigcommerce.ts                         ──► BigCommerce GraphQL
```

## Rendering and caching

- Every page is **dynamically rendered**: it reads headers (`x-preview`), `searchParams` (filters) and/or cookies (cart).
- **BigCommerce** reads use `fetch` with `next: { revalidate: 300 }` (5 minutes), except carts (`no-store`).
- **Contentful** published reads use `next: { revalidate: 60, tags: ["contentful"] }`; draft reads (Live Preview) are `no-store`. Within one request, React
  `cache()` shares an entry list between `generateMetadata`, the page and the layout. Draft responses are also kept for 5 seconds per server
  instance (emptied when an entry is saved) so the quick re-renders while an editor types do not call the Preview API each time.
- Authors are fetched once per request and joined by entry id, instead of resolving `author` on every post. Links are resolved from the response's `includes`, three levels deep, and a link to an unpublished entry is dropped.

## Client Components (the only JavaScript that ships for interaction)

| Component | Purpose |
|---|---|
| `LivePreview` (via `EditSupport`) | starts the Live Preview SDK, sends typed edits to the server and re-renders on save, only in preview |
| `LocaleSwitcher` | links to the same page in the other language |
| `MegaMenu` | hover/click product menu |
| `PlpForm`, `SearchBox`, `PriceRange`, `SortSelect` | auto-applying filters and search-as-you-type |
| `ProductGallery`, `AddToCart` | product page interaction |
| `CartView`, `QtyStepper` | optimistic cart editing |

Everything else is server-rendered HTML.

## Data model at a glance

Eighteen content types: `page`, `heroBanner`, `featureBlock`, `textBlock`, `imageBlock`, `videoBlock`, `collectionBlock`, `author`, `blogPost`,
`faq`, `buyingGuide`, `guideStep`, `productSpotlight`, `useCase`, `announcementBar`, `siteNavigation`, `navLink`, `footerColumn`.

```
page ──components──► heroBanner | featureBlock | textBlock | imageBlock | videoBlock | collectionBlock   (ordered, top to bottom)
collectionBlock ──items──► buyingGuide | productSpotlight | blogPost | faq    (kind: categories, spotlights, guides, posts,
                                                                              postListing, guideListing, faqs)
blogPost ──content──► textBlock | imageBlock | videoBlock                      blogPost ──author──► author
blogPost ──relatedPost──► blogPost               buyingGuide ──author──► author
buyingGuide ──relatedFaqs──► faq                 buyingGuide ──steps──► guideStep
productSpotlight ──useCases──► useCase           productSpotlight ··bcProductId·· BigCommerce product
buyingGuide ··recommendedBcProducts·· BigCommerce products
siteNavigation ──headerLinks──► navLink          siteNavigation ──footerColumns──► footerColumn ──links──► navLink
announcementBar
```

References (`──►`) are Contentful entry links (`{ sys: { type: "Link", ... } }`). Dotted links (`··`) are plain IDs resolved at request time against
BigCommerce, so a deleted or renamed product never breaks a content entry. The pages are `home`, `faq`, `guides` and `blog` (their `slug`);
an editor can add more and they are served at `/<slug>`.

## Security model

- Tokens are server-side only (no `NEXT_PUBLIC_` variables). The storefront needs the **Delivery** token (published content), the
  **Preview** token and the **preview secret** (drafts for Live Preview) and a **scoped** BigCommerce Storefront token.
- Drafts are served only for requests the proxy verified (the `cf_preview` secret, constant-time comparison) and marked with `x-preview`; a client-supplied `x-preview` is dropped ([visual-editor.md](visual-editor.md#how-draft-mode-is-switched-on)).
- The BigCommerce Storefront token is created per **origin** and per **channel**. It expires (90 days by default).
- The **management token** exists only for the seeding scripts.
- `Content-Security-Policy: frame-ancestors` (set by `proxy.ts`) allows only Contentful's web app to embed the site (localhost too in development).
- Edit attributes and the SDK appear only for preview requests, so published HTML carries no editing markup.
- Rich text from Contentful and BigCommerce is rendered with `dangerouslySetInnerHTML`. Both are trusted,
  editor-controlled sources; do not render visitor-supplied HTML this way.
