import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditSupport } from "@/components/edit-support";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { body, display } from "@/lib/fonts";
import { LOCALES, isLocale } from "@/lib/i18n";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Commerce B2B", template: "%s | Commerce B2B" },
  description: "A B2B storefront powered by Contentful and BigCommerce.",
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${display.variable} ${body.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <EditSupport />
        <AnnouncementBar locale={locale} />
        <SiteHeader locale={locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
