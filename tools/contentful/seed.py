#!/usr/bin/env python3
"""Load the storefront content into Contentful (English + French, field-level localization), publishing as it goes.
Idempotent: assets and entries have fixed ids derived from the content, and unchanged entries are not rewritten.
Usage: python3 scripts/seed/seed.py [--only authors,faqs,posts,guides,spotlights,settings,pages]
"""
import datetime as dt
import os
import sys
import textwrap

sys.path.insert(0, os.path.dirname(__file__))
import cf  # noqa: E402
import images  # noqa: E402
import photos  # noqa: E402
from content import AUTHORS, POSTS  # noqa: E402
from content_extra import ANNOUNCEMENTS, FAQS, GUIDES, HOME, NAV, P, SPOTLIGHTS  # noqa: E402
from content_fr import (  # noqa: E402
    ANNOUNCEMENTS_FR, AUTHOR_BIOS_FR, BLOG_LISTING_FR, FAQS_FR, GUIDES_FR, HEROES_FR, HOME_FR, NAV_FR, PAGES_FR,
    SPOTLIGHT_SUMMARY_FR, SPOTLIGHTS_FR, THEME_KEYWORDS_FR,
)
from content_fr_posts import POSTS_FR  # noqa: E402

IMG = cf.IMG_DIR
slugify, richtext, loc, link = cf.slugify, cf.richtext, cf.loc, cf.link


# ---------------------------------------------------------------- helpers
def one(value):
    """A non-localized field value (default locale only)."""
    return {cf.EN: value}


def entry(id_, type_, fields):
    """Upserts and publishes an entry; returns a Link to it. `None` values are dropped."""
    cf.upsert_entry(id_, type_, {k: v for k, v in fields.items() if v is not None})
    return link("Entry", id_)


def lines(items):
    return list(items)


def asset(path, alt):
    return cf.upload_asset(path, alt)


def rt(spec):
    return richtext(spec)


def hero(id_, title, desc, cta, href, image, fr, variant="default", second=None):
    """A heroBanner entry. `fr` = (title, description, cta label). Returns a Link."""
    return entry(id_, "heroBanner", {
        "title": loc(title, fr[0]), "description": loc(desc, fr[1]), "ctaLabel": loc(cta, fr[2]),
        "ctaHref": one(href), "image": one(image), "variant": one(variant), "secondImage": one(second) if second else None})


def sections(only):
    return None if only is None else set(only.split(","))


def iso(when):
    return when.strftime("%Y-%m-%dT%H:%M:%S+00:00")


# ---------------------------------------------------------------- seeding
def main():
    only = sections(sys.argv[sys.argv.index("--only") + 1]) if "--only" in sys.argv else None
    want = lambda name: only is None or name in only  # noqa: E731
    os.makedirs(IMG, exist_ok=True)
    refs = {}  # (kind, key) -> Link, for references between entries

    # ---- authors
    if want("authors") or want("posts") or want("guides"):
        print("== authors")
        for a, bio_fr in zip(AUTHORS, AUTHOR_BIOS_FR):
            slug = slugify(a["name"])
            p = os.path.join(IMG, f"author-{slug}.png")
            images.make_avatar(a, p)
            refs[("author", a["name"])] = entry(f"author-{slug}", "author", {
                "name": one(a["name"]), "slug": one(slug), "picture": one(asset(p, a["name"])), "bio": loc(a["bio"], bio_fr)})
            print(f"  {a['name']}")

    # ---- FAQs
    if want("faqs") or want("guides"):
        print("== faqs")
        for i, ((topic, q, paras, featured), (q_fr, answers_fr)) in enumerate(zip(FAQS, FAQS_FR)):
            slug = slugify(q)[:60]
            refs[("faq", q)] = entry(f"faq-{slug}"[:64], "faq", {
                "question": loc(q, q_fr), "slug": one(slug), "answer": loc(rt([("p", t) for t in paras]), rt([("p", t) for t in answers_fr])),
                "topic": one(topic), "sortOrder": one(i), "isFeatured": one(bool(featured))})
        print(f"  {len(FAQS)} faqs")

    # ---- blog posts
    flat = [(ai, pi, p) for ai, posts in enumerate(POSTS) for pi, p in enumerate(posts)]
    flat_fr = [p for posts in POSTS_FR for p in posts]
    post_link = []
    if want("posts"):
        print("== blog posts")
        start = dt.datetime(2026, 1, 12, 9, 0)
        for idx, ((ai, pi, (title, intro, s1, s2, takeaways)), fr) in enumerate(zip(flat, flat_fr)):
            slug = slugify(title)
            p = os.path.join(IMG, f"post-photo-{slug[:60]}.jpg")
            photos.crop(photos.PHOTOS[(ai * 2 + pi) % len(photos.PHOTOS)], (1600, 900), idx, p)
            when = start + dt.timedelta(days=7 * (pi * 6 + ai))
            t_fr, intro_fr, s1_fr, s2_fr, take_fr = fr
            body = loc(rt([("p", intro), ("h2", s1[0]), ("p", s1[1]), ("h2", s2[0]), ("p", s2[1]), ("h2", "Key takeaways"), ("ul", takeaways)]),
                       rt([("p", intro_fr), ("h2", s1_fr[0]), ("p", s1_fr[1]), ("h2", s2_fr[0]), ("p", s2_fr[1]), ("h2", "À retenir"), ("ul", take_fr)]))
            text_block = entry(f"blk-text-{slug}"[:64], "textBlock", {"name": one(f"Post text: {slug}"[:80]), "text": body})
            words = len(intro.split()) + len(s1[1].split()) + len(s2[1].split())
            f = {
                "title": loc(title, t_fr), "slug": one(slug), "author": one(refs[("author", AUTHORS[ai]["name"])]), "date": one(iso(when)),
                "featuredImage": one(asset(p, title)), "isArchived": one(False),
                "content": one([text_block]), "readTime": one(max(3, round(words * 3 / 200))),
                "seoTitle": loc(title, t_fr),
                "seoDescription": loc(textwrap.shorten(intro, 180, placeholder="…"), textwrap.shorten(intro_fr, 180, placeholder="…")),
                "seoKeywords": loc("b2b commerce, " + AUTHORS[ai]["theme"].lower(), "commerce b2b, " + THEME_KEYWORDS_FR[ai]),
            }
            # related post always points at an earlier post, which is already published
            rel = idx - 7 if idx >= 7 else (idx - 1 if idx >= 1 else None)
            if rel is not None:
                f["relatedPost"] = one(post_link[rel])
            post_link.append(entry(f"post-{slug}"[:64], "blogPost", f))
            print(f"  [{idx + 1:02d}/36] {title[:60]}")

    # ---- product photos for guides / spotlights / home
    if want("spotlights") or want("pages"):
        keys = {s[0] for s in SPOTLIGHTS}
        bc = images.bc_photos([P[k][0] for k in keys])
        photo = {k: bc[P[k][0]] for k in keys if P[k][0] in bc}

    # ---- buying guides
    GUIDE_PHOTOS = ["controle", "mea_voiture", "mea_solaire", "mea_pile", "mea_chargeur", "bat_moto"]
    if want("guides"):
        print("== buying guides")
        for gi, (g, gf) in enumerate(zip(GUIDES, GUIDES_FR)):
            slug = slugify(g["title"])
            p = os.path.join(IMG, f"guide-photo-{slug[:45]}.jpg")
            photos.crop(GUIDE_PHOTOS[gi], (1600, 600), 0, p)
            steps = []
            for si, ((t, b, tip), (t_fr, b_fr, tip_fr)) in enumerate(zip(g["steps"], gf["steps"])):
                steps.append(entry(f"step-{slug[:40]}-{si + 1}", "guideStep", {
                    "stepTitle": loc(t, t_fr), "stepBody": loc(b, b_fr), "proTip": loc(tip, tip_fr) if tip else None}))
            entry(f"guide-{slug}"[:64], "buyingGuide", {
                "title": loc(g["title"], gf["title"]), "slug": one(slug), "summary": loc(g["summary"], gf["summary"]),
                "heroImage": one(asset(p, g["title"])), "audience": one(g["audience"]), "readMinutes": one(g["minutes"]), "steps": one(steps),
                "checklist": loc(lines(g["checklist"]), lines(gf["checklist"])),
                "recommendedBcProducts": one([str(P[k][0]) for k in g["products"]]), "recommendedSkus": one([P[k][1] for k in g["products"]]),
                "relatedFaqs": one([refs[("faq", q)] for q in g["faqs"]]), "author": one(refs[("author", AUTHORS[g["author"]]["name"])])})
            print(f"  {g['title'][:60]}")

    # ---- product spotlights
    if want("spotlights"):
        print("== product spotlights")
        for si, ((key, title, tagline, badge, feats, uses, _pairs, featured), (tag_fr, feats_fr, uses_fr)) in enumerate(zip(SPOTLIGHTS, SPOTLIGHTS_FR)):
            pid, sku = P[key]
            slug = slugify(title)[:60]
            p = os.path.join(IMG, f"spotlight-photo-{key}.png")
            images.compose([photo[key]], AUTHORS[si % 6]["colors"], (1200, 900), si * 7 + 2, p)
            ucs = [entry(f"usecase-{slug[:40]}-{ui + 1}", "useCase", {"useCase": loc(u, u_fr), "description": loc(d, d_fr)})
                   for ui, ((u, d), (u_fr, d_fr)) in enumerate(zip(uses, uses_fr))]
            entry(f"spotlight-{slug}"[:64], "productSpotlight", {
                "title": loc(title, title), "slug": one(slug), "bcProductId": one(pid), "bcSku": one(sku), "badge": one(badge), "isFeatured": one(bool(featured)),
                "useCases": one(ucs), "editorialImage": one(asset(p, title)), "tagline": loc(tagline, tag_fr),
                "keyFeatures": loc(lines(feats), lines(feats_fr)),
                "editorialSummary": loc(
                    rt([("p", f"{tagline}."), ("p", "Check the specification against the vehicle's original battery before ordering, and see our buying guide for a step-by-step fitment check.")]),
                    rt([("p", tag_fr + "."), ("p", SPOTLIGHT_SUMMARY_FR)]))})
            print(f"  {title[:60]}")

    # ---- site settings: announcements + navigation
    if want("settings"):
        print("== announcements + navigation")
        for a, (_t, msg_fr, cta_fr) in zip(ANNOUNCEMENTS, ANNOUNCEMENTS_FR):
            entry(f"announcement-{slugify(a['title'])}"[:64], "announcementBar", {
                "title": one(a["title"]), "message": loc(a["message"], msg_fr), "ctaLabel": loc(a["cta"][0], cta_fr), "ctaHref": one(a["cta"][1]),
                "style": one(a["style"]), "audience": one(a["audience"]),
                "startsAt": one("2026-10-01T00:00:00+00:00"), "endsAt": one("2026-12-31T23:59:00+00:00"), "isActive": one(True)})

        def nav_link(id_, l_en, l_fr, href):
            return entry(id_, "navLink", {"label": loc(l_en, l_fr), "href": one(href), "highlight": one(False)})

        header = [nav_link(f"nav-header-{i}", l, lf, h) for i, ((l, h), (lf, _)) in enumerate(zip(NAV["header"], NAV_FR["header"]))]
        footer = []
        for ci, ((h, links), (h_fr, links_fr)) in enumerate(zip(NAV["footer"], NAV_FR["footer"])):
            col_links = [nav_link(f"nav-footer-{ci}-{li}", l, lf, u) for li, ((l, u), (lf, _)) in enumerate(zip(links, links_fr))]
            footer.append(entry(f"nav-column-{ci}", "footerColumn", {"heading": loc(h, h_fr), "links": one(col_links)}))
        entry("site-navigation", "siteNavigation", {
            "title": one(NAV["title"]), "headerLinks": one(header), "footerColumns": one(footer),
            "salesEmail": one(NAV["contact"][0]), "supportPhone": one(NAV["contact"][1]),
            "openingHours": loc(NAV["contact"][2], NAV_FR["hours"]), "legalText": loc(NAV["legal"], NAV_FR["legal"])})

    # ---- pages: home (/), FAQ (/faq), buying guides (/guides), blog (/blog): each an ordered list of components
    if want("pages"):
        print("== pages")
        L = BLOG_LISTING_FR
        HERO_PHOTO = {"home": ("mea_voiture", (780, 1040)), "faq": ("alim", (1200, 900)), "guides": ("mea_pile", (1200, 900)), "blog": ("bat_moto", (1200, 900))}
        faq_hero = ("Frequently asked questions", "Quick answers for trade buyers on ordering, pricing and credit, delivery, accounts and fitment.", "Browse buying guides", "/guides")
        guides_hero = ("Buying guides", "Practical, step-by-step checklists for matching the right battery to the job, for workshops, fleets and leisure buyers.", "Read the FAQ", "/faq")
        blog_hero = ("The B2B Commerce Blog", "Practical guidance on pricing, ordering, integrations, payments, sales and headless storefronts for B2B commerce teams.", "Browse articles", "/blog")
        heroes = {"home": ("Commerce B2B", HOME["description"], "Browse buying guides", "/guides"), "faq": faq_hero, "guides": guides_hero, "blog": blog_hero}
        hero_img = {}
        for key, (name, size) in HERO_PHOTO.items():
            file = "blog-hero-photo.jpg" if key == "blog" else f"hero-{key}-photo.jpg"
            hero_img[key] = asset(photos.crop(name, size, 0, os.path.join(IMG, file)), heroes[key][0])
        second = asset(photos.crop("mea_moto", (780, 1040), 0, os.path.join(IMG, "home-second-photo.jpg")), "Home hero second photo")

        def page_hero(key):
            t, d, cta, href = heroes[key]
            tf, df, cf_, _ = HEROES_FR[key]
            return hero(f"hero-{key}", t, d, cta, href, hero_img[key], (tf, df, cf_), "home" if key == "home" else "default", second if key == "home" else None)

        def block_link(id_):
            return link("Entry", id_)

        def collection(id_, name, kind, item_ids=(), **texts):
            f = {"name": one(name), "kind": one(kind), **{k: loc(en, fr) for k, (en, fr) in texts.items()}}
            if item_ids:
                f["items"] = one([block_link(i) for i in item_ids])
            return entry(id_, "collectionBlock", f)

        # the entries the collections point at (ids are derived from the content, as when they were created above)
        post_ids = [f"post-{slugify(t)}"[:64] for _ai, _pi, (t, *_r) in flat]
        guide_ids = [f"guide-{slugify(g['title'])}"[:64] for g in GUIDES]
        faq_ids = [f"faq-{slugify(q)[:60]}"[:64] for (_topic, q, _paras, _feat) in FAQS]
        spotlight_ids = [(f"spotlight-{slugify(sp[1])[:60]}"[:64], sp[7]) for sp in SPOTLIGHTS]
        latest_ids = [post_ids[i] for i in sorted(range(len(flat)), key=lambda i: -(flat[i][1] * 6 + flat[i][0]))[:3]]

        # home
        features = []
        for i, ((t, copy, layout, _), (t_fr, copy_fr)) in enumerate(zip(HOME["blocks"], HOME_FR["blocks"])):
            p = os.path.join(IMG, f"home-block-photo-{i}.jpg")
            photos.crop(["mea_chargeur", "mea_outillage", "mea_solaire"][i], (1200, 800), 0, p)
            features.append(entry(f"home-block-{i + 1}", "featureBlock", {
                "title": loc(t, t_fr), "copy": loc(cf.html_paragraphs(copy), cf.html_paragraphs(copy_fr)),
                "image": one(asset(p, t)), "layout": one(layout)}))
        intro = entry("blk-home-intro", "textBlock", {
            "name": one("Home intro"), "text": loc(cf.html_paragraphs(HOME["rich_text"]), cf.html_paragraphs(HOME_FR["rich_text"]))})
        tiles = collection("blk-home-categories", "Home category tiles", "categories", title=("Shop by category", "Acheter par catégorie"))
        spots = collection("blk-home-spotlights", "Home trade favourites", "spotlights", [i for i, featured in spotlight_ids if featured][:3],
                           title=("Trade favourites", "Les favoris des pros"))
        guides_row = collection("blk-home-guides", "Home guides row", "guides", guide_ids[:3],
                                title=("From the buying guides", "Dans les guides d'achat"), linkLabel=("Buying guides", "Guides d'achat"))
        entry("page-home", "page", {
            "title": loc(HOME["title"], HOME["title"]), "slug": one("home"), "description": loc(HOME["description"], HOME_FR["description"]),
            "components": one([page_hero("home"), intro, tiles, *features, spots, guides_row])})
        print("  page: /")

        # FAQ, buying guides, blog
        t_fr, d_fr = PAGES_FR["/faq"]
        entry("page-faq", "page", {
            "title": loc("FAQ", t_fr), "slug": one("faq"), "description": loc(faq_hero[1], d_fr),
            "components": one([page_hero("faq"), collection("blk-faq-section", "FAQ section", "faqs", faq_ids)])})
        print("  page: /faq")
        t_fr, d_fr = PAGES_FR["/guides"]
        entry("page-guides", "page", {
            "title": loc("Buying guides", t_fr), "slug": one("guides"), "description": loc(guides_hero[1], d_fr),
            "components": one([page_hero("guides"), collection("blk-guides-listing", "Guide listing", "guideListing", title=("Buying guides", "Guides d'achat"))])})
        print("  page: /guides")
        h = HEROES_FR["blog"]
        entry("page-blog", "page", {
            "title": loc("Blog", "Blog"), "slug": one("blog"), "description": loc(blog_hero[1], h[1]),
            "seoTitle": loc("The B2B Commerce Blog", h[0]),
            "components": one([
                page_hero("blog"),
                collection("blk-blog-latest", "Blog latest articles", "posts", latest_ids, title=("Latest articles", L["from_blog_title"])),
                collection("blk-blog-listing", "Blog listing", "postListing", title=("All articles", "Tous les articles"),
                           searchPlaceholder=("Search articles", L["placeholder"]), searchButtonLabel=("Search", L["search_button"]))])})
        print("  page: /blog")


if __name__ == "__main__":
    main()
