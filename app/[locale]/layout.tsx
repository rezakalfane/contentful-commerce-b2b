import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { LOCALES, isLocale } from "@/lib/i18n";
import "../globals.css";

// Display: Archivo at a condensed width reads like stamped labelling on a battery case. Body: IBM Plex Sans.
const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

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
        <AnnouncementBar locale={locale} />
        <SiteHeader locale={locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
