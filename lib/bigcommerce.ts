// Server-only BigCommerce Storefront GraphQL client for the storefront channel.
// Channel-scoped tokens must call the channel-specific host, not the default store host.
import { CATALOG_ROOT, CATEGORY_TILES, DEFAULT_LOCALE, formatMoney, LOCALES, localePath, type Locale, type Money } from "./i18n";

const ENDPOINT = `https://store-${process.env.BIGCOMMERCE_STORE_HASH}-${process.env.BIGCOMMERCE_CHANNEL_ID}.mybigcommerce.com/graphql`;

// ---------------------------------------------------------------- types
export type { Money };

export type BcProduct = {
  entityId: number;
  name: string;
  sku: string;
  path: string;
  brand?: string;
  image?: { url: string; altText?: string };
  price?: Money;
  salePrice?: Money;
  retailPrice?: Money;
  inStock?: boolean;
};

export type ProductDetail = BcProduct & {
  descriptionHtml: string;
  plainDescription: string;
  mpn?: string;
  gtin?: string;
  weight?: { value: number; unit: string };
  images: { url: string; altText?: string }[];
  /** `name` is shown to visitors (translated); `key` is the default-locale name, stable across languages. */
  specs: { name: string; value: string; key: string }[];
  bulkPricing: { min: number; max?: number; price?: number; percentOff?: number }[];
  breadcrumbs: { name: string; path: string }[];
  /** This product's path in each language (with the language prefix), from BigCommerce. */
  alternates: LocalePaths;
  related: BcProduct[];
  availability?: string;
  minQty?: number;
  maxQty?: number;
};

export type CartLine = {
  id: string;
  productId: number;
  name: string;
  sku: string;
  quantity: number;
  url: string;
  image?: string;
  unitPrice?: Money;
  lineTotal?: Money;
};

export type Cart = {
  id: string;
  lines: CartLine[];
  count: number;
  subtotal?: Money;
  checkoutUrl?: string;
};

// ---------------------------------------------------------------- transport
type GqlOptions = { locale?: Locale; revalidate?: number | false };

/**
 * The Storefront GraphQL API ignores `Accept-Language`: translated content (names, descriptions, custom fields, categories,
 * URL paths) is selected by an `@shopperPreferences(locale: "fr")` directive on the operation. Inserted before the operation's
 * selection set, i.e. the first `{` outside the variable definitions.
 */
function withLocale(query: string, locale: Locale): string {
  const q = query.trimStart().startsWith("{") ? `query ${query.trimStart()}` : query;
  let depth = 0;
  for (let i = 0; i < q.length; i++) {
    if (q[i] === "(") depth++;
    else if (q[i] === ")") depth--;
    else if (q[i] === "{" && depth === 0) return `${q.slice(0, i)} @shopperPreferences(locale: "${locale}") ${q.slice(i)}`;
  }
  return q;
}

async function gql<T>(query: string, variables: Record<string, unknown>, opts: GqlOptions = {}): Promise<T> {
  const { locale, revalidate = 300 } = opts;
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BIGCOMMERCE_STOREFRONT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: locale && locale !== DEFAULT_LOCALE ? withLocale(query, locale) : query, variables }),
    ...(revalidate === false ? { cache: "no-store" as const } : { next: { revalidate } }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}

// ---------------------------------------------------------------- mapping
/* eslint-disable @typescript-eslint/no-explicit-any */
const CARD_FIELDS = /* GraphQL */ `
  entityId
  name
  sku
  path
  brand { name }
  defaultImage { url(width: 640) altText }
  prices {
    price { value currencyCode }
    salePrice { value currencyCode }
    retailPrice { value currencyCode }
  }
  inventory { isInStock }
`;

function toProduct(n: any): BcProduct {
  return {
    entityId: n.entityId,
    name: n.name,
    sku: n.sku,
    path: n.path,
    brand: n.brand?.name,
    image: n.defaultImage ? { url: n.defaultImage.url, altText: n.defaultImage.altText } : undefined,
    price: n.prices?.price ?? undefined,
    salePrice: n.prices?.salePrice ?? undefined,
    retailPrice: n.prices?.retailPrice ?? undefined,
    inStock: n.inventory?.isInStock ?? undefined,
  };
}

/** `/products/cat/sub/slug/` (BigCommerce path) -> `/products/cat/sub/slug` (storefront route, locale added by caller). */
export const productHref = (path: string) => path.replace(/\/+$/, "") || "/";

export const formatPrice = formatMoney;

// ---------------------------------------------------------------- translated catalog URLs
// BigCommerce translates catalog URL paths ("/produits/batteries-automobiles/..."), and a path only resolves in its own language.
// Products and categories therefore link to the path of the page's language, and `locales` on a product or category lists its path
// in every language (the default language has no prefix, the others "/fr/...").
export type LocalePaths = Partial<Record<Locale, string>>;

const LOCALES_FIELD = "locales(first: 10) { edges { node { path } } }";

function toLocalePaths(conn: any): LocalePaths {
  const out: LocalePaths = {};
  for (const { node } of conn?.edges ?? []) {
    const m = (node.path as string).match(/^\/([a-z]{2})(?=\/|$)/);
    const locale = (m ? m[1] : DEFAULT_LOCALE) as Locale;
    if (LOCALES.includes(locale)) out[locale] = node.path;
  }
  return out;
}

/** The path of a product or category in every language, given its path in `locale`. Null when it does not exist there. */
export async function getCatalogAlternates(path: string, locale: Locale): Promise<LocalePaths | null> {
  try {
    const data = await gql<any>(
      `query Alternates($path: String!) { site { route(path: $path) { node { __typename
        ... on Product { ${LOCALES_FIELD} } ... on Category { ${LOCALES_FIELD} } } } } }`,
      { path },
      { locale },
    );
    const n = data.site.route.node;
    return n?.locales ? toLocalePaths(n.locales) : null;
  } catch (err) {
    console.error("[bigcommerce] alternates failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

/** Custom-field names of a product in the default language: stable keys for specs whose labels are translated. */
async function defaultSpecNames(entityId: number): Promise<string[]> {
  const data = await gql<any>(
    `query SpecNames($id: Int!) { site { product(entityId: $id) { customFields { edges { node { name value } } } } } }`,
    { id: entityId },
    { revalidate: 3600 },
  );
  return data.site.product.customFields.edges.map((e: any) => e.node).filter((f: any) => f.value).map((f: any) => f.name);
}

// ---------------------------------------------------------------- catalog
/** Live product cards (name, image, price) by BigCommerce product ID. Never throws. */
export async function getBcProducts(ids: number[], locale: Locale): Promise<Map<number, BcProduct>> {
  const out = new Map<number, BcProduct>();
  const unique = [...new Set(ids)].filter(Boolean);
  if (!unique.length) return out;
  try {
    const data = await gql<any>(
      `query Products($ids: [Int!]) { site { products(entityIds: $ids, first: 50) { edges { node { ${CARD_FIELDS} } } } } }`,
      { ids: unique },
      { locale },
    );
    for (const { node } of data.site.products.edges) out.set(node.entityId, toProduct(node));
  } catch (err) {
    console.error("[bigcommerce] product lookup failed:", err instanceof Error ? err.message : err);
  }
  return out;
}

export type ProductPage = {
  products: BcProduct[];
  hasNext: boolean;
  hasPrev: boolean;
  endCursor?: string;
  startCursor?: string;
};

export type SortKey = "featured" | "newest" | "best_selling" | "price_asc" | "price_desc" | "name_asc";
export const SORT_KEYS: SortKey[] = ["featured", "newest", "best_selling", "price_asc", "price_desc", "name_asc"];
const SORT_ENUM: Record<SortKey, string> = {
  featured: "FEATURED",
  newest: "NEWEST",
  best_selling: "BEST_SELLING",
  price_asc: "LOWEST_PRICE",
  price_desc: "HIGHEST_PRICE",
  name_asc: "A_TO_Z",
};

/**
 * Attribute facets shown next to Brand. Chosen by catalog coverage (share of the 150 products that have a value):
 * Technology 93%, Voltage 89%, Warranty 66%. Capacity range (54%) and Format (26%) cover too few to be useful filters.
 */
export const FACET_NAMES = ["Technology", "Voltage", "Warranty"] as const;
/** Each facet lists at most this many values (the most populated ones; selected values always stay visible). */
export const MAX_FACET_VALUES = 8;

export type CatalogQuery = {
  categoryEntityId?: number;
  q?: string;
  brandIds?: number[];
  /** Selected attribute facet values, e.g. { Technology: ["AGM"], Voltage: ["12 V"] }. */
  attrs?: Record<string, string[]>;
  min?: number;
  max?: number;
  sort?: SortKey;
  after?: string;
  before?: string;
  pageSize?: number;
};

export type FacetValue = { value: string; count: number; selected: boolean };

export type CatalogResult = ProductPage & {
  total: number;
  brands: { id: number; name: string; count: number; selected: boolean }[];
  facets: { name: string; values: FacetValue[] }[];
};

/** Keeps the most populated values, but never hides a selected one. */
function topValues<T extends { count: number; selected: boolean }>(values: T[], max = MAX_FACET_VALUES): T[] {
  const ranked = [...values].sort((a, b) => b.count - a.count);
  const keep = new Set(ranked.slice(0, max));
  ranked.filter((v) => v.selected).forEach((v) => keep.add(v));
  return ranked.filter((v) => keep.has(v));
}

let rootCategoryId: number | undefined;
/** The catalog root ("Products"). BigCommerce search needs at least one filter, so "everything" = the root category. */
async function getRootCategoryId() {
  rootCategoryId ??= (await getCategoryByPath(`/${CATALOG_ROOT[DEFAULT_LOCALE]}/`, DEFAULT_LOCALE))?.entityId;
  return rootCategoryId;
}

/**
 * Faceted catalog search: category, text, brands, price range and sort. Facet counts come back with the page.
 * A category includes the products of all its subcategories (the category's own product list may be empty).
 */
export async function searchCatalog(locale: Locale, opts: CatalogQuery): Promise<CatalogResult> {
  const { q, brandIds, attrs, min, max, sort = "featured", after, before, pageSize = 24 } = opts;
  const categoryEntityId = opts.categoryEntityId ?? (await getRootCategoryId());
  const paging = before ? `last: ${pageSize}, before: $cursor` : `first: ${pageSize}, after: $cursor`;
  const filters: Record<string, unknown> = {};
  if (categoryEntityId) filters.categoryEntityId = categoryEntityId;
  if (q) filters.searchTerm = q;
  if (brandIds?.length) filters.brandEntityIds = brandIds;
  const productAttributes = Object.entries(attrs ?? {})
    .filter(([, values]) => values.length)
    .map(([attribute, values]) => ({ attribute, values }));
  if (productAttributes.length) filters.productAttributes = productAttributes;
  if (min != null || max != null) filters.price = { minPrice: min, maxPrice: max };
  try {
    const data = await gql<any>(
      `query($filters: SearchProductsFiltersInput!, $sort: SearchProductsSortInput, $cursor: String) {
        site { search { searchProducts(filters: $filters, sort: $sort) {
          products(${paging}) {
            edges { node { ${CARD_FIELDS} } }
            pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
            collectionInfo { totalItems }
          }
          filters { edges { node { __typename name
            ... on BrandSearchFilter { brands { edges { node { entityId name productCount isSelected } } } }
            ... on ProductAttributeSearchFilter { attributes { edges { node { value productCount isSelected } } } }
          } } }
        } } }
      }`,
      { filters, sort: SORT_ENUM[sort], cursor: before ?? after },
      { locale },
    );
    const r = data.site.search.searchProducts;
    const brandFilter = r.filters.edges.map((e: any) => e.node).find((n: any) => n.__typename === "BrandSearchFilter");
    return {
      products: r.products.edges.map((e: any) => toProduct(e.node)),
      hasNext: r.products.pageInfo.hasNextPage,
      hasPrev: r.products.pageInfo.hasPreviousPage,
      endCursor: r.products.pageInfo.endCursor,
      startCursor: r.products.pageInfo.startCursor,
      total: r.products.collectionInfo.totalItems,
      brands: topValues(
        (brandFilter?.brands.edges ?? []).map((e: any) => ({
          id: e.node.entityId,
          name: e.node.name,
          count: e.node.productCount,
          selected: e.node.isSelected,
        })),
      ),
      facets: FACET_NAMES.flatMap((name) => {
        const f = r.filters.edges.map((e: any) => e.node).find((n: any) => n.__typename === "ProductAttributeSearchFilter" && n.name === name);
        if (!f) return [];
        const values: FacetValue[] = f.attributes.edges.map((e: any) => ({
          value: e.node.value,
          count: e.node.productCount,
          selected: e.node.isSelected || (attrs?.[name] ?? []).includes(e.node.value),
        }));
        return [{ name, values: topValues(values) }];
      }),
    };
  } catch (err) {
    console.error("[bigcommerce] catalog search failed:", err instanceof Error ? err.message : err);
    return { products: [], hasNext: false, hasPrev: false, total: 0, brands: [], facets: [] };
  }
}

const DETAIL_QUERY = /* GraphQL */ `
  query ProductByPath($path: String!) {
    site {
      route(path: $path) {
        node {
          __typename
          ... on Product {
            ${CARD_FIELDS}
            description
            plainTextDescription(characterLimit: 300)
            mpn
            gtin
            weight { value unit }
            minPurchaseQuantity
            maxPurchaseQuantity
            availabilityV2 { status }
            images { edges { node { url(width: 1200) altText } } }
            customFields { edges { node { name value } } }
            prices {
              bulkPricing {
                minimumQuantity
                maximumQuantity
                ... on BulkPricingFixedPriceDiscount { price }
                ... on BulkPricingPercentageDiscount { percentOff }
              }
            }
            categories(first: 1) {
              edges { node { breadcrumbs(depth: 5) { edges { node { name path } } } } }
            }
            relatedProducts(first: 4) { edges { node { ${CARD_FIELDS} } } }
            ${LOCALES_FIELD}
          }
        }
      }
    }
  }
`;

/**
 * Full product detail by the BigCommerce path **in `locale`** (e.g. "/products/automotive-batteries/car-batteries/slug/", or
 * "/produits/batteries-automobiles/batteries-de-voiture/slug/" in French): names, descriptions, specs, breadcrumbs and related
 * products come back translated, with translated paths. `alternates` has the product's path in every language.
 */
export async function getProductByPath(path: string, locale: Locale): Promise<ProductDetail | null> {
  try {
    const data = await gql<any>(DETAIL_QUERY, { path }, { locale });
    const n = data.site.route.node;
    if (!n || n.__typename !== "Product") return null;
    const nodes = (conn: any) => conn.edges.map((e: any) => e.node);
    const crumbs = n.categories.edges[0] ? nodes(n.categories.edges[0].node.breadcrumbs) : [];
    const specs = nodes(n.customFields).filter((f: any) => f.value);
    const keys = locale === DEFAULT_LOCALE ? specs.map((f: any) => f.name) : await defaultSpecNames(n.entityId);
    return {
      ...toProduct(n),
      descriptionHtml: n.description ?? "",
      plainDescription: n.plainTextDescription ?? "",
      mpn: n.mpn || undefined,
      gtin: n.gtin || undefined,
      weight: n.weight ?? undefined,
      images: nodes(n.images),
      specs: specs.map((f: any, i: number) => ({ name: f.name, value: f.value, key: keys.length === specs.length ? keys[i] : f.name })),
      bulkPricing: (n.prices.bulkPricing ?? []).map((b: any) => ({
        min: b.minimumQuantity,
        max: b.maximumQuantity ?? undefined,
        price: b.price ?? undefined,
        percentOff: b.percentOff ?? undefined,
      })),
      breadcrumbs: crumbs,
      alternates: toLocalePaths(n.locales),
      related: nodes(n.relatedProducts).map(toProduct),
      availability: n.availabilityV2?.status,
      minQty: n.minPurchaseQuantity ?? undefined,
      maxQty: n.maxPurchaseQuantity ?? undefined,
    };
  } catch (err) {
    console.error("[bigcommerce] product detail failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

// ---------------------------------------------------------------- cart
const CART_FIELDS = /* GraphQL */ `
  entityId
  amount { value currencyCode }
  lineItems {
    totalQuantity
    physicalItems {
      entityId
      productEntityId
      name
      sku
      quantity
      url
      imageUrl
      listPrice { value currencyCode }
      extendedListPrice { value currencyCode }
    }
  }
`;

function toCart(c: any): Cart {
  return {
    id: c.entityId,
    count: c.lineItems.totalQuantity,
    subtotal: c.amount,
    lines: c.lineItems.physicalItems.map((i: any) => ({
      id: i.entityId,
      productId: i.productEntityId,
      name: i.name,
      sku: i.sku,
      quantity: i.quantity,
      url: i.url,
      image: i.imageUrl,
      unitPrice: i.listPrice,
      lineTotal: i.extendedListPrice,
    })),
  };
}

export async function getCart(cartId: string, locale: Locale): Promise<Cart | null> {
  try {
    const data = await gql<any>(
      `query($id: String!) { site { cart(entityId: $id) { ${CART_FIELDS} } } }`,
      { id: cartId },
      { locale, revalidate: false },
    );
    if (!data.site.cart) return null;
    const cart = toCart(data.site.cart);
    const urls = await gql<any>(
      `mutation($id: String!) { cart { createCartRedirectUrls(input: { cartEntityId: $id }) { redirectUrls { redirectedCheckoutUrl } } } }`,
      { id: cartId },
      { revalidate: false },
    );
    cart.checkoutUrl = urls.cart.createCartRedirectUrls.redirectUrls.redirectedCheckoutUrl;
    return cart;
  } catch (err) {
    console.error("[bigcommerce] cart lookup failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

export async function getCartCount(cartId: string): Promise<number> {
  try {
    const data = await gql<any>(
      `query($id: String!) { site { cart(entityId: $id) { lineItems { totalQuantity } } } }`,
      { id: cartId },
      { revalidate: false },
    );
    return data.site.cart?.lineItems.totalQuantity ?? 0;
  } catch {
    return 0;
  }
}

/** Adds a product to the cart, creating the cart when `cartId` is missing or expired. Returns the cart ID. */
export async function addProductToCart(cartId: string | undefined, productEntityId: number, quantity: number) {
  const lineItems = [{ quantity, productEntityId }];
  if (cartId) {
    try {
      const data = await gql<any>(
        `mutation($input: AddCartLineItemsInput!) { cart { addCartLineItems(input: $input) { cart { entityId } } } }`,
        { input: { cartEntityId: cartId, data: { lineItems } } },
        { revalidate: false },
      );
      return data.cart.addCartLineItems.cart.entityId as string;
    } catch {
      // Cart expired or was deleted: fall through and create a new one.
    }
  }
  const data = await gql<any>(
    `mutation($input: CreateCartInput!) { cart { createCart(input: $input) { cart { entityId } } } }`,
    { input: { lineItems } },
    { revalidate: false },
  );
  return data.cart.createCart.cart.entityId as string;
}

export async function removeCartLine(cartId: string, lineItemEntityId: string) {
  await gql<any>(
    `mutation($input: DeleteCartLineItemInput!) { cart { deleteCartLineItem(input: $input) { cart { entityId } } } }`,
    { input: { cartEntityId: cartId, lineItemEntityId } },
    { revalidate: false },
  );
}

// ---------------------------------------------------------------- categories
export type CategoryNode = { entityId: number; name: string; path: string; productCount: number; children: CategoryNode[] };

/** The catalog category tree (root "Products" and its descendants). */
export async function getCategoryTree(locale: Locale): Promise<CategoryNode[]> {
  try {
    const data = await gql<any>(
      `{ site { categoryTree { entityId name path productCount children { entityId name path productCount children { entityId name path productCount } } } } }`,
      {},
      { locale },
    );
    const norm = (n: any): CategoryNode => ({
      entityId: n.entityId,
      name: n.name,
      path: n.path,
      productCount: n.productCount,
      children: (n.children ?? []).map(norm),
    });
    return data.site.categoryTree.map(norm);
  } catch (err) {
    console.error("[bigcommerce] category tree failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

export type CategoryInfo = {
  entityId: number;
  name: string;
  path: string;
  descriptionHtml: string;
  breadcrumbs: { name: string; path: string }[];
  /** This category's path in each language (with the language prefix), from BigCommerce. */
  alternates: LocalePaths;
};

/** A category by BigCommerce path in `locale` (e.g. "/products/automotive-batteries/", or "/produits/batteries-automobiles/"). Its products come from `searchCatalog`. */
export async function getCategoryByPath(path: string, locale: Locale): Promise<CategoryInfo | null> {
  try {
    const data = await gql<any>(
      `query($path: String!) { site { route(path: $path) { node { __typename ... on Category {
        entityId name path description
        breadcrumbs(depth: 5) { edges { node { name path } } }
        ${LOCALES_FIELD}
      } } } } }`,
      { path },
      { locale },
    );
    const n = data.site.route.node;
    if (!n || n.__typename !== "Category") return null;
    return {
      entityId: n.entityId,
      name: n.name,
      path: n.path,
      descriptionHtml: n.description ?? "",
      breadcrumbs: n.breadcrumbs.edges.map((e: any) => e.node),
      alternates: toLocalePaths(n.locales),
    };
  } catch (err) {
    console.error("[bigcommerce] category failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

/** Reads catalog listing parameters (search, brands, price, sort, cursor) from Next.js `searchParams`. */
export function parseCatalogParams(sp: Record<string, string | string[] | undefined>) {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const many = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
  const num = (v?: string) => (v && Number.isFinite(Number(v)) ? Number(v) : undefined);
  const sort = one(sp.sort) as SortKey | undefined;
  return {
    q: one(sp.q)?.trim() || undefined,
    brandIds: many(sp.brand).map(Number).filter(Number.isFinite),
    min: num(one(sp.min)),
    max: num(one(sp.max)),
    attrs: Object.fromEntries(
      FACET_NAMES.map((n) => [n, many(sp[`f.${n}`])] as const).filter(([, v]) => v.length),
    ) as Record<string, string[]>,
    sort: sort && SORT_KEYS.includes(sort) ? sort : ("featured" as SortKey),
    after: one(sp.after),
    before: one(sp.before),
  };
}

/** Sets a cart line's quantity (a quantity of 0 removes the line). */
export async function setCartLineQuantity(cartId: string, lineItemEntityId: string, productEntityId: number, quantity: number) {
  if (quantity <= 0) return removeCartLine(cartId, lineItemEntityId);
  await gql<any>(
    `mutation($input: UpdateCartLineItemInput!) { cart { updateCartLineItem(input: $input) { cart { entityId } } } }`,
    { input: { cartEntityId: cartId, lineItemEntityId, data: { lineItem: { quantity, productEntityId } } } },
    { revalidate: false },
  );
}

// ---------------------------------------------------------------- category tiles
const flatten = (nodes: CategoryNode[]): CategoryNode[] => nodes.flatMap((n) => [n, ...flatten(n.children)]);

/** The home/listing category tiles with the translated name and path of each category (tiles are identified by default-language path). */
export async function getTileLinks(locale: Locale) {
  const [defaultTree, tree] = await Promise.all([getCategoryTree(DEFAULT_LOCALE), getCategoryTree(locale)]);
  const idByPath = new Map(flatten(defaultTree).map((n) => [productHref(n.path), n.entityId]));
  const byId = new Map(flatten(tree).map((n) => [n.entityId, n]));
  return CATEGORY_TILES.map((t) => {
    const node = byId.get(idByPath.get(t.path) ?? -1);
    return { ...t, href: localePath(locale, node ? productHref(node.path) : t.path), label: node?.name };
  });
}

/** Photo of each top-level category tile, by category id. */
export async function getTilePhotos(): Promise<Map<number, string>> {
  const tree = await getCategoryTree(DEFAULT_LOCALE);
  const photoByPath = new Map<string, string>(CATEGORY_TILES.map((t) => [t.path, t.photo]));
  return new Map(flatten(tree).flatMap((n) => (photoByPath.has(productHref(n.path)) ? [[n.entityId, photoByPath.get(productHref(n.path))!] as [number, string]] : [])));
}
