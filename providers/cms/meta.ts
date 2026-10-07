/** Static facts about the CMS this site reads: Contentful. */
export const CMS_LABEL = "Contentful";

/** Origins allowed to embed the site in a frame (Contentful's web app, US and EU), plus localhost in development (see proxy.ts). */
export const FRAME_ANCESTORS = ["https://app.contentful.com", "https://app.eu.contentful.com"];
