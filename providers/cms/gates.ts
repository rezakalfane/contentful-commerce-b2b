import { timingSafeEqual } from "node:crypto";

/**
 * Draft gate: does this request carry the editor's preview credentials? Run by `proxy.ts`, which then sets the trusted `x-preview`
 * header. The content preview URL carries `cf_preview=<secret>`; a bare flag never unlocks drafts in production. In local
 * development the flag alone is enough.
 */
export function previewGate(params: URLSearchParams): boolean {
  const value = params.get("cf_preview");
  if (!value) return false;
  if (process.env.NODE_ENV !== "production") return true;
  const secret = process.env.CONTENTFUL_PREVIEW_SECRET ?? "";
  const a = Buffer.from(value);
  const b = Buffer.from(secret);
  return !!secret && a.length === b.length && timingSafeEqual(a, b);
}
