import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { Plp } from "@/components/plp";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import {
  formatPrice,
  getCategoryByPath,
  getCategoryTree,
  getProductByPath,
  parseCatalogParams,
  searchCatalog,
  productHref,
  type CategoryNode,
} from "@/lib/bigcommerce";
import {
  alternatesFromPaths,
  CATALOG_ROOT,
  fill,
  getMessages,
  isLocale,
  localePath,
  translateSpec,
  type Locale,
} from "@/lib/i18n";
import { ensureCatalogRoot, requestedCatalogRoot } from "@/lib/catalog-route";
import { getGuides, getSpotlights } from "@/lib/content";

// The route is /[locale]/[root]/...: the BigCommerce path ("/products/<category>/<slug>/", "/produits/<categorie>/<slug>/") is rebuilt here.
const bcPath = (root: string, slug: string[]) => `/${root}/${slug.join("/")}/`;
// Categories are at most two levels deep; product pages are always deeper.
const looksLikeCategory = (slug: string[]) => slug.length <= 2;

export async function generateMetadata({ params }: PageProps<"/[locale]/products/[...slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const root = await requestedCatalogRoot();
  if (!isLocale(locale) || root !== CATALOG_ROOT[locale]) return {};
  if (looksLikeCategory(slug)) {
    const cat = await getCategoryByPath(bcPath(root, slug), locale);
    if (cat) return { title: cat.name, alternates: alternatesFromPaths(locale, cat.alternates) };
  }
  const product = await getProductByPath(bcPath(root, slug), locale);
  if (!product) return { title: getMessages(locale).productNotFound };
  return {
    title: product.name,
    description: product.plainDescription,
    alternates: alternatesFromPaths(locale, product.alternates),
    openGraph: { title: product.name, description: product.plainDescription, images: product.image ? [product.image.url] : [] },
  };
}

export default async function CatalogPage({ params, searchParams }: PageProps<"/[locale]/products/[...slug]">) {
  const { locale, slug } = await params;
  const root = await requestedCatalogRoot();
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  if (!(await ensureCatalogRoot(locale, root, slug, sp))) notFound();

  if (looksLikeCategory(slug)) {
    const view = await CategoryView({ locale, root, slug, sp });
    if (view) return view;
  }
  return ProductView({ locale, root, slug });
}

// ---------------------------------------------------------------- category
function findNode(nodes: CategoryNode[], path: string): CategoryNode | undefined {
  for (const n of nodes) {
    if (n.path === path) return n;
    const hit = findNode(n.children, path);
    if (hit) return hit;
  }
}

async function CategoryView({ locale, root, slug, sp }: { locale: Locale; root: string; slug: string[]; sp: Record<string, string | string[] | undefined> }) {
  const t = getMessages(locale);
  const path = bcPath(root, slug);
  const [cat, tree] = await Promise.all([getCategoryByPath(path, locale), getCategoryTree(locale)]);
  if (!cat) return null;

  // A category lists the products of all its subcategories (its own product list is often empty).
  const query = parseCatalogParams(sp);
  const result = await searchCatalog(locale, { ...query, categoryEntityId: cat.entityId });
  const children = findNode(tree, path)?.children ?? [];

  return (
    <div className="page py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap gap-x-2 text-sm text-slate">
        <Link href={localePath(locale, "/")} className="hover:text-ink hover:underline">{t.home}</Link>
        <span aria-hidden>/</span>
        <Link href={localePath(locale, "/products")} className="hover:text-ink hover:underline">{t.products}</Link>
        {cat.breadcrumbs.slice(1).map((c) => (
          <span key={c.path} className="flex gap-2">
            <span aria-hidden>/</span>
            {c.path === cat.path ? (
              <span className="text-ink">{c.name}</span>
            ) : (
              <Link href={localePath(locale, productHref(c.path))} className="hover:text-ink hover:underline">{c.name}</Link>
            )}
          </span>
        ))}
      </nav>

      <h1>{cat.name}</h1>
      {cat.descriptionHtml && (
        <div className="rte mt-4 text-lg text-slate" dangerouslySetInnerHTML={{ __html: cat.descriptionHtml }} />
      )}

      {children.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-2">
          {children.map((c) => (
            <li key={c.path}>
              <Link
                href={localePath(locale, productHref(c.path))}
                className="inline-block rounded-full border-[1.5px] border-line px-4 py-1.5 text-[0.95rem] font-medium hover:border-ink"
              >
                {c.name}
                <span className="ml-2 text-slate">{c.productCount}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Plp locale={locale} basePath={`/${root}/${slug.join("/")}`} result={result} params={query} />
    </div>
  );
}

// ---------------------------------------------------------------- product
// The few specs worth surfacing next to the price; the rest are in the full table below.
const HIGHLIGHT = ["Voltage", "Capacity (Ah)", "CCA", "Technology", "Warranty"];

async function ProductView({ locale, root, slug }: { locale: Locale; root: string; slug: string[] }) {
  const t = getMessages(locale);
  const product = await getProductByPath(bcPath(root, slug), locale);
  if (!product) notFound();

  const [spotlights, guides] = await Promise.all([getSpotlights(locale), getGuides(locale)]);
  const spotlight = spotlights.find((s) => s.bcProductId === product.entityId);
  const relatedGuides = guides.filter((g) => g.recommendedProducts.some((p) => p.bcProductId === product.entityId));

  const specs = product.specs.map((s) => translateSpec(locale, s.name, s.value));
  const highlights = HIGHLIGHT.map((n) => product.specs.find((s) => s.key === n))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => translateSpec(locale, s.name, s.value));

  const hasSale = product.salePrice && product.price && product.salePrice.value < product.price.value;
  const current = hasSale ? product.salePrice : product.price;
  const was = hasSale
    ? product.price
    : product.retailPrice && product.price && product.retailPrice.value > product.price.value
      ? product.retailPrice
      : undefined;
  const inStock = product.inStock !== false && product.availability !== "Unavailable";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    mpn: product.mpn,
    gtin: product.gtin,
    description: product.plainDescription,
    image: product.images.map((i) => i.url),
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: current && {
      "@type": "Offer",
      price: current.value,
      priceCurrency: current.currencyCode,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <article className="page py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-x-2 text-sm text-slate">
        <Link href={localePath(locale, "/")} className="hover:text-ink hover:underline">{t.home}</Link>
        <span aria-hidden>/</span>
        <Link href={localePath(locale, "/products")} className="hover:text-ink hover:underline">{t.products}</Link>
        {product.breadcrumbs.slice(1).map((c) => (
          <span key={c.path} className="flex gap-2">
            <span aria-hidden>/</span>
            <Link href={localePath(locale, productHref(c.path))} className="hover:text-ink hover:underline">
              {c.name}
            </Link>
          </span>
        ))}
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr]">
        <ProductGallery images={product.images} name={product.name} label={t.viewImage} />

        <div className="space-y-7">
          <header>
            {product.brand && <p className="text-[0.95rem] font-medium text-slate">{product.brand}</p>}
            <h1 className="mt-1 text-[2rem] leading-[1.1] md:text-[2.5rem]">{product.name}</h1>
            <p className="meta mt-3">
              <span>
                {t.sku} {product.sku}
              </span>
              {product.mpn && (
                <span>
                  {t.mpn} {product.mpn}
                </span>
              )}
            </p>
          </header>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="font-display text-[2.75rem] font-extrabold leading-none [font-stretch:88%]">
              {formatPrice(locale, current)}
            </span>
            {was && <span className="text-lg text-slate line-through">{formatPrice(locale, was)}</span>}
            <span className={`flex items-center gap-2 text-[0.95rem] font-semibold ${inStock ? "text-stock" : "text-red-700"}`}>
              <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${inStock ? "bg-stock" : "bg-red-700"}`} />
              {inStock ? t.inStock : t.outOfStock}
            </span>
          </div>

          {spotlight && (
            <p className="border-l-[3px] border-amber py-1 pl-4 font-medium">{spotlight.tagline}</p>
          )}

          {highlights.length > 0 && (
            <dl className="flex flex-wrap gap-x-9 gap-y-4">
              {highlights.map((h) => (
                <div key={h.name} className="border-l-[3px] border-line pl-3">
                  <dt className="text-sm text-slate">{h.name}</dt>
                  <dd className="font-semibold">{h.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <AddToCart
            productId={product.entityId}
            inStock={inStock}
            min={product.minQty ?? 1}
            max={product.maxQty}
            cartHref={localePath(locale, "/cart")}
            labels={{
              quantity: t.quantity,
              addToCart: t.addToCart,
              adding: t.adding,
              addedToCart: t.addedToCart,
              viewCart: t.viewCart,
              error: t.errorGeneric,
              outOfStock: t.outOfStock,
            }}
          />

          {product.bulkPricing.length > 0 && (
            <section>
              <h2 className="mb-2 font-sans text-base font-semibold tracking-normal [font-stretch:100%]">{t.volumePricing}</h2>
              <table className="w-full text-[0.95rem]">
                <tbody className="divide-y divide-line border-y border-line">
                  {product.bulkPricing.map((b) => (
                    <tr key={b.min}>
                      <td className="py-2.5">{fill(t.buyXOrMore, { min: b.min })}</td>
                      <td className="py-2.5 text-right font-semibold">
                        {b.price != null && current
                          ? `${formatPrice(locale, { value: b.price, currencyCode: current.currencyCode })} ${t.eachPrice}`
                          : b.percentOff != null
                            ? `−${b.percentOff}%`
                            : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </div>

      <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_21rem]">
        <div className="space-y-14">
          {product.descriptionHtml && (
            <section>
              <h2 className="mb-5 text-[1.75rem]">{t.description}</h2>
              <div className="rte text-slate" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
            </section>
          )}

          {spotlight?.useCases.length ? (
            <section>
              <h2 className="mb-5 text-[1.75rem]">{t.bestFor}</h2>
              <ul className="divide-y divide-line border-y border-line">
                {spotlight.useCases.map((u) => (
                  <li key={u.title} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-8">
                    <h3>{u.title}</h3>
                    {u.description && <p className="text-slate">{u.description}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {(specs.length > 0 || product.weight) && (
          <section className="h-fit rounded-[4px] bg-bench p-6">
            <h2 className="mb-4 font-sans text-base font-semibold tracking-normal [font-stretch:100%]">{t.specifications}</h2>
            <dl className="divide-y divide-line text-[0.95rem]">
              {specs.map((s) => (
                <div key={s.name} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-slate">{s.name}</dt>
                  <dd className="text-right font-semibold">{s.value}</dd>
                </div>
              ))}
              {product.weight && (
                <div className="flex justify-between gap-4 py-2.5">
                  <dt className="text-slate">{t.weight}</dt>
                  <dd className="text-right font-semibold">
                    {product.weight.value} {product.weight.unit}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        )}
      </div>

      {relatedGuides.length > 0 && (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="mb-8">{t.guidesFeaturing}</h2>
          <div className="grid gap-x-8 gap-y-10 md:grid-cols-3">
            {relatedGuides.map((g) => (
              <Link key={g.id} href={localePath(locale, g.url)} className="group block">
                {g.image && (
                  <div className="overflow-hidden rounded-[4px] bg-bench">
                    <Image src={g.image.url} alt="" width={800} height={450} className="aspect-video w-full object-cover" />
                  </div>
                )}
                <h3 className="mt-4 text-lg font-semibold underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-amber">
                  {g.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[0.95rem] text-slate">{g.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {product.related.length > 0 && (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="mb-8">{t.relatedProducts}</h2>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {product.related.map((p) => (
              <ProductCard key={p.entityId} product={p} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
