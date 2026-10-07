import { permanentRedirect } from "next/navigation";
import { getCatalogAlternates } from "./bigcommerce";
import { CATALOG_ROOT, localeOfCatalogRoot, localePath, type Locale } from "./i18n";

type SearchParams = Record<string, string | string[] | undefined>;

const queryString = (sp: SearchParams) => {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) for (const x of Array.isArray(v) ? v : v === undefined ? [] : [v]) qs.append(k, x);
  const out = qs.toString();
  return out ? `?${out}` : "";
};

/**
 * The catalog route is `/[locale]/[root]/...`: the first segment is the language's own catalog root ("products", "produits").
 * Returns true when `root` is this language's root. Another language's root (an old or content-stored link such as
 * /fr/products/...) is redirected permanently to the same page in this language; anything else is not a catalog URL.
 */
export async function ensureCatalogRoot(locale: Locale, root: string, slug: string[], sp: SearchParams): Promise<boolean> {
  if (root === CATALOG_ROOT[locale]) return true;
  const from = localeOfCatalogRoot(root);
  if (!from) return false;
  if (!slug.length) permanentRedirect(localePath(locale, "/products") + queryString(sp));
  const alternates = await getCatalogAlternates(`/${root}/${slug.join("/")}/`, from);
  const target = alternates?.[locale];
  if (target) permanentRedirect(target.replace(/\/+$/, "") + queryString(sp));
  return false;
}
