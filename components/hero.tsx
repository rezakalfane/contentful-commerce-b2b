import Image from "next/image";
import Link from "next/link";
import type { Asset, HeroBanner } from "@/lib/blog";
import type { Tags } from "@/lib/edit";
import { localePath, type Locale } from "@/lib/i18n";

type Props = {
  hero: HeroBanner;
  locale: Locale;
  /** Home variant: headline beside two staggered tall photos. */
  variant?: "home" | "page";
  /** Second photo for the home variant. */
  secondImage?: Asset;
  /** Edit tags for the second photo (the `image` field of the home page entry). */
  secondImageTags?: Tags;
  secondaryCta?: { label: string; href: string };
};

/** Renders a `hero_banner` block. The headline, description and photo are all editable inline. */
export function Hero({ hero, locale, variant = "page", secondImage, secondImageTags, secondaryCta }: Props) {
  const cta = hero.call_to_action;
  const copy = (
    <div className="max-w-[34rem]">
      <h1 {...(hero.$?.title ?? {})}>{hero.title}</h1>
      {hero.banner_description && (
        <p {...(hero.$?.banner_description ?? {})} className="mt-5 text-lg text-slate">
          {hero.banner_description}
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        {cta?.href && (
          <Link href={localePath(locale, cta.href)} {...(hero.$?.call_to_action ?? {})} className="btn btn-primary">
            {cta.title}
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

  if (variant === "home") {
    return (
      <section className="page grid items-center gap-10 py-12 md:grid-cols-[1fr_1.15fr] md:gap-14 md:py-16">
        {copy}
        <div className="grid grid-cols-2 gap-4">
          {hero.banner_image && (
            <div {...(hero.$?.banner_image ?? {})} className="relative aspect-[3/4] overflow-hidden rounded-[4px] bg-bench">
              <Image src={hero.banner_image.url} alt="" fill priority sizes="(min-width: 1100px) 260px, 45vw" className="object-cover" />
            </div>
          )}
          {secondImage && (
            <div {...(secondImageTags ?? {})} className="relative mt-12 aspect-[3/4] overflow-hidden rounded-[4px] bg-bench">
              <Image src={secondImage.url} alt="" fill priority sizes="(min-width: 1100px) 260px, 45vw" className="object-cover" />
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
        {hero.banner_image && (
          <div {...(hero.$?.banner_image ?? {})} className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-line">
            <Image src={hero.banner_image.url} alt="" fill priority sizes="(min-width: 1100px) 520px, 90vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
