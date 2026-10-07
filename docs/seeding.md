# Seeding sample content

The Python scripts in `scripts/seed/` create and refresh the whole Contentful space through the **Management API**: the locales, the content
model, 62 assets and the entries in English and French, all published. They are **idempotent**: assets and entries have fixed ids derived from
their content, and an entry that has not changed is not rewritten, so they are safe to re-run.

## Prerequisites

- Python 3.12+ with Pillow (`pip install pillow`).
- `storefront/.env.local` containing `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENVIRONMENT`, `CONTENTFUL_REGION` (`us` or `eu`) and
  `CONTENTFUL_MANAGEMENT_TOKEN` (a personal access token), plus `CONTENTFUL_DELIVERY_TOKEN` and `CONTENTFUL_PREVIEW_TOKEN` for `verify.py`,
  `CONTENTFUL_PREVIEW_SECRET` for `editor.py`, and `BIGCOMMERCE_STORE_HASH`, `BIGCOMMERCE_CHANNEL_ID` and `BIGCOMMERCE_STOREFRONT_TOKEN`
  (the spotlights use real product photos downloaded from BigCommerce).

Credentials are read from `.env.local` and never printed (error output is redacted).

## Run order

```bash
cd storefront
python3 scripts/seed/schemas.py      # 1. locales (default en, plus fr) and the 15 content types
python3 scripts/seed/seed.py         # 2. assets and entries in English and French, published
python3 scripts/seed/verify.py       # 3. counts and French content through the Delivery and Preview APIs
python3 scripts/seed/editor.py       # 4. content preview platforms (Live Preview URLs)
```

`seed.py --only authors,faqs,posts,guides,spotlights,settings,pages` loads a subset. Authors and FAQs are always (re)loaded when a later
section needs them (posts and guides link to them).

> **Both locales are written together.** Each entry is saved once with its English and French values (`{"en": ..., "fr": ...}` per localized
> field), so there is no separate "localize" step. The French text lives in the `*_fr.py` data files, in the same order and shape as the English data.

## What `seed.py` does, in order

1. Authors (a generated avatar each) and FAQs.
2. 36 blog posts. A post's `relatedPost` points to an **earlier** post, which is already published (a published entry can only link to
   published entries). Then the blog listing.
3. 6 buying guides (their steps are separate `guideStep` entries), 6 product spotlights (their use cases are `useCase` entries; the editorial
   image is the BigCommerce product photo composed on a branded card).
4. Announcement bars and the navigation (links and footer columns are entries).
5. The pages: `home` (hero and three feature blocks), `faq` and `guides`.

## Files

| File | Role |
|---|---|
| `cf.py` | Management API helper: requests (paced, retry on `429`, tokens redacted), content type and entry upsert, asset upload, rich-text builder |
| `schemas.py` | field builders and the 15 content type definitions; renames the default locale to `en` and adds `fr` |
| `seed.py` | loads everything (see above) |
| `verify.py` | checks counts and English and French content on the Delivery (published) and Preview (draft) APIs; exit code 1 on a mismatch |
| `editor.py` | content preview platforms and URL templates |
| `images.py` | gradients, avatars, composed product cards, product photos from BigCommerce |
| `content.py` | English authors and the 36 posts (title, intro, two sections, takeaways) |
| `content_extra.py` | FAQs, product keys (`P`), guides, spotlights, announcements, home page, navigation |
| `content_fr.py`, `content_fr_posts.py` | French translations, in the same order and shape as the English data |
| `photos.py`, `photos/*.jpg` | the nine text-free photos and a cropper that produces varied crops |

## What `verify.py` expects

Entries: 6 `author`, 15 `faq`, 36 `blogPost`, 1 `blogListingPage`, 6 `buyingGuide`, 6 `productSpotlight`, 2 `announcementBar`, 1 `siteNavigation`,
3 `page`, 4 `heroBanner`, 3 `featureBlock`; 62 assets; locales `en` and `fr`. It also checks that a post and the home page return content in
both languages, and that the French title differs from the English one.

## How the pieces work

### Assets (`cf.upload_asset`)
Contentful uploads in four steps: the file is posted to `upload.contentful.com` (an upload resource), an asset with a fixed id is created with
`uploadFrom` pointing at it, the asset is **processed** (`PUT .../files/en/process`; the script polls until the file has a URL), then it is
**published**. The asset id derives from the file name, so re-running reuses the asset. To replace an image, delete the asset (or change the
file name) and re-run. The French locale falls back to the English file.

### Entries (`cf.upsert_entry`)
Reads the entry by its fixed id. Unchanged and published: skipped. Otherwise `PUT`s the **whole** `fields` object with the current
`X-Contentful-Version`, then publishes. Content types follow the same pattern (`PUT`, then publish).

### Localized values (`loc()` in `cf.py`)
`loc("English", "Français")` gives `{"en": "English", "fr": "Français"}`. Unlocalized fields use `{"en": value}` only.

### Rich text (`cf.richtext`)
Builds Contentful's JSON document (`paragraph`, `heading-2`, `unordered-list`, `hyperlink`) from `("p", text)`, `("h2", text)`, `("ul", [items])`.
`html_paragraphs()` converts the simple `<p>…<a href>…</a></p>` strings used for the home page.

## Pitfalls

- A rich text field's validations must be **separate objects** (`enabledMarks` in one, `enabledNodeTypes` in another); one combined object is
  rejected as ambiguous.
- Adding a locale returned **403** on the Free plan until space capacity was freed ([decisions.md](decisions.md), D29).
- `PUT` replaces `fields`: always send every field and both locales.
- Publish order matters: link targets first, then the entries that link to them.
- On a 429 the helper waits and retries; a full run takes a few minutes, a re-run seconds.

## Adding content from the app instead

Open **Content → Add entry**, pick the content type, fill the English fields, switch to French and translate the localized fields, then publish
(the linked pieces first).
