import type { ContentProvider } from "@/core/content";
import { isPreviewRequest } from "@/lib/request";
import * as c from "./mapper";

/** Contentful: published content from the Delivery API; drafts from the Preview API when the proxy verified the editor's preview secret. */
export const provider: ContentProvider = {
  id: "contentful",
  getPage: async (key, locale) => c.getPage(key, locale, await isPreviewRequest()),
  getNavigation: async (locale) => c.getNavigation(locale, await isPreviewRequest()),
  getAnnouncement: async (locale, audience) => c.getAnnouncement(locale, await isPreviewRequest(), audience),
  getPosts: async (locale) => c.getPosts(locale, await isPreviewRequest()),
  getPost: async (slug, locale) => c.getPost(slug, locale, await isPreviewRequest()),
  getGuides: async (locale) => c.getGuides(locale, await isPreviewRequest()),
  getGuide: async (slug, locale) => c.getGuide(slug, locale, await isPreviewRequest()),
  getSpotlights: async (locale) => c.getSpotlights(locale, await isPreviewRequest()),
};
