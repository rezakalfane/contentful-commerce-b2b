import Image from "next/image";
import Link from "next/link";
import { formatPrice, productHref, type BcProduct } from "@/lib/bigcommerce";
import { getMessages, localePath, type Locale } from "@/lib/i18n";

/** A product tile for lists and "you may also need" strips. Open layout: photo tile, then text. */
export function ProductCard({ product, locale }: { product: BcProduct; locale: Locale }) {
  const t = getMessages(locale);
  const onSale = product.salePrice && product.price && product.salePrice.value < product.price.value;
  return (
    <Link href={localePath(locale, productHref(product.path))} className="group flex flex-col">
      <div className="overflow-hidden rounded-[4px] bg-bench">
        {product.image && (
          <Image
            src={product.image.url}
            alt={product.image.altText || product.name}
            width={480}
            height={360}
            className="aspect-[4/3] w-full object-contain p-5 mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.04]"
          />
        )}
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        {product.brand && <p className="text-sm text-slate">{product.brand}</p>}
        <h3 className="line-clamp-2 text-[0.95rem] font-semibold leading-snug underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-amber">
          {product.name}
        </h3>
        <p className="mt-auto flex items-baseline justify-between pt-3">
          <span className="text-lg font-bold">{formatPrice(locale, onSale ? product.salePrice : product.price)}</span>
          <span className="text-xs text-slate">
            {t.sku} {product.sku}
          </span>
        </p>
      </div>
    </Link>
  );
}
