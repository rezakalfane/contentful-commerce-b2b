import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryTiles } from "@/components/category-tiles";
import { EditSupport } from "@/components/edit-support";
import { GuideCard } from "@/components/guide-card";
import { Hero } from "@/components/hero";
import { SpotlightCard } from "@/components/spotlight-card";
import { getBcProducts } from "@/lib/bigcommerce";
import { previewParams } from "@/lib/contentful";
import { alternatesFor, getMessages, isLocale, localePath } from "@/lib/i18n";
import { getGuides, getHomePage, getSpotlights } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const home = await getHomePage(locale);
  return { description: home?.description, alternates: alternatesFor(locale, "/") };
}

export default async function Home({ params, searchParams }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);
  const preview = previewParams(await searchParams);
  const [home, spotlights, guides] = await Promise.all([
    getHomePage(locale, preview),
    getSpotlights(locale, preview),
    getGuides(locale, preview),
  ]);
  const featured = spotlights.filter((s) => s.is_featured).slice(0, 3);
  const products = await getBcProducts(featured.map((s) => s.bc_product_id), locale);
  const hero = home?.hero?.[0];

  return (
    <>
      <EditSupport preview={preview} entry={home} />

      {hero ? (
        <Hero
          hero={hero}
          locale={locale}
          variant="home"
          secondImage={home?.image}
          secondImageTags={home?.$?.image}
          secondaryCta={{ label: t.allProducts, href: "/products" }}
        />
      ) : (
        <section className="page py-16">
          <h1>{home?.title ?? "Commerce B2B"}</h1>
        </section>
      )}

      {home?.rich_text && (
        <div className="page pb-4">
          <div {...(home.$?.rich_text ?? {})} className="rte text-lg text-slate" dangerouslySetInnerHTML={{ __html: home.rich_text }} />
        </div>
      )}

      <section className="page section">
        <h2 className="mb-8">{t.shopByCategory}</h2>
        <CategoryTiles locale={locale} />
      </section>

      {home?.blocks?.length ? (
        <section className="band section">
          <div {...(home?.$?.blocks__parent ?? {})} className="page space-y-16 md:space-y-24">
            {home.blocks.map(({ block }) => (
              <div
                key={block.title}
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${block.layout === "image_right" ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                {block.image && (
                  <div {...(block.$?.image ?? {})} className="overflow-hidden rounded-[4px] bg-line">
                    <Image src={block.image.url} alt="" width={1200} height={800} className="aspect-[3/2] w-full object-cover" />
                  </div>
                )}
                <div>
                  <h2 {...(block.$?.title ?? {})} className="text-[2rem]">
                    {block.title}
                  </h2>
                  <div {...(block.$?.copy ?? {})} className="rte mt-4 text-slate" dangerouslySetInnerHTML={{ __html: block.copy }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {featured.length > 0 && (
        <section className="page section">
          <h2 className="mb-8">{t.tradeFavourites}</h2>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <SpotlightCard key={s.uid} item={s} product={products.get(s.bc_product_id)} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section className="band section">
          <div className="page">
            <div className="mb-8 flex items-end justify-between gap-6">
              <h2>{t.fromGuides}</h2>
              <Link href={localePath(locale, "/guides")} className="hidden font-semibold underline decoration-amber decoration-2 underline-offset-4 sm:block">
                {t.buyingGuides}
              </Link>
            </div>
            <div className="grid gap-x-8 gap-y-10 md:grid-cols-3">
              {guides.slice(0, 3).map((g) => (
                <GuideCard key={g.uid} guide={g} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
