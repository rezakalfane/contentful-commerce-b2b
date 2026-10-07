import { NextResponse, type NextRequest } from "next/server";
import { getCatalogAlternates } from "@/lib/bigcommerce";
import { CATALOG_ROOT, DEFAULT_LOCALE, isLocale, localeOfCatalogRoot, localePath, stripLocale, type Locale } from "@/lib/i18n";

/**
 * Language switch for catalog pages, whose URLs are translated (/products/..., /fr/produits/...).
 * `?to=fr&path=/products/automotive-batteries/car-batteries` finds the page's path in French through BigCommerce's `locales`
 * and redirects there, keeping the other query parameters. Falls back to the target language's catalog root.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const to = searchParams.get("to") ?? "";
  const path = searchParams.get("path") ?? "";
  if (!isLocale(to) || !path.startsWith("/")) return new NextResponse("Bad request", { status: 400 });

  const from: Locale = path.match(/^\/([a-z]{2})(\/|$)/) && isLocale(path.split("/")[1]) ? (path.split("/")[1] as Locale) : DEFAULT_LOCALE;
  const base = stripLocale(path);
  const root = base.split("/")[1] ?? "";

  let target: string | undefined;
  if (localeOfCatalogRoot(root) === from) {
    const alternates = await getCatalogAlternates(`${base.replace(/\/+$/, "")}/`, from);
    target = alternates?.[to]?.replace(/\/+$/, "");
  }
  target ??= localePath(to, `/${CATALOG_ROOT[to]}`);

  const url = new URL(target, request.url);
  searchParams.forEach((v, k) => {
    if (k !== "to" && k !== "path") url.searchParams.append(k, v);
  });
  return NextResponse.redirect(url, 307);
}
