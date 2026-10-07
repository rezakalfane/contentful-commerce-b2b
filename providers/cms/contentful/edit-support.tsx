import { LivePreview } from "./live-preview";

/** Loads the Contentful Live Preview SDK (see ./live-preview.tsx). Rendered only for verified preview requests, see components/edit-support.tsx. */
export function EditSupport() {
  return <LivePreview space={process.env.CONTENTFUL_SPACE_ID ?? ""} environment={process.env.CONTENTFUL_ENVIRONMENT || "master"} />;
}
