import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditSupport } from "@/components/edit-support";
import { FaqItem } from "@/components/faq-list";
import { Hero } from "@/components/hero";
import { previewParams } from "@/lib/contentful";
import { alternatesFor, isLocale, topicLabel } from "@/lib/i18n";
import { getFaqs, getPage } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/faq">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const page = await getPage(locale, "/faq");
  return { title: page?.title ?? "FAQ", description: page?.description, alternates: alternatesFor(locale, "/faq") };
}

export default async function FaqPage({ params, searchParams }: PageProps<"/[locale]/faq">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const preview = previewParams(await searchParams);
  const [page, faqs] = await Promise.all([getPage(locale, "/faq", preview), getFaqs(locale, preview)]);

  // Keep topics in the order they first appear (entries are sorted by sort_order).
  const topics = [...new Set(faqs.map((f) => f.topic))];
  const hero = page?.hero?.[0];

  return (
    <>
      <EditSupport preview={preview} entry={page} />
      {hero ? (
        <Hero hero={hero} locale={locale} />
      ) : (
        <div className="page pt-14">
          <h1>{page?.title ?? "FAQ"}</h1>
        </div>
      )}

      <div className="page section space-y-14">
        {topics.map((topic) => (
          <section key={topic} className="grid gap-4 border-t border-line pt-8 lg:grid-cols-[15rem_1fr] lg:gap-14">
            <h2 className="text-[1.6rem]">{topicLabel(locale, topic)}</h2>
            <div>
              {faqs
                .filter((f) => f.topic === topic)
                .map((f) => (
                  <FaqItem key={f.uid} faq={f} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
