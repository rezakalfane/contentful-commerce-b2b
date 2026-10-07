"use client";

import { ContentfulLivePreview } from "@contentful/live-preview";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { previewBaseline, updatePreviewOverlay, type PreviewEdit } from "./actions";
import { isOverlayValue, type OverlayValue, type PreviewEntity } from "./client";

type Entity = { sys: { type: "Entry"; id: string }; fields: Record<string, unknown> };

/** Every entry found in the editor's answer: it may be the whole data tree we subscribed with, or a single updated entry. */
function entitiesIn(node: unknown, out: Entity[] = []): Entity[] {
  if (Array.isArray(node)) node.forEach((n) => entitiesIn(n, out));
  else if (node && typeof node === "object") {
    const o = node as { sys?: { id?: unknown }; fields?: unknown };
    if (typeof o.sys?.id === "string" && o.fields && typeof o.fields === "object") out.push(o as Entity);
    else Object.values(o).forEach((n) => entitiesIn(n, out));
  }
  return out;
}

/** Links as plain `{ sys: { type: "Link", linkType, id } }` (the editor may send resolved entries or links), so lists compare by what they point at. */
function normalize(value: unknown): unknown {
  const link = (x: unknown) => {
    const sys = (x as { sys?: { type?: string; linkType?: string; id?: unknown } } | null)?.sys;
    if (!sys || typeof sys.id !== "string") return undefined;
    const linkType = sys.type === "Link" ? sys.linkType : sys.type;
    return linkType === "Entry" || linkType === "Asset" ? { sys: { type: "Link", linkType, id: sys.id } } : undefined;
  };
  if (Array.isArray(value) && value.length && value.every((x) => link(x))) return value.map(link);
  return link(value) ?? value;
}

/** A field value as the editor sends it: plain for one locale, or keyed by locale code when it carries every locale. */
function localized(value: unknown, locale: string): unknown {
  return value && typeof value === "object" && !Array.isArray(value) && locale in (value as object) ? (value as Record<string, unknown>)[locale] : value;
}

/**
 * Starts the Live Preview SDK inside Contentful's content preview.
 *
 * - Inspector mode: click a tagged element to open its field in the editor.
 * - Typing: the entries tagged on the page are looked up on the server (`previewBaseline`: their saved draft values) and handed to the
 *   SDK, which sends them to the editor and gets their unsaved values back. Changed fields go to the server (`updatePreviewOverlay`),
 *   which stores them and re-renders the page in the same response, so changes show up as they are made: text and dates, numbers,
 *   booleans, lists, rich text, and the order of linked blocks. A block added or media replaced in the editor appears after the
 *   entry is saved.
 * - Saving: the overlays and the short draft cache are dropped and the page is re-rendered from the Preview API.
 *   `enableLiveUpdates` must be on for the SDK to deliver both the edit and the save events.
 */
export function LivePreview({ space, environment }: { space: string; environment: string }) {
  const { locale } = useParams<{ locale: Locale }>();

  useEffect(() => {
    // Contentful's web app (US or EU) is the only parent that may drive the page; in development the framing page is allowed too.
    const targetOrigin = ["https://app.contentful.com", "https://app.eu.contentful.com"];
    if (process.env.NODE_ENV !== "production" && document.referrer) targetOrigin.push(new URL(document.referrer).origin);
    const secret = new URLSearchParams(window.location.search).get("cf_preview") ?? "";

    // One request in flight at a time (Next runs server actions one after another anyway); while it runs, newer edits replace older
    // ones per entry, so the page catches up to the latest state in one step instead of replaying every keystroke.
    let busy = false;
    const pending = new Map<string, PreviewEdit>();
    const flush = async () => {
      if (busy || !pending.size) return;
      busy = true;
      const edits = [...pending.values()];
      pending.clear();
      try {
        await updatePreviewOverlay(secret, edits); // stores the edits and re-renders the page in the same response
      } finally {
        busy = false;
        void flush();
      }
    };
    let timer: ReturnType<typeof setTimeout> | undefined;
    const send = (edits: PreviewEdit[]) => {
      for (const e of edits) pending.set(e.id, e);
      clearTimeout(timer);
      timer = setTimeout(() => void flush(), 120); // typing bursts become one request
    };

    let cancelled = false;
    const unsubscribe: (() => void)[] = [];
    // The saved values the editor's answers are compared with, so reverting a change clears it.
    const baseline = new Map<string, PreviewEntity>();

    try {
      ContentfulLivePreview.init({ locale, space, environment, enableInspectorMode: true, enableLiveUpdates: true, targetOrigin });
      unsubscribe.push(
        ContentfulLivePreview.subscribe("save", {
          callback: () => {
            // Saved: the Preview API now has the values, so drop the overlays (an empty edit clears) and the draft cache, and re-render.
            pending.clear();
            const clear: PreviewEdit[] = [...baseline.values()].map((e) => ({ id: e.id, locale: e.locale, fields: {} }));
            void updatePreviewOverlay(secret, clear, true);
          },
        }),
      );

      const ids = [...new Set([...document.querySelectorAll("[data-contentful-entry-id]")].map((el) => el.getAttribute("data-contentful-entry-id") ?? ""))].filter(Boolean);
      if (ids.length) {
        void previewBaseline(secret, ids, locale).then((entities) => {
          if (cancelled || !entities.length) return;
          for (const e of entities) baseline.set(e.id, e);
          const data: Entity[] = entities.map((e) => ({ sys: { type: "Entry", id: e.id }, fields: { ...e.fields } }));
          unsubscribe.push(
            ContentfulLivePreview.subscribe({
              data,
              locale,
              callback: (updated) => {
                const edits: PreviewEdit[] = [];
                for (const u of entitiesIn(updated)) {
                  const base = baseline.get(u.sys.id);
                  if (!base) continue;
                  const changed: Record<string, OverlayValue> = {};
                  for (const [k, raw] of Object.entries(u.fields)) {
                    const v = normalize(localized(raw, locale));
                    if (k in base.fields && isOverlayValue(v) && JSON.stringify(v) !== JSON.stringify(normalize(base.fields[k]))) changed[k] = v;
                  }
                  edits.push({ id: base.id, locale: base.locale, fields: changed });
                }
                if (edits.length) send(edits);
              },
            }),
          );
        });
      }
    } catch (e) {
      // Opened outside a supported parent (e.g. the preview URL in a bare tab): the page still renders, without click-to-edit.
      console.warn("Live Preview not started:", e instanceof Error ? e.message : e);
    }
    return () => {
      cancelled = true;
      clearTimeout(timer);
      unsubscribe.forEach((u) => u());
    };
  }, [locale, space, environment]);

  return null;
}
