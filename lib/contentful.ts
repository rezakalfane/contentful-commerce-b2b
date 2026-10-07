import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { timingSafeEqual } from "node:crypto";
import { cache } from "react";
import type { Tags } from "./edit";
import { CF_LOCALE, type Locale } from "./i18n";

const EU = (process.env.CONTENTFUL_REGION ?? "").trim().toLowerCase() === "eu";
export const SPACE_ID = process.env.CONTENTFUL_SPACE_ID ?? "";
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";
const DELIVERY_TOKEN = process.env.CONTENTFUL_DELIVERY_TOKEN ?? "";
const PREVIEW_TOKEN = process.env.CONTENTFUL_PREVIEW_TOKEN ?? "";
/** Shared secret in the content preview URL; only requests carrying it may read drafts. */
const PREVIEW_SECRET = process.env.CONTENTFUL_PREVIEW_SECRET ?? "";

/** Published content comes from the Delivery API (delivery token, published entries only); drafts from the Preview API. */
const BASE = (isDraft: boolean) =>
  `https://${isDraft ? "preview" : "cdn"}${EU ? ".eu" : ""}.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Fields = Record<string, any>;
/** An entry or asset with its links resolved in place (one `locale` of every field). */
export type Entry = { id: string; type: string; locale: string; fields: Fields };

// ---------------------------------------------------------------- preview (content preview URL)
/** Set when the page is opened from Contentful's content preview: draft content is read with the preview token. */
export type PreviewParams = { draft: true };

/**
 * The content preview URL in Contentful carries `cf_preview=<secret>`. Drafts are only served when the secret matches, so a bare
 * `?cf_preview=1` cannot be used to read unpublished content. In local development any value is accepted.
 */
export function previewParams(sp: Record<string, string | string[] | undefined>): PreviewParams | undefined {
  const value = Array.isArray(sp.cf_preview) ? sp.cf_preview[0] : sp.cf_preview;
  if (!value) return undefined;
  if (process.env.NODE_ENV !== "production") return { draft: true };
  const a = Buffer.from(value);
  const b = Buffer.from(PREVIEW_SECRET);
  return PREVIEW_SECRET && a.length === b.length && timingSafeEqual(a, b) ? { draft: true } : undefined;
}

// ---------------------------------------------------------------- fetching
type Params = Record<string, string | number | undefined>;
type Raw = { sys: { id: string; type: string; contentType?: { sys: { id: string } } }; fields?: Fields };
type Response = { items: Raw[]; includes?: { Entry?: Raw[]; Asset?: Raw[] } };

const isLink = (v: unknown): v is { sys: { type: "Link"; linkType: string; id: string } } =>
  !!v && typeof v === "object" && (v as { sys?: { type?: string } }).sys?.type === "Link";

/** Replaces links with the entries/assets they point to (from `items` and `includes`), down to `depth` levels. */
function resolve(res: Response, locale: string): Entry[] {
  const raw = new Map<string, Raw>();
  for (const r of [...(res.includes?.Entry ?? []), ...(res.includes?.Asset ?? []), ...res.items]) raw.set(`${r.sys.type}:${r.sys.id}`, r);
  const build = (r: Raw, depth: number): Entry => {
    const type = r.sys.type === "Asset" ? "Asset" : (r.sys.contentType?.sys.id ?? r.sys.type);
    const walk = (v: unknown): unknown => {
      if (Array.isArray(v)) return v.map(walk).filter((x) => x !== undefined);
      if (isLink(v)) {
        const target = raw.get(`${v.sys.linkType}:${v.sys.id}`);
        // An unresolvable link (an unpublished or deleted target) is dropped, so published pages never show it.
        return target && depth > 0 ? build(target, depth - 1) : undefined;
      }
      return v;
    };
    const fields: Fields = {};
    for (const [k, v] of Object.entries(r.fields ?? {})) fields[k] = walk(v);
    return { id: r.sys.id, type, locale, fields };
  };
  return res.items.map((r) => build(r, 3));
}

async function request(path: string, query: Params, isDraft: boolean): Promise<Response> {
  const qs = new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]));
  const res = await fetch(`${BASE(isDraft)}${path}?${qs}`, {
    headers: { Authorization: `Bearer ${isDraft ? PREVIEW_TOKEN : DELIVERY_TOKEN}` },
    ...(isDraft ? { cache: "no-store" as const } : { next: { revalidate: 60, tags: ["contentful"] } }),
  });
  if (!res.ok) throw new Error(`Contentful ${res.status} for ${path}`);
  return res.json();
}

// `cache()` shares one fetch between generateMetadata, the page and the layout within a single request.
const fetchEntries = cache(async (contentType: string, params: string, locale: string, isDraft: boolean) =>
  resolve(
    await request("/entries", { content_type: contentType, locale, include: 3, limit: 1000, ...(JSON.parse(params) as Params) }, isDraft),
    locale,
  ),
);

/** Entries of a content type for the locale (fields fall back to English where French is empty), up to 1000. */
export function getEntries(contentType: string, locale: Locale, preview?: PreviewParams, params: Params = {}) {
  return fetchEntries(contentType, JSON.stringify(params), CF_LOCALE[locale], !!preview);
}

/** One entry of a content type by slug. Undefined when it does not exist (or is not published). */
export async function getEntry(contentType: string, slug: string, locale: Locale, preview?: PreviewParams) {
  return (await getEntries(contentType, locale, preview, { "fields.slug": slug, limit: 1 }))[0];
}

// ---------------------------------------------------------------- mapping helpers
export type Asset = { uid: string; url: string; title?: string };
export type Link = { title?: string; href?: string };

/** A resolved asset link to `{ uid, url, title }` (Contentful URLs are protocol-relative). Undefined for a missing or unpublished asset. */
export const asset = (a?: Entry): Asset | undefined => {
  const url: string | undefined = a?.fields?.file?.url;
  return a && url ? { uid: a.id, url: url.startsWith("//") ? `https:${url}` : url, title: a.fields.title || undefined } : undefined;
};

/** A single resolved reference (links that did not resolve are dropped by `resolve`, so this is an Entry or undefined). */
export const one = (v: unknown): Entry | undefined => (v && typeof v === "object" && "fields" in v ? (v as Entry) : undefined);
/** A list of resolved references. */
export const many = (v: unknown): Entry[] => (Array.isArray(v) ? v.filter((e): e is Entry => !!one(e)) : []);

export const link = (title?: string, href?: string): Link | undefined => (href ? { title, href } : undefined);

export const strings = (v: unknown): string[] => (Array.isArray(v) ? v.map(String).map((s) => s.trim()).filter(Boolean) : []);
export const numbers = (v: unknown): number[] => strings(v).map(Number).filter((n) => Number.isFinite(n) && n > 0);

/** Rich text (Contentful document) to HTML. */
export const html = (doc?: Parameters<typeof documentToHtmlString>[0]): string => (doc?.content?.length ? documentToHtmlString(doc) : "");

/** Names the storefront shapes use that differ from the Contentful field id (everything else is the camelCase of the shape name). */
const FIELD_ID: Record<string, string> = {
  banner_image: "image", banner_description: "description", call_to_action: "ctaLabel", rich_text: "intro", name: "name", answerHtml: "answer",
};

/**
 * Live Preview inspector attributes for an entry. Returned for every field name (`x.$.title`, `x.$.hero_image`...) and mapped to the
 * Contentful field id. Empty outside preview, so published HTML carries no editing markup.
 */
export function editTags(entry: Entry | undefined, preview?: PreviewParams): Tags {
  if (!preview || !entry) return {};
  return new Proxy({}, {
    get: (_, key) => {
      if (typeof key !== "string") return undefined;
      const name = key.replace(/__parent$/, "");
      const field = FIELD_ID[name] ?? name.replace(/_([a-z])/g, (_m, c: string) => c.toUpperCase());
      return {
        "data-contentful-entry-id": entry.id,
        "data-contentful-field-id": field,
        "data-contentful-locale": entry.locale,
      };
    },
  });
}
