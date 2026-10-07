import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plp } from "@/components/plp";
import { getTileLinks, parseCatalogParams, searchCatalog } from "@/lib/bigcommerce";
import { ensureCatalogRoot } from "@/lib/catalog-route";
import { alternatesFromPaths, CATALOG_ROOT, categoryLabel, getMessages, isLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/[root]">): Promise<Metadata> {
  const { locale, root } = await params;
  if (!isLocale(locale) || root !== CATALOG_ROOT[locale]) return {};
  return {
    title: getMessages(locale).allProducts,
    alternates: alternatesFromPaths(locale, { en: localePath("en", "/products"), fr: localePath("fr", "/products") }),
  };
}

export default async function ProductsPage({ params, searchParams }: PageProps<"/[locale]/[root]">) {
  const { locale, root } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  if (!(await ensureCatalogRoot(locale, root, [], sp))) notFound();
  const t = getMessages(locale);
  const query = parseCatalogParams(sp);
  const [result, tiles] = await Promise.all([searchCatalog(locale, query), getTileLinks(locale)]);

  return (
    <div className="page py-10 md:py-14">
      <h1>{t.allProducts}</h1>
      <p className="mt-4 max-w-[52ch] text-lg text-slate">{t.productsIntro}</p>

      <nav aria-label={t.shopByCategory} className="mt-8 flex flex-wrap gap-2">
        {tiles.map((c) => (
          <Link
            key={c.path}
            href={c.href}
            className="rounded-full border-[1.5px] border-line px-4 py-1.5 text-[0.95rem] font-medium hover:border-ink"
          >
            {c.label ?? categoryLabel(locale, c.name)}
          </Link>
        ))}
      </nav>

      <Plp locale={locale} basePath={`/${root}`} result={result} params={query} />
    </div>
  );
}
