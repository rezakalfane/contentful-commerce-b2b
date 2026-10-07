import { SPACE_ID, type PreviewParams } from "@/lib/contentful";
import { LivePreview } from "./live-preview";

/**
 * Loads the Contentful Live Preview SDK for the entry a page renders, only when the page is opened from Contentful's content
 * preview. Click-to-edit works from the `data-contentful-*` attributes in the HTML (see `editTags`); saving an entry refreshes the page.
 */
export function EditSupport({ preview, entry }: { preview?: PreviewParams; entry?: { id: string } }) {
  if (!preview || !entry) return null;
  return <LivePreview space={SPACE_ID} environment={process.env.CONTENTFUL_ENVIRONMENT || "master"} />;
}
