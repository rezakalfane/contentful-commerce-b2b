import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContent } from "@/components/page-content";
import { getPage } from "@/lib/content";
import { alternatesFor, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const page = await getPage("home", locale);
  return { description: page?.description, alternates: alternatesFor(locale, "/") };
}

/** The home page is the Page with delivery key `home`. */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const page = await getPage("home", locale);
  if (!page) notFound();
  return <PageContent pageKey="home" locale={locale} />;
}
