"use client";

import { ContentfulLivePreview } from "@contentful/live-preview";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Starts the Live Preview SDK inside Contentful's content preview (inspector mode: click a tagged element to open its field in the
 * editor). The pages are server-rendered, so there is no client data to patch: when the editor saves an entry, the page is
 * re-rendered on the server (`router.refresh()`), which reads the new draft through the Preview API. `enableLiveUpdates` must be on
 * for the SDK to deliver the `save` event, even though no `useContentfulLiveUpdates` data is subscribed.
 */
export function LivePreview({ space, environment }: { space: string; environment: string }) {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  useEffect(() => {
    // Contentful's web app (US or EU) is the only parent that may drive the page; in development the framing page is allowed too.
    const targetOrigin = ["https://app.contentful.com", "https://app.eu.contentful.com"];
    if (process.env.NODE_ENV !== "production" && document.referrer) targetOrigin.push(new URL(document.referrer).origin);
    try {
      ContentfulLivePreview.init({ locale, space, environment, enableInspectorMode: true, enableLiveUpdates: true, targetOrigin });
      return ContentfulLivePreview.subscribe("save", { callback: () => router.refresh() });
    } catch (e) {
      // Opened outside a supported parent (e.g. the preview URL in a bare tab): the page still renders, without click-to-edit.
      console.warn("Live Preview not started:", e instanceof Error ? e.message : e);
    }
  }, [locale, space, environment, router]);

  return null;
}
