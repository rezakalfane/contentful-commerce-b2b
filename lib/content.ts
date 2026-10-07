import type { Announcement, Guide, Navigation, Page, Post, Spotlight } from "@/core/content";
import type { Locale } from "./i18n";
import { provider } from "@/providers/cms/contentful";

export type {
  Announcement, Author, Block, Capabilities, CmsId, ContentProvider, Cta, Faq, Guide, Hero, Img, Navigation, Page, Post, PostBlock, Spotlight,
  Tagged, Tags,
} from "@/core/content";

/**
 * What the pages call: reads from Contentful (providers/cms/contentful), mapped into the content model in core/content.ts.
 */
const cms = async () => provider;

export const getPage = async (key: string, locale: Locale, at?: number): Promise<Page | undefined> => (await cms()).getPage(key, locale, at);
export const getNavigation = async (locale: Locale): Promise<Navigation | undefined> => (await cms()).getNavigation(locale);
export const getAnnouncement = async (locale: Locale, audience: "guests" | "logged_in" = "guests"): Promise<Announcement | undefined> =>
  (await cms()).getAnnouncement(locale, audience);
export const getPosts = async (locale: Locale, at?: number): Promise<Post[]> => (await cms()).getPosts(locale, at);
export const getPost = async (slug: string, locale: Locale, at?: number): Promise<Post | undefined> => (await cms()).getPost(slug, locale, at);
export const getGuides = async (locale: Locale, at?: number): Promise<Guide[]> => (await cms()).getGuides(locale, at);
export const getGuide = async (slug: string, locale: Locale, at?: number): Promise<Guide | undefined> => (await cms()).getGuide(slug, locale, at);
export const getSpotlights = async (locale: Locale): Promise<Spotlight[]> => (await cms()).getSpotlights(locale);

/** Name of the stretch of time a Page is in: the campaign of its scheduled slot, else the title of its first hero. */
export const pageLabel = (page?: Page) => {
  const hero = page?.blocks.find((b) => b.type === "hero");
  return hero?.type === "hero" ? (hero.campaign ?? hero.hero.title) : undefined;
};
