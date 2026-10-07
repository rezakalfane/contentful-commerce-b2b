"use server";

import { refresh } from "next/cache";
import type { Locale } from "@/lib/i18n";
import { previewGate } from "@/providers/cms/gates";
import { clearDraftCache, getBaseline, isLinkValue, isOverlayValue, setOverlay, type OverlayValue, type PreviewEntity } from "./client";

export type PreviewEdit = { id: string; locale: string; fields: Record<string, OverlayValue> };

const ID = /^[A-Za-z0-9_-]{1,64}$/;
const FIELD = /^[A-Za-z][A-Za-z0-9]{0,63}$/;
const LOCALE = /^[a-z]{2}(-[A-Za-z]{2})?$/;

/** The same secret the content preview URL carries (`cf_preview`), verified by the same gate as the page itself. */
const allowed = (secret: string) => previewGate(new URLSearchParams({ cf_preview: secret }));

/**
 * The saved draft values of the entries tagged on the page, which the Live Preview client compares the editor's unsaved values with.
 * Only callable with the preview secret.
 */
export async function previewBaseline(secret: string, ids: string[], locale: Locale): Promise<PreviewEntity[]> {
  if (!allowed(secret) || !Array.isArray(ids)) return [];
  return getBaseline(ids.filter((id) => ID.test(id)), locale);
}

/**
 * Stores the unsaved values the editor is typing, so the next render of the preview shows them, and re-renders the open page in the
 * same response (`refresh()`). Only callable with the preview secret; only text, numbers, booleans, lists and rich text documents of
 * limited size; the values are only ever read for draft requests. `saved` is set when the editor saved an entry: the draft cache is
 * emptied so the page reads the saved values.
 */
export async function updatePreviewOverlay(secret: string, edits: PreviewEdit[], saved = false): Promise<boolean> {
  if (!allowed(secret)) return false;
  for (const e of edits.slice(0, 100)) {
    if (!ID.test(e.id) || !LOCALE.test(e.locale)) continue;
    const fields: Record<string, OverlayValue> = {};
    for (const [k, v] of Object.entries(e.fields ?? {})) {
      if (!FIELD.test(k) || !isOverlayValue(v) || JSON.stringify(v).length > 200_000) continue;
      const links = Array.isArray(v) ? v.filter(isLinkValue) : isLinkValue(v) ? [v] : [];
      if (links.some((l) => !ID.test(l.sys.id))) continue;
      fields[k] = v;
    }
    setOverlay(e.id, e.locale, fields);
  }
  if (saved) clearDraftCache();
  refresh();
  return true;
}
