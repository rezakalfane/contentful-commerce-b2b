import { authorFrom, getAuthorMap, heroOf, type Asset, type Author, type HeroBanner, type Link } from "./blog";
import {
  asset, editTags, getEntries, getEntry, html, link, many, numbers, one, strings,
  type Entry, type PreviewParams,
} from "./contentful";
import type { Tagged } from "./edit";
import type { Locale } from "./i18n";

// ---------------------------------------------------------------- types
export type Navigation = Tagged & {
  header_links?: (Tagged & { label: string; href: string; highlight?: boolean })[];
  footer_columns?: { heading: string; links: { label: string; href: string }[] }[];
  contact?: { sales_email?: string; support_phone?: string; opening_hours?: string };
  legal_text?: string;
};

export type Announcement = Tagged & {
  uid: string;
  message: string;
  cta?: Link;
  style: "info" | "promo" | "warning";
  audience: "everyone" | "logged_in" | "guests";
  starts_at?: string;
  ends_at?: string;
  is_active?: boolean;
};

export type Faq = Tagged & {
  uid: string;
  id: string;
  title: string;
  topic: string;
  sort_order?: number;
  is_featured?: boolean;
  answerHtml: string;
};

export type Guide = Tagged & {
  uid: string;
  id: string;
  title: string;
  url: string;
  summary: string;
  hero_image?: Asset;
  audience?: string;
  read_minutes?: number;
  steps?: (Tagged & { step_title: string; step_body: string; pro_tip?: string })[];
  checklist?: string[];
  recommended_bc_products?: number[];
  recommended_skus?: string[];
  related_faqs?: Faq[];
  author?: Author[];
};

export type Spotlight = Tagged & {
  uid: string;
  id: string;
  title: string;
  bc_product_id: number;
  bc_sku?: string;
  tagline: string;
  key_features?: string[];
  use_cases?: { use_case: string; description?: string }[];
  badge?: string;
  editorial_image?: Asset;
  is_featured?: boolean;
};

export type PageEntry = Tagged & {
  uid: string;
  id: string;
  title: string;
  description?: string;
  hero?: HeroBanner[];
};

export type HomePage = PageEntry & {
  image?: Asset;
  rich_text?: string;
  blocks?: { block: Tagged & { title: string; copy: string; image?: Asset; layout?: "image_left" | "image_right" } }[];
};

const draftOf = (preview?: PreviewParams) => (preview ? ({ draft: true } as const) : undefined);

// ---------------------------------------------------------------- mappers
function faqOf(e: Entry, preview?: PreviewParams): Faq {
  const f = e.fields;
  return {
    uid: e.id, id: e.id, title: f.question, topic: f.topic, sort_order: typeof f.sortOrder === "number" ? f.sortOrder : undefined,
    is_featured: !!f.isFeatured, answerHtml: html(f.answer), $: editTags(e, preview),
  };
}

function guideOf(e: Entry, authors: Map<string, Author>, preview?: PreviewParams): Guide {
  const f = e.fields;
  return {
    uid: e.id,
    id: e.id,
    title: f.title,
    url: `/guides/${f.slug}`,
    summary: f.summary,
    hero_image: asset(one(f.heroImage)),
    audience: f.audience || undefined,
    read_minutes: typeof f.readMinutes === "number" ? f.readMinutes : undefined,
    steps: many(f.steps).map((b) => ({
      step_title: b.fields.stepTitle, step_body: b.fields.stepBody, pro_tip: b.fields.proTip || undefined, $: editTags(b, preview),
    })),
    checklist: strings(f.checklist),
    recommended_bc_products: numbers(f.recommendedBcProducts),
    recommended_skus: strings(f.recommendedSkus),
    related_faqs: many(f.relatedFaqs).map((x) => faqOf(x, preview)),
    author: authorFrom(f.author, authors, preview),
    $: editTags(e, preview),
  };
}

function spotlightOf(e: Entry, preview?: PreviewParams): Spotlight {
  const f = e.fields;
  return {
    uid: e.id, id: e.id, title: f.title, bc_product_id: Number(f.bcProductId), bc_sku: f.bcSku || undefined, tagline: f.tagline,
    key_features: strings(f.keyFeatures),
    use_cases: many(f.useCases).map((u) => ({ use_case: u.fields.useCase, description: u.fields.description || undefined })),
    badge: f.badge || undefined, editorial_image: asset(one(f.editorialImage)), is_featured: !!f.isFeatured, $: editTags(e, preview),
  };
}

// ---------------------------------------------------------------- queries
export async function getNavigation(locale: Locale): Promise<Navigation | undefined> {
  const e = (await getEntries("siteNavigation", locale, undefined, { limit: 1 }))[0];
  if (!e) return undefined;
  const f = e.fields;
  return {
    header_links: many(f.headerLinks).map((l) => ({ label: l.fields.label, href: l.fields.href, highlight: !!l.fields.highlight })),
    footer_columns: many(f.footerColumns).map((col) => ({
      heading: col.fields.heading,
      links: many(col.fields.links).map((l) => ({ label: l.fields.label, href: l.fields.href })),
    })),
    contact: { sales_email: f.salesEmail, support_phone: f.supportPhone, opening_hours: f.openingHours },
    legal_text: f.legalText,
  };
}

/** First announcement that is active, in its date window and aimed at this audience. */
export async function getAnnouncement(locale: Locale, audience: "guests" | "logged_in" = "guests") {
  const now = Date.now();
  const entries = await getEntries("announcementBar", locale);
  const bars: Announcement[] = entries.map((e) => ({
    uid: e.id, message: e.fields.message, cta: link(e.fields.ctaLabel, e.fields.ctaHref), style: e.fields.style,
    audience: e.fields.audience, starts_at: e.fields.startsAt || undefined, ends_at: e.fields.endsAt || undefined, is_active: e.fields.isActive !== false,
  }));
  return bars.find(
    (b) =>
      b.is_active !== false &&
      (b.audience === "everyone" || b.audience === audience) &&
      (!b.starts_at || Date.parse(b.starts_at) <= now) &&
      (!b.ends_at || Date.parse(b.ends_at) >= now),
  );
}

export async function getFaqs(locale: Locale, preview?: PreviewParams) {
  const entries = await getEntries("faq", locale, preview);
  return entries.map((e) => faqOf(e, preview)).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export async function getGuides(locale: Locale, preview?: PreviewParams) {
  const [entries, authors] = await Promise.all([getEntries("buyingGuide", locale, preview), getAuthorMap(locale, !!draftOf(preview))]);
  return entries.map((e) => guideOf(e, authors, preview));
}

export async function getGuide(locale: Locale, slug: string, preview?: PreviewParams) {
  const [e, authors] = await Promise.all([getEntry("buyingGuide", slug, locale, preview), getAuthorMap(locale, !!draftOf(preview))]);
  return e ? guideOf(e, authors, preview) : undefined;
}

export async function getSpotlights(locale: Locale, preview?: PreviewParams) {
  const entries = await getEntries("productSpotlight", locale, preview);
  return entries.map((e) => spotlightOf(e, preview));
}

/** A `page` entry by storefront URL: `/` is the `home` page, `/faq` the `faq` page, `/guides` the `guides` page. */
export async function getPage<T extends PageEntry = PageEntry>(locale: Locale, url: string, preview?: PreviewParams) {
  const e = await getEntry("page", url === "/" ? "home" : url.slice(1), locale, preview);
  if (!e) return undefined;
  const f = e.fields;
  const hero = heroOf(one(f.hero), preview);
  const page: HomePage = {
    uid: e.id,
    id: e.id,
    title: f.title,
    description: f.description || undefined,
    hero: hero ? [hero] : undefined,
    image: asset(one(f.image)),
    rich_text: html(f.intro) || undefined,
    blocks: many(f.blocks).map((b) => ({
      block: { title: b.fields.title, copy: html(b.fields.copy), image: asset(one(b.fields.image)), layout: b.fields.layout || "image_left", $: editTags(b, preview) },
    })),
    $: editTags(e, preview),
  };
  return page as unknown as T;
}

export const getHomePage = (locale: Locale, preview?: PreviewParams) => getPage<HomePage>(locale, "/", preview);
