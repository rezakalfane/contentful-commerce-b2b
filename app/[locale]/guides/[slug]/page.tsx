import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideContent } from "@/components/page-content";
import { getGuide } from "@/lib/content";
import { alternatesFor, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/guides/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const guide = await getGuide(slug, locale);
  return guide ? { title: guide.title, description: guide.summary, alternates: alternatesFor(locale, `/guides/${slug}`) } : {};
}

export default async function GuidePage({ params }: PageProps<"/[locale]/guides/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  if (!(await getGuide(slug, locale))) notFound();
  return <GuideContent slug={slug} locale={locale} />;
}
