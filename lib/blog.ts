import { cache } from "react";
import type { Tagged } from "./edit";
import type { Locale } from "./i18n";
import {
  asset, editTags, getEntries, getEntry, html, link, many, one,
  type Asset, type Entry, type Link, type PreviewParams,
} from "./contentful";

export type { Asset, Link };

export type Author = Tagged & { uid: string; id: string; title: string; picture?: Asset; bio?: string };

export type Post = Tagged & {
  uid: string;
  id: string;
  title: string;
  url: string;
  date?: string;
  author?: Author[];
  featured_image?: Asset;
  bodyHtml?: string;
  related_post?: Post[];
  seo?: { meta_title?: string; meta_description?: string };
};

export type HeroBanner = Tagged & {
  title: string;
  banner_image?: Asset;
  banner_description?: string;
  call_to_action?: Link;
};

export type ListingPage = Tagged & {
  uid: string;
  id: string;
  title: string;
  hero?: HeroBanner;
  search_placeholder?: string;
  search_button_label?: string;
  featured_title?: string;
  featured_posts: Post[];
  view_all_label?: string;
  related_title?: string;
  related_posts: Post[];
};

// ---------------------------------------------------------------- mappers
export function authorOf(e: Entry, preview?: PreviewParams): Author {
  const f = e.fields;
  return { uid: e.id, id: e.id, title: f.name, picture: asset(one(f.picture)), bio: f.bio || undefined, $: editTags(e, preview) };
}

/** Every author of the locale by entry id: one request beats resolving them per post. */
export const getAuthorMap = cache(async (locale: Locale, draft: boolean) => {
  const preview = draft ? ({ draft: true } as const) : undefined;
  const entries = await getEntries("author", locale, preview);
  return new Map(entries.map((e) => [e.id, authorOf(e, preview)]));
});

/** A single author reference as the one-item list the pages expect. */
export function authorFrom(value: unknown, authors: Map<string, Author>, preview?: PreviewParams): Author[] | undefined {
  const e = one(value);
  const a = e ? (authors.get(e.id) ?? authorOf(e, preview)) : undefined;
  return a ? [a] : undefined;
}

export function heroOf(e: Entry | undefined, preview?: PreviewParams): HeroBanner | undefined {
  if (!e) return undefined;
  const f = e.fields;
  return {
    title: f.title,
    banner_image: asset(one(f.image)),
    banner_description: f.description || undefined,
    call_to_action: link(f.ctaLabel, f.ctaHref),
    $: editTags(e, preview),
  };
}

export function postOf(e: Entry, authors: Map<string, Author>, preview?: PreviewParams, withRelated = false): Post {
  const f = e.fields;
  const related = one(f.relatedPost);
  return {
    uid: e.id,
    id: e.id,
    title: f.title,
    url: `/blog/${f.slug}`,
    date: f.date || undefined,
    author: authorFrom(f.author, authors, preview),
    featured_image: asset(one(f.featuredImage)),
    bodyHtml: html(f.body),
    related_post: withRelated && related ? [postOf(related, authors, preview)] : undefined,
    seo: { meta_title: f.seoTitle || undefined, meta_description: f.seoDescription || undefined },
    $: editTags(e, preview),
  };
}

// ---------------------------------------------------------------- queries
export async function getListingPage(locale: Locale, preview?: PreviewParams): Promise<ListingPage | undefined> {
  const [list, authors] = await Promise.all([getEntries("blogListingPage", locale, preview, { limit: 1 }), getAuthorMap(locale, !!preview)]);
  const e = list[0];
  if (!e) return undefined;
  const f = e.fields;
  const posts = (v: unknown) => many(v).map((p) => postOf(p, authors, preview));
  return {
    uid: e.id,
    id: e.id,
    title: f.title,
    hero: heroOf(one(f.hero), preview),
    search_placeholder: f.searchPlaceholder || undefined,
    search_button_label: f.searchButtonLabel || undefined,
    featured_title: f.featuredTitle || undefined,
    featured_posts: posts(f.featuredPosts),
    view_all_label: f.viewAllLabel || undefined,
    related_title: f.relatedTitle || undefined,
    related_posts: posts(f.relatedPosts),
    $: editTags(e, preview),
  };
}

export async function getPosts(locale: Locale, preview?: PreviewParams) {
  const [entries, authors] = await Promise.all([getEntries("blogPost", locale, preview, { order: "-fields.date" }), getAuthorMap(locale, !!preview)]);
  return entries.map((e) => postOf(e, authors, preview));
}

export async function getPost(locale: Locale, slug: string, preview?: PreviewParams) {
  const [e, authors] = await Promise.all([getEntry("blogPost", slug, locale, preview), getAuthorMap(locale, !!preview)]);
  return e ? postOf(e, authors, preview, true) : undefined;
}

export const firstAuthor = (p: Post) => p.author?.[0];
