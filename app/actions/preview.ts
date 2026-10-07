"use server";

import { previewParams, setOverlay } from "@/lib/contentful";

export type PreviewEdit = { id: string; locale: string; fields: Record<string, string> };

const ID = /^[A-Za-z0-9_-]{1,64}$/;
const FIELD = /^[A-Za-z][A-Za-z0-9]{0,63}$/;
const LOCALE = /^[a-z]{2}(-[A-Za-z]{2})?$/;

/**
 * Stores the unsaved text the editor is typing, so the next render of the preview shows it. Only callable with the same preview
 * secret as the page itself (`cf_preview`), and only plain text of limited size; the values are only ever read for draft requests.
 */
export async function updatePreviewOverlay(cfPreview: string, edits: PreviewEdit[]): Promise<boolean> {
  if (!previewParams({ cf_preview: cfPreview })) return false;
  for (const e of edits.slice(0, 100)) {
    if (!ID.test(e.id) || !LOCALE.test(e.locale)) continue;
    const fields: Record<string, string> = {};
    for (const [k, v] of Object.entries(e.fields ?? {})) if (FIELD.test(k) && typeof v === "string" && v.length <= 20_000) fields[k] = v;
    setOverlay(e.id, e.locale, fields);
  }
  return true;
}
