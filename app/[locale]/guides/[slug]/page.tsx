import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditSupport } from "@/components/edit-support";
import { FaqItem } from "@/components/faq-list";
import { formatPrice, getBcProducts, productHref } from "@/lib/bigcommerce";
import { previewParams } from "@/lib/contentful";
import { alternatesFor, audienceLabel, getMessages, isLocale, localePath } from "@/lib/i18n";
import { getGuide } from "@/lib/site";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/[locale]/guides/[slug]">): Promise<Metadata> {
  const [{ locale, slug }, sp] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) return {};
  const guide = await getGuide(locale, slug, previewParams(sp));
  return guide
    ? { title: guide.title, description: guide.summary, alternates: alternatesFor(locale, `/guides/${slug}`) }
    : {};
}

export default async function GuidePage({ params, searchParams }: PageProps<"/[locale]/guides/[slug]">) {
  const [{ locale, slug }, sp] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);
  const preview = previewParams(sp);
  const guide = await getGuide(locale, slug, preview);
  if (!guide) notFound();

  const author = guide.author?.[0];
  const products = await getBcProducts(guide.recommended_bc_products ?? [], locale);

  return (
    <article className="page py-10 md:py-14">
      <EditSupport preview={preview} entry={guide} />

      <Link href={localePath(locale, "/guides")} className="text-sm font-medium text-slate underline decoration-line decoration-2 underline-offset-4 hover:decoration-amber">
        {t.backToGuides}
      </Link>
      <h1 {...(guide.$?.title ?? {})} className="mt-6 max-w-[20ch] text-balance">
        {guide.title}
      </h1>
      <p {...(guide.$?.summary ?? {})} className="mt-5 max-w-[60ch] text-lg text-slate">
        {guide.summary}
      </p>
      <p className="meta mt-5">
        {guide.audience && <span>{audienceLabel(locale, guide.audience)}</span>}
        {guide.read_minutes ? (
          <span>
            {guide.read_minutes} {t.minRead}
          </span>
        ) : null}
        {author && (
          <span>
            {t.by} {author.title}
          </span>
        )}
      </p>

      {guide.hero_image && (
        <div {...(guide.$?.hero_image ?? {})} className="mt-10 overflow-hidden rounded-[4px] bg-bench">
          <Image src={guide.hero_image.url} alt="" width={1600} height={600} priority className="aspect-[8/3] w-full object-cover" />
        </div>
      )}

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_20rem]">
        <div>
          {/* The steps are a real sequence, so they are numbered. */}
          <ol {...(guide.$?.steps__parent ?? {})} className="space-y-10">
            {guide.steps?.map((s, i) => (
              <li key={s.step_title} className="grid grid-cols-[2.25rem_1fr] gap-4">
                <span aria-hidden className="font-display text-3xl font-extrabold leading-none text-ink [font-stretch:88%]">
                  {i + 1}
                </span>
                <div>
                  <h2 {...(s.$?.step_title ?? {})} className="text-[1.5rem]">
                    {s.step_title}
                  </h2>
                  <p {...(s.$?.step_body ?? {})} className="mt-3 max-w-[62ch] text-slate">
                    {s.step_body}
                  </p>
                  {s.pro_tip && (
                    <p {...(s.$?.pro_tip ?? {})} className="mt-4 max-w-[62ch] border-l-[3px] border-amber py-1 pl-4 text-[0.95rem]">
                      <strong>{t.proTip}</strong> {s.pro_tip}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {guide.related_faqs?.length ? (
            <section className="mt-16">
              <h2 className="mb-4 text-[1.75rem]">{t.relatedQuestions}</h2>
              <div className="border-t border-line">
                {guide.related_faqs.map((f) => (
                  <FaqItem key={f.uid} faq={f} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-10 lg:sticky lg:top-6 lg:self-start">
          {guide.checklist?.length ? (
            <section className="rounded-[4px] bg-bench p-5">
              <h2 className="font-sans text-base font-semibold tracking-normal [font-stretch:100%]">{t.beforeYouOrder}</h2>
              <ul {...(guide.$?.checklist__parent ?? {})} className="mt-4 space-y-2.5 text-[0.95rem]">
                {guide.checklist.map((c, i) => (
                  <li key={c} {...(guide.$?.[`checklist__${i}`] ?? {})} className="flex gap-2.5">
                    <span aria-hidden className="mt-[0.45rem] h-2 w-2 shrink-0 rounded-[1px] bg-amber" />
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {guide.recommended_bc_products?.length ? (
            <section>
              <h2 className="mb-4 font-sans text-base font-semibold tracking-normal [font-stretch:100%]">{t.recommendedProducts}</h2>
              <ul className="divide-y divide-line border-y border-line">
                {guide.recommended_bc_products.map((id, i) => {
                  const p = products.get(id);
                  const sku = p?.sku ?? guide.recommended_skus?.[i];
                  const row = (
                    <>
                      <div className="h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[4px] bg-bench">
                        {p?.image && (
                          <Image src={p.image.url} alt={p.image.altText || p.name} width={144} height={144} className="h-full w-full object-contain p-1.5 mix-blend-multiply" />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="line-clamp-2 text-[0.9rem] font-semibold leading-snug group-hover:underline group-hover:decoration-amber group-hover:decoration-2">
                          {p?.name ?? sku}
                        </span>
                        <span className="mt-auto flex items-baseline justify-between pt-1">
                          <span className="text-xs text-slate">
                            {t.sku} {sku}
                          </span>
                          {p?.price && <span className="font-bold">{formatPrice(locale, p.price)}</span>}
                        </span>
                      </div>
                    </>
                  );
                  return (
                    <li key={id}>
                      {p ? (
                        <Link href={localePath(locale, productHref(p.path))} className="group flex gap-3 py-3">
                          {row}
                        </Link>
                      ) : (
                        <div className="flex gap-3 py-3">{row}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
