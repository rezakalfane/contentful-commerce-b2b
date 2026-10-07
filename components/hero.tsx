import Image from "next/image";
import { tag } from "@/core/edit";
import Link from "next/link";
import type { Hero as HeroData } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";

type Props = {
  hero: HeroData;
  locale: Locale;
  secondaryCta?: { label: string; href: string };
};

/** Renders a `hero-banner` content item. The `home` variant shows the headline beside two staggered tall photos. */
export function Hero({ hero, locale, secondaryCta }: Props) {
  const cta = hero.cta;
  const copy = (
    <div className="max-w-[34rem]">
      <h1 {...tag(hero, "title")}>{hero.title}</h1>
      {hero.description && <p {...tag(hero, "description")} className="mt-5 text-lg text-slate">{hero.description}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        {cta?.href && (
          <Link href={localePath(locale, cta.href)} {...tag(hero, "cta")} className="btn btn-primary">
            {cta.label}
          </Link>
        )}
        {secondaryCta && (
          <Link href={localePath(locale, secondaryCta.href)} className="btn btn-outline">
            {secondaryCta.label}
          </Link>
        )}
      </div>
    </div>
  );

  if (hero.variant === "home") {
    return (
      <section className="page grid items-center gap-10 py-12 md:grid-cols-[1fr_1.15fr] md:gap-14 md:py-16">
        {copy}
        <div className="grid grid-cols-2 gap-4">
          {hero.image && (
            <div {...tag(hero, "image")} className="relative aspect-[3/4] overflow-hidden rounded-[4px] bg-bench">
              <Image src={hero.image.url} alt={hero.image.alt} fill priority sizes="(min-width: 1100px) 260px, 45vw" className="object-cover" />
            </div>
          )}
          {hero.secondImage && (
            <div {...tag(hero, "secondImage")} className="relative mt-12 aspect-[3/4] overflow-hidden rounded-[4px] bg-bench">
              <Image src={hero.secondImage.url} alt={hero.secondImage.alt} fill priority sizes="(min-width: 1100px) 260px, 45vw" className="object-cover" />
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="band">
      <div className="page grid items-center gap-10 py-12 md:grid-cols-[1.1fr_1fr] md:py-16">
        {copy}
        {hero.image && (
          <div {...tag(hero, "image")} className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-line">
            <Image src={hero.image.url} alt={hero.image.alt} fill priority sizes="(min-width: 1100px) 520px, 90vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
