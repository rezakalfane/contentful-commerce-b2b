import { NextResponse, type NextRequest } from "next/server";
import { localeOfCatalogRoot } from "@/lib/i18n";
import { FRAME_ANCESTORS } from "@/providers/cms/meta";
import { previewGate } from "@/providers/cms/gates";

/**
 * Locale routing. English (default) has clean URLs and is rewritten internally to /en/...;
 * French lives under /fr. An explicit /en prefix redirects to the clean URL so each page has one address.
 * `headers` are the request headers passed on to the page (x-preview, x-catalog-root).
 */
function route(request: NextRequest, headers: Headers) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  // An editor's content preview URL for the home page is `/<locale>/home` (the `home` page slug): serve it at the home page.
  if (pathname === "/home" || pathname === "/fr/home") {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/home" ? "/en" : "/fr";
    return NextResponse.rewrite(url, { request: { headers } });
  }

  // Catalog URLs are translated (/products/..., /fr/produits/...). The route lives at /products, so another root is rewritten onto it
  // and the requested root travels in a header (see requestedCatalogRoot in lib/catalog-route.ts).
  const catalogRewrite = (prefix: string, rest: string) => {
    const seg = rest.split("/")[1];
    if (!seg || seg === "products" || !localeOfCatalogRoot(seg)) return null;
    const url = request.nextUrl.clone();
    url.pathname = `${prefix}/products${rest.slice(seg.length + 1)}`;
    const withRoot = new Headers(headers);
    withRoot.set("x-catalog-root", seg);
    return NextResponse.rewrite(url, { request: { headers: withRoot } });
  };

  if (first === "fr") return catalogRewrite("/fr", pathname.slice(3) || "/") ?? NextResponse.next({ request: { headers } });

  if (first === "en") {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  const rewritten = catalogRewrite("/en", pathname);
  if (rewritten) return rewritten;
  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url, { request: { headers } });
}

export function proxy(request: NextRequest) {
  // Request headers the app trusts: set here, never taken from the client.
  const headers = new Headers(request.headers);
  headers.delete("x-preview");
  if (previewGate(request.nextUrl.searchParams)) headers.set("x-preview", "1");

  const response = route(request, headers);

  // Only Contentful's web app may frame the site (localhost too, in development).
  const dev = process.env.NODE_ENV !== "production";
  const ancestors = ["'self'", ...FRAME_ANCESTORS, ...(dev ? ["http://localhost:*", "https://localhost:*"] : [])];
  response.headers.set("Content-Security-Policy", `frame-ancestors ${ancestors.join(" ")}`);
  return response;
}

export const config = {
  // Skip Next internals and any path with a file extension (images, favicon, etc.)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
