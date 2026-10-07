"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { addProductToCart, getCartCount, removeCartLine, setCartLineQuantity } from "@/lib/bigcommerce";

const CART_COOKIE = "bc_cart_id";

export type AddToCartResult = { ok: true; count: number } | { ok: false; error: string };

export async function addToCartAction(productId: number, quantity: number): Promise<AddToCartResult> {
  const qty = Math.max(1, Math.min(999, Math.floor(quantity) || 1));
  const jar = await cookies();
  try {
    const cartId = await addProductToCart(jar.get(CART_COOKIE)?.value, productId, qty);
    jar.set(CART_COOKIE, cartId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    revalidatePath("/", "layout");
    return { ok: true, count: await getCartCount(cartId) };
  } catch (err) {
    console.error("[cart] add failed:", err instanceof Error ? err.message : err);
    return { ok: false, error: "add_failed" };
  }
}

export async function removeFromCartAction(formData: FormData) {
  const lineId = String(formData.get("lineId") ?? "");
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (cartId && lineId) {
    try {
      await removeCartLine(cartId, lineId);
    } catch (err) {
      console.error("[cart] remove failed:", err instanceof Error ? err.message : err);
    }
  }
  revalidatePath("/", "layout");
}

export type CartUpdateResult = { ok: true; count: number } | { ok: false };

/** Sets one line's quantity (0 removes it). Returns the new total item count for the header badge. */
export async function setCartQuantityAction(lineId: string, productId: number, quantity: number): Promise<CartUpdateResult> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId || !lineId) return { ok: false };
  const qty = Math.max(0, Math.min(999, Math.floor(quantity) || 0));
  try {
    await setCartLineQuantity(cartId, lineId, productId, qty);
    revalidatePath("/", "layout");
    return { ok: true, count: await getCartCount(cartId) };
  } catch (err) {
    console.error("[cart] update failed:", err instanceof Error ? err.message : err);
    return { ok: false };
  }
}
