import Image from "next/image";
import { tag } from "@/core/edit";
import Link from "next/link";
import type { Guide } from "@/lib/content";
import { audienceLabel, getMessages, localePath, type Locale } from "@/lib/i18n";

export function GuideCard({ guide, locale }: { guide: Guide; locale: Locale }) {
  const t = getMessages(locale);
  return (
    <article className="group">
      <Link href={localePath(locale, guide.url)} className="block">
        {guide.image && (
          <div {...tag(guide, "image")} className="overflow-hidden rounded-[4px] bg-bench">
            <Image
              src={guide.image.url}
              alt=""
              width={800}
              height={450}
              className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <h3 {...tag(guide, "title")} className="mt-4 text-lg font-semibold leading-snug underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-amber">
          {guide.title}
        </h3>
      </Link>
      <p {...tag(guide, "summary")} className="mt-2 line-clamp-3 text-[0.95rem] text-slate">{guide.summary}</p>
      <p className="meta mt-3">
        {guide.audience && <span>{audienceLabel(locale, guide.audience)}</span>}
        {guide.readMinutes ? (
          <span>
            {guide.readMinutes} {t.minRead}
          </span>
        ) : null}
      </p>
    </article>
  );
}
