# History

A chronological record of every request made while building the Contentful version of this storefront, and what came out of it.
Prompts are quoted or condensed from the conversation. Dates are 2026.

> The storefront started as a copy of the Storyblok version (`storyblok-commerce-b2b`), itself derived from the ContentStack and
> Amplience ones; the history of those builds lives in their own repositories. **Result** is a summary of what was actually delivered.
> Things that were investigated and rejected, or that turned out different from the first attempt, are called out because they
> explain later decisions.

---

## 7 October

### Start: a Contentful version of the storefront
**Prompt:** Create a Contentful version of the Commerce B2B storefront, the same way as Amplience, ContentStack and Storyblok: same UI (pages, images, components), BigCommerce for catalog and cart, Contentful as the CMS with English and French content. Copy `../Storyblok/storefront` without `node_modules`, `.next`, `.git`, `.vercel` or its `.env.local`, remove the Storyblok code once the Contentful data layer replaces it. Tokens only in `.env.local`, never printed. Step by step with a check-in at each boundary; no outward-facing action (public repo, pushes, deployments) without a go-ahead.

**Result:** Copied the base and worked through the `cms-storefront-port` playbook with the `contentful` skill, in six steps (below).

### 1. Confirm the space
**Result:** US data region (the `CONTENTFUL_REGION` value had been filled with `en`; corrected to `us`), `master` environment, tokens for the Management, Delivery and Preview APIs all valid, empty space, one locale. Free plan limits (25 content types, 10,000 records, 2 locales). Preview options on this plan: content preview URLs plus the Live Preview SDK with inspector mode; no visual editor product available. Decision: French locale code `fr` (not `fr-FR`), default renamed `en-US` to `en`.

### Adding French was refused
**Prompt:** (after the default rename) adding the locale failed.

**Result:** `POST /locales` returned `403 AccessDenied` although the token was a space admin. Not worked around: the user freed capacity in the organisation (deleted an unused space), then the same script succeeded. Recorded as a plan-limit symptom: a Forbidden on locale creation is not a role problem.

### 2. Model and seed
**Result:** 15 content types (`heroBanner`, `featureBlock`, `guideStep`, `useCase`, `navLink`, `footerColumn`, `page`, `blogListingPage`, `author`, `blogPost`, `faq`, `buyingGuide`, `productSpotlight`, `announcementBar`, `siteNavigation`). Contentful has no inline blocks, so the reusable pieces are separate entries linked from their page. Localization is per field; enums are Symbol fields with a validation list; lists of strings are Array of Symbol. Idempotent scripts in `scripts/seed/` (`cf.py`, `schemas.py`, `seed.py`, `verify.py`) with fixed entry and asset ids; a second run writes nothing. Loaded 6 authors, 15 FAQs, 36 posts, 1 blog listing, 6 guides, 6 spotlights, 2 announcements, 1 navigation, 3 pages, 4 heroes, 3 feature blocks and 62 images in English and French. `verify.py` checks the counts and both languages through the Delivery API (published) and the Preview API (drafts). Rich text validations must be separate objects (marks and node types in one object fail as "ambiguous").

### What is the difference between recommended product IDs and SKUs?
**Prompt (with a screenshot):** whats the difference between these 2? Can the SKUs be optional, and why not used to select a specific variant?

**Result:** Both identify the same products: the ID is BigCommerce's key for the lookup, the SKU is a display fallback, and the SKU field is already optional. Selecting a variant is not possible today: all 150 catalog products have a single variant and no options, and the product page has no option picker. Deferred by the user; recorded in `docs/decisions.md`.

### 3. Connect the storefront
**Result:** New data layer `lib/contentful.ts`, `lib/blog.ts`, `lib/site.ts` (Delivery API with the delivery token for published content, Preview API with the preview token for drafts; links resolved in place; React `cache()`; published reads revalidate every 60 s, drafts are never cached). The Storyblok code and packages are removed; the CSP and image hosts point at Contentful. Drafts are served only with `?cf_preview=<CONTENTFUL_PREVIEW_SECRET>` (timing-safe comparison; any value accepted in development). Verified with an unpublished FAQ: absent without the flag and with a wrong secret, present with the right one, in a production build. `tsc`, `eslint`, `next build` and `urltest.py` (26/26) pass.

### 4. Live Preview
**Prompt:** Live preview with French working (the editor must open the French page), tested as far as possible without the user's login.

**Result:** Content preview URLs created by `scripts/seed/editor.py` (one per content type, with `{locale}` and `{entry_field.slug}`, carrying the secret); the Live Preview SDK in `components/live-preview.tsx` with inspector mode; entries are tagged with `data-contentful-entry-id`, `-field-id` and `-locale` in preview only. A cross-origin iframe test hydrates the French guide with 26 tagged elements. Found on the way: the SDK throws when the parent origin is not Contentful (the page crashed into the error screen), so initialisation is guarded and the framing origin is allowed in development only.

### The editor stays on the English page; the edit does not show
**Prompt (with screenshots):** the real editor: inspector works; opening a French field still shows English; an edit ("xxx") did not appear.

**Result:** Two causes. (1) Switching locale in Live Preview is a Premium-plan feature, so `{locale}` is always `en` in the editor on the Free plan; accepted: French is previewed with the storefront's own EN/FR switcher inside the preview (the tags carry `data-contentful-locale`, so French fields focus correctly). (2) `enableLiveUpdates` was off and the SDK only delivers the `save` event when it is on, so the refresh never ran; fixed. Per-keystroke updates (an overlay of unsaved values on the server) were offered and not built; the preview refreshes after autosave.

### SKU to variant
**Prompt:** Let's do that [variant selection]. If it works we can update the other implementations.

**Result:** Checked first: no product has variants or options and the storefront has no option picker, so the feature would need a variant UI on the product page and a multi-variant demo product. The user chose to defer it.

### 5. Documentation
**Prompt:** Step 5. (Contentful documentation pages and editor screenshots supplied.)

**Result:** README and the docs set rewritten for Contentful (`contentful.md`, `visual-editor.md`, architecture, i18n, implementation, operations, seeding, decisions); Storyblok screenshots removed; four editor screenshots added with the browser tabs and address bar cropped out (they showed the space id and unrelated tabs); this history restarted for the Contentful build. The `contentful` skill and the `cms-storefront-port` notes were updated with everything that differed from the starter.

### 6. GitHub and Vercel
**Prompt:** Let's go! (after being asked to confirm the public repo and the Vercel project.)

**Result:** Scanned the tree for every `.env.local` value (0 hits), created the public repo `rezakalfane/contentful-commerce-b2b` with `main` and `staging` (the sync workflow keeps `staging` equal to `main`), linked the Vercel project, set the variables per scope from `.env.local` without printing them (tokens and the preview secret as sensitive; the management token is not on Vercel), made previews public and connected Git. Production https://contentful-commerce-b2b.vercel.app and staging https://contentful-commerce-b2b-git-staging-rza-kalfanes-projects.vercel.app both build and pass `urltest.py` 26/26; on production a bare or wrong `cf_preview` shows no edit tags and the right secret does. The Production and Staging content preview platforms were then added in Contentful with `editor.py`. `vercel link` appended `VERCEL_OIDC_TOKEN` to `.env.local` (gitignored).

### Cart subtotal updated several times
**Prompt:** When adding to cart, the subtotal is updated multiple times. If you can fix it, port it to ContentStack, Amplience and Storyblok.

**Result:** Reproduced in a headless browser by recording the subtotal text: one click on "+" gave £396.80, then the old £198.40, then £396.80 again. While saving, the cart showed the optimistic total; when the save ended it fell back to the server subtotal from the props, which is still the previous one until the refresh lands. `cart-view.tsx` now keeps the optimistic total until fresh server data has arrived (a `synced` flag reset on every change, set again when the props update with nothing pending). After the fix one click shows one update and three quick clicks climb steadily (£396.80, £595.20, £793.60). The identical file was copied into the Storyblok, ContentStack and Amplience storefronts (they were byte-identical to the old version; `tsc` and `eslint` pass); left uncommitted there for review.

### Faster preview: unsaved text as it is typed
**Prompt:** Can the updates on the form be displayed faster on the preview? (Then: build the unsaved-text overlay for plain-text fields.)

**Result:** Measured first: a draft page render on production takes about 0.5 s (mostly the Preview API), so the remaining delay was Contentful's autosave. Built the overlay: the page's draft entries are registered while links are resolved; `components/live-preview.tsx` subscribes to their edits, compares the editor's unsaved values with the values the page opened with and sends the changed plain-text fields to the server action `updatePreviewOverlay` (guarded by the preview secret and input checks); `lib/contentful.ts` keeps them in memory for five minutes and applies them to draft reads only; the page re-renders with them, and the save event clears them. Tested with a simulated editor (a parent page answering the SDK's subscription): about 0.5 s to show the edit, both a whole-tree answer and a single locale-keyed entry are understood, reverting restores the saved text, and the published page never shows an overlay. Not tested in the real editor (its exact answer shape is unknown). Also added the content model, content list, media and Live Preview screenshots supplied by the user (tabs and address bar cropped).

### Preview felt slow on Staging and changes arrived one by one
**Prompt (with a screenshot):** looks a bit slow on Staging, also changes are stacked and appear slowly one by one, even if I did change something in between. Can we apply this to other field types (textareas, dates, etc.)?

**Result:** The screenshot showed the real editor working with the overlay but lagging (an extra full stop in the preview that was already deleted in the form). Cause: each change cost two sequential round trips (a server action, then a separate `router.refresh()`), Next runs server actions one at a time, and every render called the Preview API again, so edits queued. Fixed: the action now calls Next 16's `refresh()` so the page re-renders in the same response; one request in flight with newer edits replacing older ones per entry and a 120 ms debounce; draft responses cached for five seconds per instance (emptied on save). Field types: text, long text and dates were already covered (they are strings); added numbers, booleans, lists of strings and rich text documents. Links to entries and media are not covered (their targets would need fetching). Measured with a simulated editor locally: about 0.2 s per change for each type and 0.2 s after the last of 12 rapid edits.

### Block-composed pages for every CMS: the model decision
**Prompt:** Evaluate a single project where the CMS can be switched at runtime (`content-commerce-b2b`); then: re-ordering components works great for Pages and Blog in Amplience, can we have the same for the others, so Option 2?

**Result:** Decided on **Option 2**: pages and posts are ordered lists of blocks in every CMS, with Amplience's block model as the reference, instead of mapping Amplience's blocks into fixed page layouts. For Contentful that meant new block content types (`textBlock`, `imageBlock`, `videoBlock` and one generic `collectionBlock` whose `kind` picks categories, spotlights, guides, posts, postListing, guideListing or faqs; a type per section would have needed 27 content types against the Free plan's 25), `page.components` and `blogPost.content`, and `variant` / `secondImage` on the hero.

### Adding the block model additively
**Prompt:** Yes, start P3b; we will have to update the contentful-commerce-b2b project as well.

**Result:** The types and fields were added to the shared space without removing anything, so this site kept working on the old fields. The block entries were seeded in English and French (home 8 components, FAQ 2, guides 2, a new blog page 3, a text block per post) and compared with the Amplience provider of `content-commerce-b2b`: the visible text is identical on all 9 page and language combinations and the pixel difference is 0.0% on 8 of them (the blog index differed by 3.8% because four lazy-loaded thumbnails had not loaded at screenshot time). Two data differences surfaced and were fixed in the seed: post descriptions are shortened at a word boundary, and announcements keep the content's order.

### Porting the block code into this repository
**Prompt:** Port the block code into it (chosen over reading the new model into the fixed layout, or retiring the repository).

**Result:** This repository now holds a single-CMS build of `content-commerce-b2b`: `core/content.ts` (the model), `lib/content.ts` (facade), `providers/cms/contentful/` (client, mapper, provider, server actions, Live Preview), the block views in `components/page-blocks.tsx`, a page catch-all `app/[locale]/[...slug]`, and `proxy.ts` (locale routing, `/home` rewrite, a verified `x-preview` header from the `cf_preview` secret, per-request `frame-ancestors`). The switcher, the Amplience provider, time travel and the image loader were left out; the translated catalog root is rewritten onto `/products` by the proxy. Deployed to production and staging, which passed the 26 URL checks; the pages are text-identical to the new project. The seeding scripts moved from `scripts/seed` to `tools/contentful`, and the Live Preview platforms were updated for the new block types (`storefront-*`, named *Contentful site: ...*).

### Dropping the old fields
**Prompt:** Let's update contentful-commerce-b2b and drop old fields.

**Result:** Once the live site no longer read them: a backup of the space (19 content types, 174 entries, 62 assets, in `.backups/`, gitignored), the seed was changed to create the block model directly and rerun for posts and pages, then `schemas.py --prune` removed `page.hero`, `page.image`, `page.intro`, `page.blocks`, `blogPost.body` and `heroBanner.fullWidth` (fields are omitted first, then removed) and deleted the `blogListingPage` type with its entry. The space has 18 content types; `verify.py` reports 0 failures (37 text blocks, 7 collection blocks, 4 pages) and the `body` fallback in the mapper was removed. Documentation was rewritten for the block model; `cf-content-model`, `cf-content-list`, `cf-entry-editor`, `cf-live-preview-home` and `cf-live-preview-en` predate it and are listed under "Screenshots to refresh" in `docs/visual-editor.md`.

### A production deployment was blocked
**Prompt:** Be sure to use my rezakalfane account for GitHub (while deploying `content-commerce-b2b`).

**Result:** `gh` was already on `rezakalfane` and the repository belongs to it, but Vercel **blocked** the production deployment: "couldn't find a Git account for the commit author", because the commits carried a work email that is not linked to the GitHub account (the new repository is private). Setting the repository's `user.email` to the account's GitHub no-reply address (`<id>+rezakalfane@users.noreply.github.com`, repo-local `git config`) and pushing a new commit fixed it; this repository's commits use the same address.

