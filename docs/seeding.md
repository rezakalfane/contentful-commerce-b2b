# Seeding sample content

The Python scripts in `tools/contentful/` create and refresh the whole Contentful space through the **Management API**: the locales, the content
model, 62 assets and the entries in English and French, all published. They are **idempotent**: assets and entries have fixed ids derived from
their content, and an entry that has not changed is not rewritten, so they are safe to re-run.

## Prerequisites

- Python 3.12+ with Pillow (`pip install pillow`).
- `.env.local` at the repository root containing `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENVIRONMENT`, `CONTENTFUL_REGION` (`us` or `eu`) and
  `CONTENTFUL_MANAGEMENT_TOKEN` (a personal access token), plus `CONTENTFUL_DELIVERY_TOKEN` and `CONTENTFUL_PREVIEW_TOKEN` for `verify.py`,
  `CONTENTFUL_PREVIEW_SECRET` for `editor.py`, and `BIGCOMMERCE_STORE_HASH`, `BIGCOMMERCE_CHANNEL_ID` and `BIGCOMMERCE_STOREFRONT_TOKEN`
  (the spotlights use real product photos downloaded from BigCommerce).

Credentials are read from `.env.local` and never printed (error output is redacted).

## Run order

```bash
python3 tools/contentful/schemas.py      # 1. locales (default en, plus fr) and the 18 content types
python3 tools/contentful/seed.py         # 2. assets and entries in English and French, published
python3 tools/contentful/verify.py       # 3. counts and French content through the Delivery and Preview APIs
python3 tools/contentful/editor.py       # 4. content preview platforms (Live Preview URLs)
python3 tools/contentful/backup.py       # any time: save the whole space to .backups/ (gitignored)
```

`seed.py --only authors,faqs,posts,guides,spotlights,settings,pages` loads a subset. Authors and FAQs are always (re)loaded when a later
section needs them (posts and guides link to them).

> **Both locales are written together.** Each entry is saved once with its English and French values (`{"en": ..., "fr": ...}` per localized
> field), so there is no separate "localize" step. The French text lives in the `*_fr.py` data files, in the same order and shape as the English data.

## What `seed.py` does, in order

1. Authors (a generated avatar each) and FAQs.
2. 36 blog posts. Each post's text is a `textBlock` entry that the post links in its `content`, and the post gets a `readTime`. A post's
   `relatedPost` points to an **earlier** post, which is already published (a published entry can only link to published entries).
3. 6 buying guides (their steps are separate `guideStep` entries), 6 product spotlights (their use cases are `useCase` entries; the editorial
   image is the BigCommerce product photo composed on a branded card).
4. Announcement bars and the navigation (links and footer columns are entries).
5. The pages, each an ordered `components` list: `home` (hero with its second photo, intro text block, category tiles, three feature blocks,
   trade-favourites and guides collections), `faq` (hero, FAQ collection), `guides` (hero, guide listing) and `blog` (hero, latest articles, post
   listing).

## Changing the model

`schemas.py` declares the **final** model. By default it never removes anything: fields and types that are no longer in the model are kept and
listed ("keeping [...]"). `schemas.py --prune` removes them in two phases, because Contentful deletes a field only after it was *omitted*:
fields are first published as omitted, then removed (their values leave the entries); content types that are no longer in the model are
deleted together with their entries. Take a backup first (`backup.py` writes every content type, entry and asset as JSON to `.backups/`,
gitignored: never commit it). The block model was introduced this way: types and fields added, content reseeded in the new shape, the sites
switched to read it, then `--prune` ran ([decisions.md](decisions.md), D34).

## Files

| File | Role |
|---|---|
| `cf.py` | Management API helper: requests (paced, retry on `429`, tokens redacted), content type and entry upsert, asset upload, rich-text builder |
| `schemas.py` | field builders and the 18 content type definitions; renames the default locale to `en` and adds `fr`; `--prune` removes what the model no longer has |
| `seed.py` | loads everything (see above) |
| `verify.py` | checks counts and English and French content on the Delivery (published) and Preview (draft) APIs; exit code 1 on a mismatch |
| `backup.py` | saves content types, entries, assets and locales to `.backups/` before a destructive change |
| `editor.py` | content preview platforms and URL templates (`PREVIEW_PREFIX`, `PREVIEW_LABEL`, `PREVIEW_PRODUCTION`, `PREVIEW_STAGING`) |
| `images.py` | gradients, avatars, composed product cards, product photos from BigCommerce |
| `content.py` | English authors and the 36 posts (title, intro, two sections, takeaways) |
| `content_extra.py` | FAQs, product keys (`P`), guides, spotlights, announcements, home page, navigation |
| `content_fr.py`, `content_fr_posts.py` | French translations, in the same order and shape as the English data |
| `photos.py`, `photos/*.jpg` | the nine text-free photos and a cropper that produces varied crops |

## What `verify.py` expects

Entries: 6 `author`, 15 `faq`, 36 `blogPost`, 6 `buyingGuide`, 6 `productSpotlight`, 2 `announcementBar`, 1 `siteNavigation`, 4 `page`, 4 `heroBanner`,
3 `featureBlock`, 37 `textBlock` (36 post texts and the home intro), 7 `collectionBlock`; 62 assets; locales `en` and `fr`. It also checks that a post
and the home page return content in both languages (a post has `content` blocks, the home page has `components`), and that the French title differs
from the English one.

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
- A field is removed only after it is omitted, and a content type only after its entries are gone: use `schemas.py --prune`, not a plain `PUT`.
- Re-running `seed.py` rewrites whole entries, so any field it does not set is cleared: the seed must create everything the model needs (it does).
- On a 429 the helper waits and retries; a full run takes a few minutes, a re-run seconds.

## Adding content from the app instead

Open **Content → Add entry**, pick the content type, fill the English fields, switch to French and translate the localized fields, then publish
(the linked pieces first).
