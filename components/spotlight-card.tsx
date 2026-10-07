import Image from "next/image";
import Link from "next/link";
import { formatPrice, productHref, type BcProduct } from "@/lib/bigcommerce";
import { badgeLabel, getMessages, localePath, type Locale } from "@/lib/i18n";
import type { Spotlight } from "@/lib/site";

/** Editorial content from Contentful, with live image, price and link from BigCommerce. */
export function SpotlightCard({ item, product, locale }: { item: Spotlight; product?: BcProduct; locale: Locale }) {
  const t = getMessages(locale);
  const showBadge = item.badge && item.badge !== "None";
  const img = product?.image ?? (item.editorial_image && { url: item.editorial_image.url, altText: "" });
  const href = product ? localePath(locale, productHref(product.path)) : undefined;
  const body = (
    <>
      <div className="relative overflow-hidden rounded-[4px] bg-bench">
        {img && (
          <Image
            src={img.url}
            alt={img.altText || item.title}
            width={800}
            height={600}
            className="aspect-[4/3] w-full object-contain p-6 mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.04]"
          />
        )}
        {showBadge && (
          <span className="absolute left-3 top-3 rounded-[3px] bg-amber px-2.5 py-1 text-xs font-semibold text-ink">
            {badgeLabel(locale, item.badge)}
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-1 flex-col gap-2">
        <h3 {...(item.$?.title ?? {})} className="font-semibold leading-snug underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-amber">
          {item.title}
        </h3>
        <p {...(item.$?.tagline ?? {})} className="text-[0.95rem] text-slate">
          {item.tagline}
        </p>
        <p className="mt-auto flex items-baseline justify-between pt-2">
          {product?.price ? <span className="text-lg font-bold">{formatPrice(locale, product.price)}</span> : <span />}
          <span className="text-xs text-slate">
            {t.sku} {item.bc_sku}
          </span>
        </p>
      </div>
    </>
  );
  return href ? (
    <Link href={href} className="group flex flex-col">
      {body}
    </Link>
  ) : (
    <div className="group flex flex-col">{body}</div>
  );
}
