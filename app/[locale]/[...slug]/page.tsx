import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContent } from "@/components/page-content";
import { getPage } from "@/lib/content";
import { alternatesFor, isLocale } from "@/lib/i18n";

/**
 * Any Page an editor creates in Amplience is served here: the URL path is the Page's delivery key
 * (`/faq` -> `faq`, `/about/team` -> `about/team`). Routes with their own file (products, cart, blog posts,
 * guides) take precedence.
 */
export async function generateMetadata({ params }: PageProps<"/[locale]/[...slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = await getPage(slug.join("/"), locale);
  return page ? { title: page.title, description: page.description, alternates: alternatesFor(locale, `/${slug.join("/")}`) } : {};
}

export default async function ContentPage({ params, searchParams }: PageProps<"/[locale]/[...slug]">) {
  const [{ locale, slug }, sp] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  const path = `/${slug.join("/")}`;
  const page = await getPage(slug.join("/"), locale);
  if (!page) notFound();
  const q = typeof sp.q === "string" ? sp.q : "";
  return <PageContent pageKey={slug.join("/")} locale={locale} path={path} q={q} />;
}
