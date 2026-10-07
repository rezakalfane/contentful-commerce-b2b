# Documentation

| Document | Read it when you want to… |
|---|---|
| [architecture.md](architecture.md) | understand how Contentful, BigCommerce and Next.js fit together, and how a request is served |
| [implementation.md](implementation.md) | see how each feature works (listing, filters, product page, cart, hero, guides…) and where the code lives |
| [contentful.md](contentful.md) | work with the space: tokens, the content model, locales and URLs, reading and publishing |
| [visual-editor.md](visual-editor.md) | set up and debug Live Preview: preview secret, inspector mode, languages, content preview platforms |
| [bigcommerce.md](bigcommerce.md) | work with the catalog: channel, token, the GraphQL queries, facets, categories, cart |
| [i18n.md](i18n.md) | add a language or translate content: URL strategy, fallback, dictionaries, hreflang |
| [seeding.md](seeding.md) | model the space and create or refresh sample content with the Python scripts |
| [design-system.md](design-system.md) | build UI in the "Workbench" look: tokens, type, components, imagery |
| [operations.md](operations.md) | set up environment variables, run, deploy and troubleshoot |
| [decisions.md](decisions.md) | learn why choices were made, and what was rejected |

Also see the top-level [README](../README.md) and [HISTORY](../HISTORY.md) (every request and its outcome).

## Vocabulary

- **Entry**: one piece of Contentful content (an article, an FAQ, a page). **Content type**: its schema (fields and validations). A **reusable piece**
  (hero banner, guide step, nav link…) is an entry of its own, linked from the entry that uses it.
- **Locale**: a translation. Contentful codes are `en` (default) and `fr`; URL prefixes are `en` (hidden) and `fr`. Localization is **field-level**:
  `fields.title.en` and `fields.title.fr` in the same entry, and `fr` falls back to `en`.
- **Slug**: the unique, unlocalized field that gives an entry its URL (`/blog/<slug>`).
- **CDA / CPA / CMA**: the Content *Delivery* API (published, read), the Content *Preview* API (drafts, read) and the Content *Management* API (write).
- **Draft / published**: the two states of an entry. The **Delivery** token reads published; the **Preview** token reads both.
- **Live Preview**: Contentful's in-page editing. **Inspector mode** outlines the tagged elements; the **edit attributes** are the
  `data-contentful-*` attributes that make them clickable. The **preview secret** is the `cf_preview` value that unlocks drafts.
- **Staging**: the Vercel site built from the `staging` branch ([operations.md](operations.md)).
- **PLP / PDP**: product listing page / product detail page.
