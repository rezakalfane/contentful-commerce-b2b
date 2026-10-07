import type {
  Announcement, Author, Block, Faq, Guide, Hero, Img, Navigation, Page, Post, PostBlock, Spotlight,
} from "@/core/content";
import type { Tags } from "@/core/edit";
import type { Locale } from "@/lib/i18n";
import { asset, editTags, getEntries, getEntry, html, many, numbers, one, strings, type Entry } from "./client";

// Entries -> the canonical content model (core/content.ts). `$` carries Live Preview attributes for draft requests only.
const img = (a: unknown, alt?: string): Img | undefined => {
  const x = asset(one(a));
  return x ? { url: x.url, alt: alt || x.title || "" } : undefined;
};
const tags = (e: Entry, draft: boolean): { $?: Tags } => (draft ? { $: editTags(e, true) } : {});
const text = (v: unknown) => (typeof v === "string" && v ? v : undefined);

const author = (e: Entry, draft: boolean): Author => ({ name: e.fields.name, avatar: img(e.fields.picture, e.fields.name), bio: text(e.fields.bio), ...tags(e, draft) });

const faq = (e: Entry, draft: boolean): Faq => ({
  id: e.id,
  question: e.fields.question,
  answerHtml: html(e.fields.answer),
  topic: e.fields.topic,
  sortOrder: typeof e.fields.sortOrder === "number" ? e.fields.sortOrder : 0,
  featured: !!e.fields.isFeatured,
  ...tags(e, draft),
});

function guide(e: Entry, order: number, draft: boolean): Guide {
  const f = e.fields;
  const skus = strings(f.recommendedSkus);
  const writer = one(f.author);
  return {
    id: e.id,
    url: `/guides/${f.slug}`,
    title: f.title,
    summary: f.summary,
    image: img(f.heroImage, f.title),
    audience: text(f.audience),
    readMinutes: typeof f.readMinutes === "number" ? f.readMinutes : undefined,
    sortOrder: order,
    steps: many(f.steps).map((s) => ({ title: s.fields.stepTitle, body: s.fields.stepBody, proTip: text(s.fields.proTip), ...tags(s, draft) })),
    checklist: strings(f.checklist),
    recommendedProducts: numbers(f.recommendedBcProducts).map((id, i) => ({ bcProductId: id, sku: skus[i] })),
    relatedFaqs: many(f.relatedFaqs).filter((x) => x.type === "faq").map((x) => faq(x, draft)),
    author: writer ? author(writer, draft) : undefined,
    ...tags(e, draft),
  };
}

const spotlight = (e: Entry, draft: boolean): Spotlight => ({
  id: e.id,
  title: e.fields.title,
  bcProductId: Number(e.fields.bcProductId),
  bcSku: text(e.fields.bcSku),
  tagline: e.fields.tagline,
  badge: text(e.fields.badge),
  image: img(e.fields.editorialImage, e.fields.title),
  featured: !!e.fields.isFeatured,
  keyFeatures: strings(e.fields.keyFeatures),
  useCases: many(e.fields.useCases).map((u) => ({ title: u.fields.useCase, description: text(u.fields.description) })),
  ...tags(e, draft),
});

function postBlock(e: Entry, draft: boolean): PostBlock[] {
  const t = tags(e, draft);
  switch (e.type) {
    case "textBlock":
      return [{ type: "text", html: html(e.fields.text), ...t }];
    case "imageBlock": {
      const i = img(e.fields.image, text(e.fields.alt));
      return i ? [{ type: "image", img: i, ...t }] : [];
    }
    case "videoBlock":
      return [{ type: "video", title: e.fields.videoTitle ?? "", src: e.fields.src, ...t }];
    default:
      return [];
  }
}

function post(e: Entry, draft: boolean): Post {
  const f = e.fields;
  const writer = one(f.author);
  const blocks = many(f.content).flatMap((b) => postBlock(b, draft));
  return {
    id: e.id,
    url: `/blog/${f.slug}`,
    title: f.title,
    description: text(f.seoDescription),
    date: text(f.date),
    readTime: typeof f.readTime === "number" ? f.readTime : undefined,
    image: img(f.featuredImage, f.title),
    authors: writer ? [author(writer, draft)] : [],
    blocks,
    ...tags(e, draft),
  };
}

const hero = (e: Entry, draft: boolean): Hero => ({
  title: e.fields.title,
  description: text(e.fields.description),
  image: img(e.fields.image, e.fields.title),
  secondImage: img(e.fields.secondImage, e.fields.title),
  cta: e.fields.ctaLabel || e.fields.ctaHref ? { label: text(e.fields.ctaLabel), href: text(e.fields.ctaHref) } : undefined,
  variant: e.fields.variant === "home" ? "home" : "default",
  ...tags(e, draft),
});

/** The items of a collection, of one content type (a collection may hold anything an editor links; only the expected type shows). */
const items = (e: Entry, type: string) => many(e.fields.items).filter((x) => x.type === type);

function block(e: Entry, draft: boolean): Block[] {
  const t = tags(e, draft);
  const f = e.fields;
  switch (e.type) {
    case "heroBanner":
      return [{ type: "hero", hero: hero(e, draft), ...t }];
    case "featureBlock":
      return [{ type: "feature", title: f.title, html: html(f.copy), image: img(f.image, f.title), layout: f.layout === "image_right" ? "image_right" : "image_left", ...t }];
    case "textBlock":
      return [{ type: "text", html: html(f.text), ...t }];
    case "imageBlock": {
      const i = img(f.image, text(f.alt));
      return i ? [{ type: "image", img: i, ...t }] : [];
    }
    case "videoBlock":
      return [{ type: "video", title: f.videoTitle ?? "", src: f.src, ...t }];
    case "collectionBlock":
      switch (f.kind) {
        case "categories":
          return [{ type: "categories", title: text(f.title), ...t }];
        case "spotlights":
          return [{ type: "spotlights", title: text(f.title), items: items(e, "productSpotlight").map((x) => spotlight(x, draft)), ...t }];
        case "guides":
          return [{ type: "guides", title: text(f.title), linkLabel: text(f.linkLabel), items: items(e, "buyingGuide").map((x, i) => guide(x, i, draft)), ...t }];
        case "posts":
          return [{ type: "posts", title: text(f.title), items: items(e, "blogPost").map((x) => post(x, draft)), ...t }];
        case "postListing":
          return [{ type: "postListing", title: text(f.title), searchPlaceholder: text(f.searchPlaceholder), searchButtonLabel: text(f.searchButtonLabel), ...t }];
        case "guideListing":
          return [{ type: "guideListing", title: text(f.title), ...t }];
        case "faqs":
          return [{ type: "faqs", items: items(e, "faq").map((x) => faq(x, draft)).sort((a, b) => a.sortOrder - b.sortOrder), ...t }];
        default:
          return [];
      }
    default:
      return [];
  }
}

// ---------------------------------------------------------------- queries
export async function getPage(key: string, locale: Locale, draft: boolean): Promise<Page | undefined> {
  const e = await getEntry("page", key, locale, draft);
  if (!e) return undefined;
  return { title: e.fields.title, description: text(e.fields.description), blocks: many(e.fields.components).flatMap((b) => block(b, draft)), ...tags(e, draft) };
}

export async function getNavigation(locale: Locale, draft: boolean): Promise<Navigation | undefined> {
  const [nav] = await getEntries("siteNavigation", locale, draft, { limit: 1 });
  if (!nav) return undefined;
  const f = nav.fields;
  return {
    headerLinks: many(f.headerLinks).map((l) => ({ label: l.fields.label, href: l.fields.href, highlight: !!l.fields.highlight })),
    footerColumns: many(f.footerColumns).map((c) => ({
      heading: c.fields.heading,
      links: many(c.fields.links).map((l) => ({ label: l.fields.label, href: l.fields.href })),
    })),
    contact: { salesEmail: text(f.salesEmail), supportPhone: text(f.supportPhone), openingHours: text(f.openingHours) },
    legalText: text(f.legalText),
    announcements: await announcements(locale, draft),
  };
}

async function announcements(locale: Locale, draft: boolean): Promise<Announcement[]> {
  const now = Date.now();
  return (await getEntries("announcementBar", locale, draft, { order: "sys.createdAt" }))
    .filter((e) => e.fields.isActive !== false)
    .filter((e) => (!e.fields.startsAt || Date.parse(e.fields.startsAt) <= now) && (!e.fields.endsAt || Date.parse(e.fields.endsAt) >= now))
    .map((e) => ({
      message: e.fields.message,
      cta: e.fields.ctaLabel || e.fields.ctaHref ? { label: text(e.fields.ctaLabel), href: text(e.fields.ctaHref) } : undefined,
      style: e.fields.style,
      audience: e.fields.audience,
      ...tags(e, draft),
    }));
}

export async function getAnnouncement(locale: Locale, draft: boolean, audience: "guests" | "logged_in" = "guests") {
  return (await announcements(locale, draft)).find((a) => a.audience === "everyone" || a.audience === audience);
}

export async function getPosts(locale: Locale, draft: boolean) {
  return (await getEntries("blogPost", locale, draft, { order: "-fields.date" })).map((e) => post(e, draft));
}

export async function getPost(slug: string, locale: Locale, draft: boolean) {
  const e = await getEntry("blogPost", slug, locale, draft);
  return e ? post(e, draft) : undefined;
}

export async function getGuides(locale: Locale, draft: boolean) {
  return (await getEntries("buyingGuide", locale, draft, { order: "sys.createdAt" })).map((e, i) => guide(e, i, draft));
}

export async function getGuide(slug: string, locale: Locale, draft: boolean) {
  const all = await getGuides(locale, draft);
  return all.find((g) => g.url === `/guides/${slug}`);
}

export async function getSpotlights(locale: Locale, draft: boolean) {
  return (await getEntries("productSpotlight", locale, draft, { order: "sys.createdAt" })).map((e) => spotlight(e, draft));
}
