import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditSupport } from "@/components/edit-support";
import { GuideCard } from "@/components/guide-card";
import { Hero } from "@/components/hero";
import { previewParams } from "@/lib/contentful";
import { alternatesFor, getMessages, isLocale } from "@/lib/i18n";
import { getGuides, getPage } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/guides">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const page = await getPage(locale, "/guides");
  return {
    title: page?.title ?? getMessages(locale).buyingGuides,
    description: page?.description,
    alternates: alternatesFor(locale, "/guides"),
  };
}

export default async function GuidesPage({ params, searchParams }: PageProps<"/[locale]/guides">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);
  const preview = previewParams(await searchParams);
  const [page, guides] = await Promise.all([getPage(locale, "/guides", preview), getGuides(locale, preview)]);
  const hero = page?.hero?.[0];

  return (
    <>
      <EditSupport preview={preview} entry={page} />
      {hero ? (
        <Hero hero={hero} locale={locale} />
      ) : (
        <div className="page pt-14">
          <h1>{t.buyingGuides}</h1>
        </div>
      )}

      <div className="page section">
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
          {guides.map((g) => (
            <GuideCard key={g.uid} guide={g} locale={locale} />
          ))}
        </div>
      </div>
    </>
  );
}
