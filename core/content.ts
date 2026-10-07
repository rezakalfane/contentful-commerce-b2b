import type { Locale } from "@/lib/i18n";
import type { Tagged } from "./edit";

export type { Tagged, Tags } from "./edit";

// ---------------------------------------------------------------- content shapes (what components render)
// One model for every CMS: pages and posts are ordered lists of blocks, entities (guides, FAQs, spotlights, authors) are referenced by
// blocks. A provider maps its own content into these; `$` carries the edit attributes of its editor (empty outside preview).
export type Img = { url: string; alt: string };
export type Cta = { label?: string; href?: string };

export type Hero = Tagged & { title: string; description?: string; image?: Img; secondImage?: Img; cta?: Cta; variant: "default" | "home" };
export type Author = Tagged & { name: string; avatar?: Img; bio?: string };

export type PostBlock = Tagged & ({ type: "text"; html: string } | { type: "image"; img: Img } | { type: "video"; title: string; src: string });
export type Post = Tagged & {
  id: string;
  url: string;
  title: string;
  description?: string;
  date?: string;
  readTime?: number;
  image?: Img;
  authors: Author[];
  blocks: PostBlock[];
};

export type Faq = Tagged & { id: string; question: string; answerHtml: string; topic: string; sortOrder: number; featured: boolean };

export type Guide = Tagged & {
  id: string;
  url: string;
  title: string;
  summary: string;
  image?: Img;
  audience?: string;
  readMinutes?: number;
  sortOrder: number;
  steps: (Tagged & { title: string; body: string; proTip?: string })[];
  checklist: string[];
  recommendedProducts: { bcProductId: number; sku?: string }[];
  relatedFaqs: Faq[];
  author?: Author;
};

export type Spotlight = Tagged & {
  id: string;
  title: string;
  bcProductId: number;
  bcSku?: string;
  tagline: string;
  badge?: string;
  image?: Img;
  featured: boolean;
  keyFeatures: string[];
  useCases: (Tagged & { title: string; description?: string })[];
};

export type Navigation = Tagged & {
  headerLinks: { label: string; href: string; highlight?: boolean }[];
  footerColumns: { heading: string; links: { label: string; href: string }[] }[];
  contact?: { salesEmail?: string; supportPhone?: string; openingHours?: string };
  legalText?: string;
  announcements: Announcement[];
};

export type Announcement = Tagged & {
  message: string;
  cta?: Cta;
  style: "info" | "promo" | "warning";
  audience: "everyone" | "logged_in" | "guests";
};

/** The components an editor can stack in a Page, in render order. */
export type Block = Tagged &
  (
    | { type: "hero"; hero: Hero; campaign?: string }
    | { type: "text"; html: string }
    | { type: "image"; img: Img }
    | { type: "video"; title: string; src: string }
    | { type: "feature"; title: string; html: string; image?: Img; layout: "image_left" | "image_right" }
    | { type: "categories"; title?: string }
    | { type: "spotlights"; title?: string; items: Spotlight[] }
    | { type: "guides"; title?: string; linkLabel?: string; items: Guide[] }
    | { type: "posts"; title?: string; items: Post[] }
    | { type: "postListing"; title?: string; searchPlaceholder?: string; searchButtonLabel?: string }
    | { type: "guideListing"; title?: string }
    | { type: "faqs"; items: Faq[] }
  );

export type Page = Tagged & { title: string; description?: string; blocks: Block[] };

// ---------------------------------------------------------------- providers
export type CmsId = "amplience" | "contentful" | "storyblok" | "contentstack";

/** What a provider can do beyond reading content; the settings panel lists these. */
export type Capabilities = {
  /** Plain values appear in the preview while the editor types (not only after a save). */
  typedEditing: boolean;
  /** Content can be viewed as of another date (`at`). */
  timeTravel: boolean;
  /** The CMS drives the site through its own visualization route (`/preview`). */
  visualization: boolean;
  /** Content can be scheduled (slots, editions). */
  scheduling: boolean;
  /** Reordering blocks in the editor shows in the preview. */
  reorderLive: boolean;
};

/** The reads the pages and components need. `at` is only understood by providers that declare `timeTravel`; others ignore it. */
export interface ContentProvider {
  readonly id: CmsId;
  /** A Page by key: `home`, `faq`, `guides`, `blog`, or any page an editor adds. */
  getPage(key: string, locale: Locale, at?: number): Promise<Page | undefined>;
  getNavigation(locale: Locale): Promise<Navigation | undefined>;
  getAnnouncement(locale: Locale, audience?: "guests" | "logged_in"): Promise<Announcement | undefined>;
  getPosts(locale: Locale, at?: number): Promise<Post[]>;
  getPost(slug: string, locale: Locale, at?: number): Promise<Post | undefined>;
  getGuides(locale: Locale, at?: number): Promise<Guide[]>;
  getGuide(slug: string, locale: Locale, at?: number): Promise<Guide | undefined>;
  getSpotlights(locale: Locale): Promise<Spotlight[]>;
}
