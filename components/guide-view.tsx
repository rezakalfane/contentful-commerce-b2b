import Image from "next/image";
import { tag } from "@/core/edit";
import Link from "next/link";
import { FaqItem } from "@/components/faq-list";
import { formatPrice, getBcProducts, productHref } from "@/lib/bigcommerce";
import type { Guide } from "@/lib/content";
import { audienceLabel, getMessages, localePath, type Locale } from "@/lib/i18n";

/** A step-by-step buying guide with checklist, recommended BigCommerce products and related FAQs. */
export async function GuideView({ guide, locale }: { guide: Guide; locale: Locale }) {
  const t = getMessages(locale);
  const author = guide.author;
  const products = await getBcProducts(guide.recommendedProducts.map((p) => p.bcProductId), locale);

  return (
    <article className="page py-10 md:py-14">
      <Link href={localePath(locale, "/guides")} className="text-sm font-medium text-slate underline decoration-line decoration-2 underline-offset-4 hover:decoration-amber">
        {t.backToGuides}
      </Link>
      <h1 {...tag(guide, "title")} className="mt-6 max-w-[20ch] text-balance">
        {guide.title}
      </h1>
      <p {...tag(guide, "summary")} className="mt-5 max-w-[60ch] text-lg text-slate">
        {guide.summary}
      </p>
      <p className="meta mt-5">
        {guide.audience && <span>{audienceLabel(locale, guide.audience)}</span>}
        {guide.readMinutes ? (
          <span>
            {guide.readMinutes} {t.minRead}
          </span>
        ) : null}
        {author && (
          <span>
            {t.by} {author.name}
          </span>
        )}
      </p>

      {guide.image && (
        <div {...tag(guide, "image")} className="mt-10 overflow-hidden rounded-[4px] bg-bench">
          <Image src={guide.image.url} alt="" width={1600} height={600} priority className="aspect-[8/3] w-full object-cover" />
        </div>
      )}

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_20rem]">
        <div>
          {/* The steps are a real sequence, so they are numbered. */}
          <ol {...tag(guide, "steps")} className="space-y-10">
            {guide.steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[2.25rem_1fr] gap-4">
                <span aria-hidden className="font-display text-3xl font-extrabold leading-none text-ink [font-stretch:88%]">
                  {i + 1}
                </span>
                <div>
                  <h2 {...tag(s, "title")} className="text-[1.5rem]">
                    {s.title}
                  </h2>
                  <p {...tag(s, "body")} className="mt-3 max-w-[62ch] text-slate">
                    {s.body}
                  </p>
                  {s.proTip && (
                    <p {...tag(s, "proTip")} className="mt-4 max-w-[62ch] border-l-[3px] border-amber py-1 pl-4 text-[0.95rem]">
                      <strong>{t.proTip}</strong> {s.proTip}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {guide.relatedFaqs.length ? (
            <section className="mt-16">
              <h2 className="mb-4 text-[1.75rem]">{t.relatedQuestions}</h2>
              <div className="border-t border-line">
                {guide.relatedFaqs.map((f) => (
                  <FaqItem key={f.id} faq={f} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-10 lg:sticky lg:top-6 lg:self-start">
          {guide.checklist.length ? (
            <section className="rounded-[4px] bg-bench p-5">
              <h2 className="font-sans text-base font-semibold tracking-normal [font-stretch:100%]">{t.beforeYouOrder}</h2>
              <ul {...tag(guide, "checklist")} className="mt-4 space-y-2.5 text-[0.95rem]">
                {guide.checklist.map((c) => (
                  <li key={c} className="flex gap-2.5">
                    <span aria-hidden className="mt-[0.45rem] h-2 w-2 shrink-0 rounded-[1px] bg-amber" />
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {guide.recommendedProducts.length ? (
            <section>
              <h2 className="mb-4 font-sans text-base font-semibold tracking-normal [font-stretch:100%]">{t.recommendedProducts}</h2>
              <ul className="divide-y divide-line border-y border-line">
                {guide.recommendedProducts.map(({ bcProductId: id, sku: fallbackSku }) => {
                  const p = products.get(id);
                  const sku = p?.sku ?? fallbackSku;
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
