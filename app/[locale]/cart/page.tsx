import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CartView } from "@/components/cart-view";
import { getCart } from "@/lib/bigcommerce";
import { getMessages, isLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/cart">): Promise<Metadata> {
  const { locale } = await params;
  return { title: isLocale(locale) ? getMessages(locale).yourCart : "Cart", robots: { index: false } };
}

export default async function CartPage({ params }: PageProps<"/[locale]/cart">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);
  const cartId = (await cookies()).get("bc_cart_id")?.value;
  const cart = cartId ? await getCart(cartId, locale) : null;

  return (
    <div className="page py-10 md:py-14">
      <h1>{t.yourCart}</h1>
      <CartView
        locale={locale}
        lines={(cart?.lines ?? []).map((l) => ({
          id: l.id,
          productId: l.productId,
          name: l.name,
          sku: l.sku,
          image: l.image,
          // BigCommerce line URLs are absolute store URLs; keep the storefront path.
          href: localePath(locale, l.url.replace(/^https?:\/\/[^/]+/, "").replace(/\/+$/, "") || "/products"),
          unit: l.unitPrice,
          quantity: l.quantity,
        }))}
        subtotal={cart?.subtotal}
        checkoutUrl={cart?.checkoutUrl}
        productsHref={localePath(locale, "/products")}
        labels={{
          sku: t.sku,
          remove: t.remove,
          subtotal: t.subtotal,
          checkout: t.checkout,
          continueShopping: t.continueShopping,
          cartEmpty: t.cartEmpty,
          updating: t.updating,
          decreaseQty: t.decreaseQty,
          increaseQty: t.increaseQty,
          qtyFor: t.qtyFor,
          lineTotal: t.lineTotal,
          error: t.errorGeneric,
        }}
      />
    </div>
  );
}
