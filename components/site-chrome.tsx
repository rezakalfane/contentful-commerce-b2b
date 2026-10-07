import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { getCartCount, getCategoryTree, getTilePhotos, productHref } from "@/lib/bigcommerce";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { getAnnouncement, getNavigation } from "@/lib/site";
import { LocaleSwitcher } from "./locale-switcher";
import { MegaMenu, type MegaColumn } from "./mega-menu";

const BAR_STYLES = {
  info: "bg-ink text-white",
  promo: "bg-amber text-ink",
  warning: "bg-[#ffe7a8] text-ink",
} as const;

export async function AnnouncementBar({ locale }: { locale: Locale }) {
  const bar = await getAnnouncement(locale);
  if (!bar) return null;
  const onAmber = bar.style !== "info";
  return (
    <div className={`px-4 py-2 text-center text-sm ${BAR_STYLES[bar.style] ?? BAR_STYLES.info}`}>
      <span {...(bar.$?.message ?? {})}>{bar.message}</span>
      {bar.cta?.href && (
        <Link
          href={localePath(locale, bar.cta.href)}
          className={`ml-3 font-semibold underline decoration-2 ${onAmber ? "decoration-ink/40" : "decoration-amber"}`}
        >
          {bar.cta.title}
        </Link>
      )}
    </div>
  );
}

/** A half-charged battery: the wordmark's only decoration. */
function Mark() {
  return (
    <span aria-hidden className="relative inline-block h-[18px] w-[30px] shrink-0">
      <span className="absolute inset-0 rounded-[3px] border-2 border-ink" />
      <span className="absolute inset-y-[4px] left-[4px] w-[11px] rounded-[1px] bg-amber" />
      <span className="absolute -right-[4px] top-[5px] h-[8px] w-[3px] rounded-r-[1px] bg-ink" />
    </span>
  );
}

async function CartLink({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const cartId = (await cookies()).get("bc_cart_id")?.value;
  const count = cartId ? await getCartCount(cartId) : 0;
  return (
    <Link href={localePath(locale, "/cart")} className="flex items-center gap-2 text-[0.95rem] font-medium hover:underline decoration-amber decoration-2">
      {t.cart}
      {count > 0 && (
        <span className="min-w-[1.4rem] rounded-full bg-amber px-1.5 text-center text-xs font-semibold leading-[1.4rem] text-ink">
          {count}
        </span>
      )}
    </Link>
  );
}

/** Mega menu columns from the live BigCommerce category tree: top-level categories with their subcategories. */
async function megaColumns(locale: Locale): Promise<MegaColumn[]> {
  const [tree, photos] = await Promise.all([getCategoryTree(locale), getTilePhotos()]);
  return (tree[0]?.children ?? []).map((c) => ({
    label: c.name,
    href: localePath(locale, productHref(c.path)),
    photo: photos.get(c.entityId),
    count: c.productCount,
    children: c.children.map((s) => ({
      label: s.name,
      href: localePath(locale, productHref(s.path)),
      count: s.productCount,
    })),
  }));
}

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const [nav, columns] = await Promise.all([getNavigation(locale), megaColumns(locale)]);
  return (
    <header className="relative border-b border-line bg-paper">
      <nav className="page flex flex-wrap items-center gap-x-8 gap-y-3 py-4">
        <Link href={localePath(locale, "/")} className="flex items-center gap-3">
          <Mark />
          <span className="font-display text-[1.35rem] font-extrabold leading-none tracking-tight [font-stretch:88%]">
            Commerce B2B
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {nav?.header_links?.map((l) =>
            l.href === "/products" && columns.length > 0 ? (
              <MegaMenu
                key={l.href}
                label={l.label}
                href={localePath(locale, "/products")}
                columns={columns}
                allLabel={t.allProducts}
                navLabel={t.megaMenuLabel}
                tags={l.$?.label}
              />
            ) : (
            <Link
              key={l.href + l.label}
              href={localePath(locale, l.href)}
              {...(l.$?.label ?? {})}
              className="text-[0.95rem] font-medium text-slate transition-colors hover:text-ink hover:underline hover:decoration-amber hover:decoration-2"
            >
              {l.label}
            </Link>
            ),
          )}
        </div>
        <div className="ml-auto flex items-center gap-6">
          <Suspense fallback={<span className="text-[0.95rem] font-medium">{t.cart}</span>}>
            <CartLink locale={locale} />
          </Suspense>
          <Suspense fallback={null}>
            <LocaleSwitcher locale={locale} label={t.language} />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const nav = await getNavigation(locale);
  if (!nav) return null;
  const c = nav.contact;
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="page grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <p className="font-display text-2xl font-extrabold [font-stretch:88%]">Commerce B2B</p>
          {nav.legal_text && (
            <p {...(nav.$?.legal_text ?? {})} className="mt-3 max-w-[28ch] text-sm text-white/60">
              {nav.legal_text}
            </p>
          )}
        </div>
        {nav.footer_columns?.map((col) => (
          <div key={col.heading}>
            <h2 className="mb-4 font-sans text-base font-semibold tracking-normal [font-stretch:100%]">{col.heading}</h2>
            <ul className="space-y-2.5 text-[0.95rem] text-white/70">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={localePath(locale, l.href)} className="hover:text-white hover:underline hover:decoration-amber hover:decoration-2">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {c && (
          <div>
            <h2 className="mb-4 font-sans text-base font-semibold tracking-normal [font-stretch:100%]">{t.contact}</h2>
            <ul className="space-y-2.5 text-[0.95rem] text-white/70">
              {c.sales_email && <li>{c.sales_email}</li>}
              {c.support_phone && <li>{c.support_phone}</li>}
              {c.opening_hours && <li>{c.opening_hours}</li>}
            </ul>
          </div>
        )}
      </div>
    </footer>
  );
}
