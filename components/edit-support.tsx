import { EditSupport as Contentful } from "@/providers/cms/contentful/edit-support";
import { isPreviewRequest } from "@/lib/request";

/**
 * Loads Contentful's Live Preview SDK, only for requests the proxy verified as an editor's preview (x-preview). Click-to-edit works
 * from the edit attributes in the HTML (`$` on the content, see core/edit.ts); the SDK adds live updates on top.
 */
export async function EditSupport() {
  return (await isPreviewRequest()) ? <Contentful /> : null;
}
