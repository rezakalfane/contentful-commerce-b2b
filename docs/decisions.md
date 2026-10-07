# Decisions

Short records of the choices that shape the project: what was decided, why, and what was rejected. Newest context last
within each theme.

## Architecture

### D1. Contentful for content, BigCommerce for commerce; keyed by ID
**Decision.** Editorial content lives in Contentful; catalog, prices, stock and carts stay in BigCommerce. Content links
to products by **product ID / SKU** (`productSpotlight.bcProductId`, `buyingGuide.recommendedBcProducts`), resolved at
request time.
**Why.** Prices and stock must never go stale or be copied into a second system. Deleting a product only removes a card.
**Rejected.** Syncing products into Contentful (duplication and drift); storing prices in content.

### D2. Server Components first; JavaScript only for interaction
**Decision.** Pages render on the server; a handful of small Client Components (filters, cart, mega menu, gallery, the Live Preview
starter) handle interaction.
**Why.** Fast first paint, simple data flow, and Live Preview works with server rendering (a save triggers a server re-render) without client-side data fetching.

### D3. Storefront GraphQL, not the REST Management API, for the storefront
**Decision.** Read catalog and run carts through the **Storefront GraphQL API** with a channel-scoped token.
**Why.** It respects channel visibility, customer-group rules and guest pricing, is safe on the server with a narrow
token, and supports faceted search. The Management API (admin token) is for administration only.

## Content model

### D4. Reusable pieces are separate entries linked from the page
**Decision.** Contentful has no inline blocks, so `heroBanner`, `featureBlock`, `guideStep`, `useCase`, `navLink` and `footerColumn` are
content types of their own, and a page links to its pieces (`page.components`, `buyingGuide.steps`...); D34 extends this to whole pages as ordered block lists.
**Why.** The alternatives were one JSON `Object` field (poor editing UX, no validation) or rich-text embedded entries (only inside rich text).
Linked entries are validated, reusable, and can be tagged individually in Live Preview.
**Consequence.** More entries (the pieces plus the 18 content types stay well inside the Free plan limits), and one more click for editors.
Publishing needs the pieces published before the page that links to them.

### D5. UI strings in code, not in Contentful
**Decision.** Button and label text live in `lib/i18n.ts`.
**Why.** The dictionary is type-checked so a missing French string is a compile error, and these strings are product UI rather than editorial content.
**Consequence.** Editors cannot change UI labels without a developer; marketing copy (heroes, banners, nav) *is* in the CMS.

### D6. Select-field values stay English; display is mapped
**Decision.** FAQ topics, guide audiences and spotlight badges store fixed English values and are translated for display.
**Why.** Enum (Symbol) values are not localized.
**Consequence.** Adding a choice means editing the schema and the label maps.

### D7. Category photo tiles are static
**Decision.** The five home-page category tiles use files in `public/images/categories/` with labels from `lib/i18n.ts`.
**Why.** They match the BigCommerce category tree one-to-one and rarely change.
**Alternative later.** A `categoryTile` content type linked from the home `page` if editors need to change them.

## Internationalization

### D8. English at clean URLs, French under `/fr`; rewrite, not redirect
**Decision.** `proxy.ts` rewrites unprefixed paths to `/en/…` and redirects `/en/…` to the clean URL.
**Why.** Keeps existing URLs stable for the default language while using one `[locale]` route tree.
**Rejected.** `/en` prefix for English (changes all URLs); sub-domains (needs DNS/hosting setup).

### D9. Shared slugs for content; translated URLs for the catalog
**Decision.** Content pages share slugs across languages (`/fr/blog/<english-slug>`). The catalog uses BigCommerce's translated URLs
(`/fr/produits/<categorie>/<produit>`), with a language switcher that looks the page up.
**Why.** For content, the switcher is exact (swap the prefix) and no slug mapping is needed. For the catalog, BigCommerce already translates
and serves the paths, and French URLs are better for SEO and for visitors.
**History.** The catalog first kept English slugs in French (paths restored from the default-language catalog); translated URLs replaced that.

### D10. Field-level localization, with fallback to English
**Decision.** Translations live in the same entry (`fields.title.en`, `fields.title.fr`) rather than in duplicated entries per language. The French
locale falls back to English.
**Why.** Editors translate next to the English text, an entry is published once for all locales, links and images are shared, and a field
with no French value returns the English one, so a partially translated site has no gaps.
**Rejected.** One entry per language: it duplicates structure and every non-text field.
**Trade-off.** Publishing is all-or-nothing across locales.

### D11. Product text and URLs come from BigCommerce Store Translations
**Decision.** Do not translate product names, copy or paths in code. Read translated content from the Storefront API with an
`@shopperPreferences(locale: "fr")` directive (it ignores `Accept-Language`) and use the translated paths it returns (see [bigcommerce.md](bigcommerce.md)).
**Why.** Product data belongs to BigCommerce, including its URLs; a translated path only resolves in its own language, so pages resolve the
path of the page's language.
**Consequence.** The catalog root segment per language is configuration (`CATALOG_ROOT`); a language switch on a catalog page costs one
redirect through `/api/switch-locale`; filter values are translated, so attribute filters are not carried across languages.

## Editing

### D12. Server-rendered preview with refresh on save, not client-side rendering
**Decision.** Keep the Server Components. The Live Preview SDK tags the page; edits and saves re-render it on the server from the draft, with the
unsaved values overlaid while typing (D31).
**Why.** One rendering path for the site and the editor, with no client-side data fetching.
**Trade-off.** Plain text updates as it is typed; everything else follows the save (see D31).
**Rejected.** Rendering the page client-side from raw Contentful data with `useContentfulLiveUpdates`: it would replace the page components and
the BigCommerce composition.

### D13. Map entries into one content model; the components know no CMS
**Decision.** `providers/cms/contentful/mapper.ts` maps entries into the content model in `core/content.ts` (the same model as the other CMSs in
`content-commerce-b2b`), and `lib/content.ts` is the only thing the pages call. Components receive plain data and `$` edit attributes.
**Why.** The goal is the same UI on any CMS. The mapping layer is the only place that knows about Contentful, so another CMS only needs its own mapper.
**Earlier.** The first version of this site mapped entries into fixed page shapes (`lib/blog.ts`, `lib/site.ts`); D34 replaced that.

### D14. Draft mode only with the preview secret; edit attributes only in preview
**Decision.** `proxy.ts` forwards `x-preview: 1` only when `cf_preview` equals `CONTENTFUL_PREVIEW_SECRET` (constant-time compare; any value accepted in
development) and drops any `x-preview` a client sends; drafts are read only for such requests (`isPreviewRequest()`); `$` is empty otherwise; the SDK loads only in preview. The live site reads published content with the **Delivery** token.
**Why.** `?cf_preview=1` must not reveal unpublished content, and production HTML should carry no editing markup. Contentful's content preview
URL cannot be signed per request, so a shared secret in the URL (visible only to space editors) is the gate.

## Catalog

### D15. A category lists its subcategories' products
**Decision.** Category pages use faceted search by `categoryEntityId` rather than `category.products`.
**Why.** Products are assigned to subcategories; the category's own list is empty, which made category pages blank.

### D16. Facets chosen by coverage, capped at 8 values
**Decision.** Brand plus Technology (93% of products), Voltage (89%), Warranty (66%); every facet shows ≤ 8 values and keeps
selected ones visible. Capacity range (54%) and Format (26%) were rejected.
**Why.** A filter that applies to a minority of products misleads. Long value lists (25 technologies) are noise.

### D17. The listing is a GET form that navigates on change
**Decision.** Filters are an HTML `<form method="get">`; JavaScript intercepts changes and calls `router.push` with
`{ scroll: false }`.
**Why.** Every state is a shareable, crawlable URL; it works without JavaScript; there is no client-side filter state to
keep in sync with the server. Chips and clear-all are plain links.
**Details.** Checkbox `key`s include their selected state and the search/price inputs reconcile with the URL, so removing a
chip resets the controls.

### D18. Search starts at 3 characters
**Decision.** Search-as-you-type is debounced (350 ms) and ignores 1–2 characters (with a hint).
**Why.** One or two characters match too broadly and cause needless requests.

## Cart

### D19. Cart state in BigCommerce; hosted checkout
**Decision.** The browser stores only the cart ID in an httpOnly cookie; checkout uses BigCommerce's hosted checkout URL.
**Why.** No payment or PII handling in this app; carts are shared with BigCommerce tooling and persist across devices only
via the cookie (guest carts).

### D20. Optimistic quantity editing
**Decision.** Update totals immediately, save after 500 ms, reconcile with `router.refresh()`. The optimistic subtotal stays on screen
until fresh server data has arrived (a `synced` flag in `CartView`).
**Why.** Quantity buttons feel instant; a failed save shows an error and the next refresh restores the server's numbers. Falling back
to the props as soon as the save ended showed the previous subtotal for a moment (new, old, new), so the flag keeps the optimistic
total until the refreshed props arrive.

## Design

### D21. "Workbench": light, photographic, one accent
**Decision.** Cool steel and ink with terminal amber; Archivo + IBM Plex Sans; open product tiles; 1100 px pages.
**Why.** Fits a trade supplier (practical, legible, photography-led) and avoids the usual generated-site defaults. See
[design-system.md](design-system.md).
**Rejected.** Dark theme; cream with a warm accent; boxed shadowed cards.

### D22. Photography policy
**Decision.** Use only text-free photos from pilesbatteries.com (with the owner's permission); never bake titles into images;
guide heroes use photography, not composed product shots.
**Why.** Titles in images cannot be translated, edited or read by screen readers. Product images come from BigCommerce.

### D23. Amber is never body or heading text on white
**Decision.** Amber is for fills, underlines and rules.
**Why.** Amber on white measures 2.3:1, which fails WCAG. (Step numbers were changed from deep amber to ink after a contrast check.)

## Process

### D24. Idempotent Python seeders instead of manual entry
**Decision.** All sample content is generated from data files and pushed through the Management API.
**Why.** Reproducible, reviewable and re-runnable: schema, English, translations and images can be refreshed together.
**Consequence.** Each entry is written whole (a `PUT` replaces its fields), so manual edits to seeded entries are overwritten on the next run, unless nothing in the seed changed.

### D25. Assets and entries have fixed ids
**Decision.** Every asset and entry has an id derived from its file name or slug, and unchanged entries are skipped.
**Why.** Re-running the seed must not create duplicates. To change an image, replace the asset in Contentful or use a new file name.

### D26. All sample content is fictional
**Decision.** Authors, article text, FAQ policies, delivery claims and contact details are placeholders (`example.com`).
**Why.** Nothing in the site should be mistaken for real policy or real people. Replace before launch.

### D27. No approval gate (yet)
**Decision.** Editors review with Live Preview and then publish; there is no workflow stage or publishing rule.
**Why.** The ContentStack version enforced Draft, In review and Approved with a publishing rule. Contentful workflows are a paid feature and the base port keeps publishing simple.
**Later.** Configure a Contentful workflow (stages and who may publish) if review is required.

### D28. Staging is public and rebuilt by an empty commit
**Decision.** Vercel Authentication is off, and a GitHub Action rebuilds `staging` from `main` with an empty commit on every push.
**Why.** The Live Preview frame and reviewers need to open the URL without a Vercel login. Vercel skips a branch whose tip it already
built, so the empty commit forces a fresh deployment.

### D29. Free plan: adding a locale was refused until capacity was freed
**Decision.** Create the locales in `schemas.py` (rename the default `en-US` to `en`, add `fr` falling back to `en`) and stop on an error.
**Why.** The first attempt to add `fr` returned `403 AccessDenied` although the token was a space admin: the plan's capacity was used up (the API does not say
which limit). It worked after the user deleted an unused `staging` space.
**Consequence.** Check plan capacity before modelling; do not work around a refusal.

### D30. French is edited through the storefront's language switcher
**Decision.** Content preview URLs use `{locale}`, but on the Free plan the editor always passes `en`, because switching the preview locale is a
**Premium-plan** feature ("Switching locales in live preview is a Premium plan exclusive"). Editors open Live Preview on the entry and use the site's own EN / FR switcher inside the preview.
**Why.** The French page then renders with French draft content, and the edit tags carry `data-contentful-locale`, so clicking an element focuses the French field.
**Consequence.** The "editor opens the French page" goal is met by one extra click on the Free plan, and fully with a Premium plan.

### D31. Unsaved edits through a server overlay; added blocks and replaced media after save
**Decision.** `enableLiveUpdates` is `true` (the SDK delivers the edit and save events only then). While the editor types, the SDK
answers the page's subscription with the entries' unsaved values. `providers/cms/contentful/live-preview.tsx` finds the entries tagged on the page, gets their saved values from the server action
`previewBaseline`, compares the editor's answers with them and sends the changed fields to `updatePreviewOverlay`
(`providers/cms/contentful/actions.ts`). The action stores them in server memory for five minutes (`setOverlay` in `client.ts`) and calls `refresh()` (Next 16), which re-renders the open page
**in the same response**. Covered: text and long text, dates, numbers, booleans, lists of strings, rich text documents and links to
entries or media that the page already has. That includes **reordering or removing blocks** in a `page.components` list (or a post's
`content`): the overlay holds the new list of links and the server re-resolves it from the entries it already fetched. Not covered: a
block **added** in the editor, or media replaced by another one (their content has not been fetched); they appear after the entry is
saved, which also clears the overlay and the draft cache. Reordering showed only after a save at first (found in the real editor); the
page component list therefore carries the page's edit attributes (a `contents` wrapper in `components/page-content.tsx`) so the
page entry is subscribed.
**Why.** Contentful's live updates patch **client-side data** (`useContentfulLiveUpdates`), and these pages are server-rendered with
the mapped model. An overlay keeps the page components unchanged.
**Speed.** First version: a server action then a separate `router.refresh()` (two round trips per change, and Next runs server actions
one at a time), which made changes queue up on Staging. Now: one round trip (`refresh()` inside the action); one request in flight,
newer edits replace older ones per entry and a 120 ms debounce turns typing bursts into one request; and draft responses are cached
for five seconds per instance so a re-render does not call the Preview API again (emptied on save). Measured with a simulated editor
on a local server: about 0.2 s per change for every supported type, and 12 rapid edits settle 0.2 s after the last one.
**Guards.** The action requires the same `cf_preview` secret as the page, accepts only the listed value types (id, locale and field
names are pattern-checked, 200 KB per value, 100 entries per call), a malformed rich text document renders as empty, and the overlay
is only read for draft requests, so the published site never shows it.
**Trade-offs.** The overlay and the draft cache live in the memory of one server instance: on Vercel a render that lands on another
instance misses the latest edit, and the next autosave catches up. The draft cache means a change made outside this editor session shows
up within five seconds.

### D32. The Live Preview SDK is guarded
**Decision.** `ContentfulLivePreview.init` runs in `try/catch`, with `targetOrigin` set to the Contentful web app hosts (plus the framing page's origin in development).
**Why.** The SDK throws "The current origin is not supported" when the parent is not a Contentful origin; unguarded, that replaced the page with the error screen.

### D33. SKU-to-variant selection is deferred
**Decision.** `recommendedSkus` (and `bcSku`) stay an optional display fallback; guides link to the product page by product id.
**Why.** The catalog has 150 products and **none has options or more than one variant**, so a SKU is always the product's SKU, and the product page has no
option or variant picker (add to cart works on the product id). Variant selection means building that UI and adding a multi-variant product.
**Later.** Resolve a SKU to a variant (image, price, SKU), link with the variant preselected, and port the change to the other CMS versions.

### D34. Pages and posts are ordered lists of blocks; the old fields were pruned
**Decision.** A `page` has `components` (ordered links to `heroBanner`, `featureBlock`, `textBlock`, `imageBlock`, `videoBlock`, `collectionBlock`) and a
`blogPost` has `content` (text, image, video blocks), so editors can reorder what a page or post shows. Every list-like section is one
`collectionBlock` whose `kind` (categories, spotlights, guides, posts, postListing, guideListing, faqs) says what it shows. The fixed fields they replace
(`page.hero`, `page.image`, `page.intro`, `page.blocks`, `blogPost.body`, `heroBanner.fullWidth`) and the `blogListingPage` type were removed.
**Why.** Amplience editors already compose pages this way; the user wanted the same reordering in every CMS (the block model, "Option 2"). One generic
collection type keeps the model at 18 content types, under the Free plan's 25 (a type per section would have needed 27).
**How.** Added the types and fields additively (the live site kept working), ported this repository's code to the block model (a single-CMS
build of `content-commerce-b2b`: same `core/`, components and Contentful provider, no switcher and no other CMS) and deployed it, took a backup
(19 content types, 174 entries, 62 assets), reseeded in the final model, then ran `schemas.py --prune` (fields omitted, then removed; the listing type and its entry deleted).
**Check.** Rendered next to the Amplience provider of `content-commerce-b2b`: the text of all 9 page and language combinations is identical, and the pixel
difference is 0.0% on 8 of 9 (the blog index differed by 3.8% because four lazy-loaded thumbnails had not loaded at screenshot time).
**Trade-off.** The code exists in two repositories (this one and the private switchable one); changes to the shared UI must be ported.

### D35. Commits must be authored with an email linked to the GitHub account
**Decision.** In a private repository, commits use the account's GitHub no-reply address (`<id>+<login>@users.noreply.github.com`, set with `git config` in the repo).
**Why.** Vercel **blocked** a production deployment ("couldn't find a Git account for the commit author") for a commit authored with a work email that was not linked to the GitHub account; a commit with the no-reply address deployed.

## Open questions

- Will buyers **sign in** (B2B Edition companies, price lists, quotes)? Today "your negotiated prices" is aspirational copy.
- Should attribute filters survive a language switch (their values are translated, so they are dropped today)?
- Should the category tiles' photos and labels move into Contentful? (The `categories` block exists and sets its position and title; the tiles themselves come from the BigCommerce category tree and static photos.)
- A **publish webhook** to revalidate the `contentful` cache tag, and an approval workflow.
