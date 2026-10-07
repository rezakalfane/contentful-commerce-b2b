/** Locale configuration, URL helpers and UI strings. Content itself lives in Amplience. */

export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Intl / number / date formatting locale. */
export const INTL_LOCALE: Record<Locale, string> = { en: "en-GB", fr: "fr-FR" };
export const LANGUAGE_NAME: Record<Locale, string> = { en: "English", fr: "Français" };

export type Money = { value: number; currencyCode: string };

/** Formats an amount in the locale's currency style (safe to use in client components). */
export function formatMoney(locale: Locale, m?: Money): string {
  return m ? new Intl.NumberFormat(INTL_LOCALE[locale], { style: "currency", currency: m.currencyCode }).format(m.value) : "";
}

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);

/** Prefixes an app-relative path with the locale (the default locale stays unprefixed). */
export function localePath(locale: Locale, href: string): string {
  // The bare catalog link (header, footer, buttons) points at the language's own catalog root: /products, /fr/produits.
  const target = /^\/products(?=\/?(\?|#|$))/.test(href) ? href.replace(/^\/products/, `/${CATALOG_ROOT[locale]}`) : href;
  if (!target.startsWith("/") || locale === DEFAULT_LOCALE) return target;
  return target === "/" ? `/${locale}` : `/${locale}${target}`;
}

/**
 * First URL segment of the catalog in each language. BigCommerce translates the root category's path ("Products" is "Produits"),
 * and every category and product path below it, so the catalog lives at /products in English and /fr/produits in French.
 * Adding a language also needs its root segment here (see the root category's translated path in BigCommerce).
 */
export const CATALOG_ROOT: Record<Locale, string> = { en: "products", fr: "produits" };
/** The language whose catalog root is `segment`, if any. */
export const localeOfCatalogRoot = (segment: string): Locale | undefined => LOCALES.find((l) => CATALOG_ROOT[l] === segment);

/** Removes a leading locale prefix from a pathname. */
export function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/(en|fr)(\/.*)?$/);
  return m ? m[2] || "/" : pathname;
}

const en = {
  home: "Home",
  products: "Products",
  buyingGuides: "Buying guides",
  blog: "Blog",
  faq: "FAQ",
  cart: "Cart",
  contact: "Contact",
  language: "Language",
  allArticles: "All articles",
  backToArticles: "← All articles",
  backToGuides: "← All guides",
  backToProducts: "← All products",
  relatedReading: "Related reading",
  aboutAuthor: "About {name}",
  by: "By",
  minRead: "min read",
  beforeYouOrder: "Before you order",
  recommendedProducts: "Recommended products",
  relatedQuestions: "Related questions",
  proTip: "Pro tip:",
  tradeFavourites: "Trade favourites",
  sku: "SKU",
  mpn: "MPN",
  brand: "Brand",
  searchPlaceholder: "Search articles",
  search: "Search",
  searchProducts: "Search products",
  result: "result",
  results: "results",
  resultsFor: "for",
  noResults: "No results found.",
  description: "Description",
  specifications: "Specifications",
  relatedProducts: "You may also need",
  guidesFeaturing: "Buying guides featuring this product",
  bestFor: "Best for",
  keyFeatures: "Key features",
  quantity: "Quantity",
  addToCart: "Add to cart",
  adding: "Adding…",
  addedToCart: "Added to your cart",
  viewCart: "View cart",
  checkout: "Checkout",
  inStock: "In stock",
  outOfStock: "Out of stock",
  preorder: "Available on request",
  volumePricing: "Volume pricing",
  buyXOrMore: "{min}+ units",
  eachPrice: "each",
  weight: "Weight",
  yourCart: "Your cart",
  cartEmpty: "Your cart is empty.",
  continueShopping: "Continue shopping",
  remove: "Remove",
  subtotal: "Subtotal",
  total: "Total",
  previous: "Previous",
  next: "Next",
  allProducts: "All products",
  productsIntro: "Trade batteries for cars, trucks, leisure and auxiliary use.",
  errorGeneric: "Something went wrong. Please try again.",
  home404: "This page could not be found.",
  productNotFound: "Product not found",
  onlyAvailableIn: "This content is not available in this language yet.",
  free: "Free",
  gallery: "Product images",
  viewImage: "View image {n}",
  shopByCategory: "Shop by category",
  browseCategory: "Browse {name}",
  categoryProducts: "{count} products",
  allCategories: "All categories",
  fromGuides: "From the buying guides",
  readGuide: "Read the guide",
  heroImageAlt: "",
  openMenu: "Menu",
  sortBy: "Sort by",
  sortFeatured: "Featured",
  sortNewest: "Newest",
  sortBestSelling: "Best selling",
  sortPriceAsc: "Price: low to high",
  sortPriceDesc: "Price: high to low",
  sortNameAsc: "Name: A to Z",
  filters: "Filters",
  filterBrand: "Brand",
  filterPrice: "Price",
  priceMin: "Min",
  priceMax: "Max",
  applyFilters: "Apply filters",
  clearAll: "Clear all",
  showingCount: "{count} products",
  showingCountOne: "1 product",
  megaMenuLabel: "Product categories",
  timePreview: "Time preview",
  timePreviewHint: "Content as of",
  timePreviewNote: "Catalog and prices are live.",
  timePreviewNow: "Now",
  timePreviewExit: "Exit time preview",
  timePreviewUpdating: "Updating…",
  timePreviewSlider: "Move through time",
  timePreviewPrev: "Previous change",
  timePreviewNext: "Next change",
  viewAllIn: "View all {name}",
  typeMore: "Type at least 3 characters to search",
  searchClear: "Clear search",
  removeFilter: "Remove filter: {name}",
  updating: "Updating…",
  decreaseQty: "Decrease quantity",
  increaseQty: "Increase quantity",
  qtyFor: "Quantity for {name}",
  lineTotal: "Line total",
  priceFrom: "from {min}",
  priceUpTo: "up to {max}",
};

export type Messages = typeof en;

const fr: Messages = {
  home: "Accueil",
  products: "Produits",
  buyingGuides: "Guides d'achat",
  blog: "Blog",
  faq: "FAQ",
  cart: "Panier",
  contact: "Contact",
  language: "Langue",
  allArticles: "Tous les articles",
  backToArticles: "← Tous les articles",
  backToGuides: "← Tous les guides",
  backToProducts: "← Tous les produits",
  relatedReading: "À lire aussi",
  aboutAuthor: "À propos de {name}",
  by: "Par",
  minRead: "min de lecture",
  beforeYouOrder: "Avant de commander",
  recommendedProducts: "Produits recommandés",
  relatedQuestions: "Questions associées",
  proTip: "Astuce de pro :",
  tradeFavourites: "Les favoris des pros",
  sku: "Réf.",
  mpn: "Réf. fabricant",
  brand: "Marque",
  searchPlaceholder: "Rechercher des articles",
  search: "Rechercher",
  searchProducts: "Rechercher des produits",
  result: "résultat",
  results: "résultats",
  resultsFor: "pour",
  noResults: "Aucun résultat.",
  description: "Description",
  specifications: "Caractéristiques",
  relatedProducts: "Vous pourriez aussi avoir besoin de",
  guidesFeaturing: "Guides d'achat présentant ce produit",
  bestFor: "Idéal pour",
  keyFeatures: "Points forts",
  quantity: "Quantité",
  addToCart: "Ajouter au panier",
  adding: "Ajout…",
  addedToCart: "Ajouté à votre panier",
  viewCart: "Voir le panier",
  checkout: "Passer la commande",
  inStock: "En stock",
  outOfStock: "Rupture de stock",
  preorder: "Disponible sur demande",
  volumePricing: "Tarifs dégressifs",
  buyXOrMore: "{min}+ unités",
  eachPrice: "l'unité",
  weight: "Poids",
  yourCart: "Votre panier",
  cartEmpty: "Votre panier est vide.",
  continueShopping: "Continuer vos achats",
  remove: "Retirer",
  subtotal: "Sous-total",
  total: "Total",
  previous: "Précédent",
  next: "Suivant",
  allProducts: "Tous les produits",
  productsIntro: "Batteries professionnelles pour voitures, poids lourds, loisirs et usages auxiliaires.",
  errorGeneric: "Une erreur s'est produite. Veuillez réessayer.",
  home404: "Cette page est introuvable.",
  productNotFound: "Produit introuvable",
  onlyAvailableIn: "Ce contenu n'est pas encore disponible dans cette langue.",
  free: "Gratuit",
  gallery: "Images du produit",
  viewImage: "Voir l'image {n}",
  shopByCategory: "Acheter par catégorie",
  browseCategory: "Parcourir {name}",
  categoryProducts: "{count} produits",
  allCategories: "Toutes les catégories",
  fromGuides: "Dans les guides d'achat",
  readGuide: "Lire le guide",
  heroImageAlt: "",
  openMenu: "Menu",
  sortBy: "Trier par",
  sortFeatured: "Sélection",
  sortNewest: "Nouveautés",
  sortBestSelling: "Meilleures ventes",
  sortPriceAsc: "Prix croissant",
  sortPriceDesc: "Prix décroissant",
  sortNameAsc: "Nom de A à Z",
  filters: "Filtres",
  filterBrand: "Marque",
  filterPrice: "Prix",
  priceMin: "Min",
  priceMax: "Max",
  applyFilters: "Appliquer les filtres",
  clearAll: "Tout effacer",
  showingCount: "{count} produits",
  showingCountOne: "1 produit",
  megaMenuLabel: "Catégories de produits",
  timePreview: "Aperçu dans le temps",
  timePreviewHint: "Contenu au",
  timePreviewNote: "Catalogue et prix en direct.",
  timePreviewNow: "Maintenant",
  timePreviewExit: "Quitter l'aperçu",
  timePreviewUpdating: "Mise à jour…",
  timePreviewSlider: "Parcourir le temps",
  timePreviewPrev: "Changement précédent",
  timePreviewNext: "Changement suivant",
  viewAllIn: "Voir tout : {name}",
  typeMore: "Saisissez au moins 3 caractères pour rechercher",
  searchClear: "Effacer la recherche",
  removeFilter: "Retirer le filtre : {name}",
  updating: "Mise à jour…",
  decreaseQty: "Diminuer la quantité",
  increaseQty: "Augmenter la quantité",
  qtyFor: "Quantité pour {name}",
  lineTotal: "Total de la ligne",
  priceFrom: "à partir de {min}",
  priceUpTo: "jusqu'à {max}",
};

const MESSAGES: Record<Locale, Messages> = { en, fr };

export const getMessages = (locale: Locale): Messages => MESSAGES[locale];

/** Replaces `{name}`-style placeholders. */
export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

export const formatDate = (locale: Locale, iso?: string) =>
  iso ? new Date(iso).toLocaleDateString(INTL_LOCALE[locale], { day: "numeric", month: "long", year: "numeric" }) : "";

/** Next.js `metadata.alternates` for a path, so search engines link the language versions together. */
/** hreflang + canonical from explicit per-language paths (each already carries its language prefix), e.g. translated catalog URLs. */
export function alternatesFromPaths(locale: Locale, paths: Partial<Record<Locale, string>>) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) if (paths[l]) languages[l] = paths[l]!;
  if (paths[DEFAULT_LOCALE]) languages["x-default"] = paths[DEFAULT_LOCALE]!;
  return { canonical: paths[locale], languages };
}

export function alternatesFor(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: {
      en: localePath("en", path),
      fr: localePath("fr", path),
      "x-default": localePath("en", path),
    },
  };
}

// BigCommerce custom-field names/values are stored in English; translate the common battery specs for display.
const SPEC_NAMES_FR: Record<string, string> = {
  Voltage: "Tension",
  Technology: "Technologie",
  "Capacity (Ah)": "Capacité (Ah)",
  "Capacity Range (Ah)": "Plage de capacité (Ah)",
  Warranty: "Garantie",
  Dimensions: "Dimensions",
  Polarity: "Polarité",
  CCA: "Courant de démarrage (CCA)",
  "Hold-Down": "Fixation",
  "Terminal Type": "Type de bornes",
  Layout: "Disposition",
  "UN Code": "Code ONU",
  "Case Size": "Format du bac",
  "Start-Stop": "Start-Stop",
};

export function translateSpec(locale: Locale, name: string, value: string): { name: string; value: string } {
  if (locale !== "fr") return { name, value };
  let v = value;
  if (/^(yes|no)$/i.test(v)) v = /^yes$/i.test(v) ? "Oui" : "Non";
  v = v
    .replace(/^Positive Left$/i, "Positive à gauche")
    .replace(/^Positive Right$/i, "Positive à droite")
    .replace(/^(\d+) months?$/i, "$1 mois")
    .replace(/^(\d+) years?$/i, (_, n) => `${n} an${n === "1" ? "" : "s"}`);
  return { name: SPEC_NAMES_FR[name] ?? name, value: v };
}

// Enum (select) fields store fixed English values; show them in the visitor's language.
const TOPIC_FR: Record<string, string> = {
  Ordering: "Commande",
  "Pricing & Credit": "Prix et crédit",
  "Delivery & Returns": "Livraison et retours",
  "Account & Users": "Compte et utilisateurs",
  "Products & Fitment": "Produits et compatibilité",
};
const AUDIENCE_FR: Record<string, string> = {
  Workshops: "Ateliers",
  "Fleet managers": "Gestionnaires de flotte",
  "Leisure & marine": "Loisirs et nautisme",
  Everyone: "Tous publics",
};
const BADGE_FR: Record<string, string> = {
  "Best seller": "Meilleure vente",
  "Trade favourite": "Favori des pros",
  "New in": "Nouveauté",
  "Heavy duty": "Usage intensif",
};
const pick = (locale: Locale, map: Record<string, string>, v?: string) => (v && locale === "fr" ? (map[v] ?? v) : v);
export const topicLabel = (locale: Locale, v?: string) => pick(locale, TOPIC_FR, v);
export const audienceLabel = (locale: Locale, v?: string) => pick(locale, AUDIENCE_FR, v);
export const badgeLabel = (locale: Locale, v?: string) => pick(locale, BADGE_FR, v);

// BigCommerce category names are English; the five top-level categories have curated French labels.
const CATEGORY_FR: Record<string, string> = {
  "Automotive Batteries": "Batteries auto",
  "Leisure & Deep-Cycle": "Loisirs et décharge lente",
  "Industrial & Standby": "Industrie et secours",
  "Consumer Batteries": "Piles et accumulateurs",
  "Chargers & Accessories": "Chargeurs et accessoires",
  Products: "Produits",
  "Car Batteries": "Batteries voiture",
  "Motorcycle & Powersports Batteries": "Batteries moto et sports mécaniques",
  "Truck & Agricultural Batteries": "Batteries poids lourds et agricoles",
  "Deep-Cycle & Mobility Batteries": "Batteries à décharge lente et mobilité",
  "Lithium & LiFePO4 Batteries": "Batteries lithium et LiFePO4",
  "Marine & RV Batteries": "Batteries marine et camping-car",
  "Power Tool Batteries": "Batteries d'outillage électroportatif",
  "Standby & Alarm Batteries": "Batteries de secours et d'alarme",
  "Button & Coin Cells": "Piles boutons",
  "Household Batteries": "Piles domestiques",
  "Rechargeable Batteries": "Accumulateurs rechargeables",
  "Battery Chargers": "Chargeurs de batterie",
  "Jump Starters & Boosters": "Boosters et démarreurs de secours",
};
export const categoryLabel = (locale: Locale, name: string) => (locale === "fr" ? (CATEGORY_FR[name] ?? name) : name);

/** The five top-level catalog categories, each paired with a photo in /public/images/categories. */
export const CATEGORY_TILES = [
  { path: "/products/automotive-batteries", name: "Automotive Batteries", photo: "automotive.jpg" },
  { path: "/products/leisure-deep-cycle", name: "Leisure & Deep-Cycle", photo: "leisure.jpg" },
  { path: "/products/industrial-standby", name: "Industrial & Standby", photo: "industrial.jpg" },
  { path: "/products/consumer-batteries", name: "Consumer Batteries", photo: "consumer.jpg" },
  { path: "/products/chargers-accessories", name: "Chargers & Accessories", photo: "chargers.jpg" },
] as const;
