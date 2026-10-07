#!/usr/bin/env python3
"""Create/update the Contentful locales and content types (the content model). Idempotent.
Usage: python3 tools/contentful/schemas.py

Conventions: field-level localization (human-readable fields are `localized`), enums are Symbol fields with a validation list that
store English values, lists of strings are Array of Symbol, references to other entries are Link fields, and the reusable pieces
(hero banner, feature block, guide step, use case, nav link, footer column) are separate entries linked from their page.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import cf  # noqa: E402


# ------------------------------------------------------------ field builders
def _f(id_, name, type_, localized=False, required=False, **kw):
    return {"id": id_, "name": name, "type": type_, "localized": localized, "required": required, "disabled": False, "omitted": False, **kw}


def symbol(id_, name, t=True, required=False, **kw):
    return _f(id_, name, "Symbol", t, required, **kw)


def text(id_, name, t=True, required=False):
    return _f(id_, name, "Text", t, required)


def rich(id_, name, t=True, required=False):
    return _f(id_, name, "RichText", t, required, validations=[
        {"enabledMarks": ["bold", "italic"]},
        {"enabledNodeTypes": ["heading-2", "heading-3", "unordered-list", "ordered-list", "hyperlink"]}])


def integer(id_, name):
    return _f(id_, name, "Integer")


def boolean(id_, name):
    return _f(id_, name, "Boolean")


def date(id_, name):
    return _f(id_, name, "Date")


def slug(id_="slug"):
    return symbol(id_, "Slug", t=False, required=True, validations=[{"unique": True}, {"regexp": {"pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"}}])


def image(id_, name, required=False):
    return _f(id_, name, "Link", False, required, linkType="Asset", validations=[{"linkMimetypeGroup": ["image"]}])


def enum(id_, name, choices):
    return symbol(id_, name, t=False, validations=[{"in": choices}])


def ref(id_, name, to, required=False):
    return _f(id_, name, "Link", False, required, linkType="Entry", validations=[{"linkContentType": [to]}])


def refs(id_, name, to):
    return _f(id_, name, "Array", False, False, items={"type": "Link", "linkType": "Entry", "validations": [{"linkContentType": [to]}]})


def refs_any(id_, name, to):
    return _f(id_, name, "Array", False, False, items={"type": "Link", "linkType": "Entry", "validations": [{"linkContentType": list(to)}]})


def symbols(id_, name, t=False):
    return _f(id_, name, "Array", t, False, items={"type": "Symbol", "validations": []})


def seo():
    return [symbol("seoTitle", "SEO title"), text("seoDescription", "SEO description")]


# ------------------------------------------------------------ content types
TOPICS = ["Ordering", "Pricing & Credit", "Delivery & Returns", "Account & Users", "Products & Fitment"]
AUDIENCES = ["Workshops", "Fleet managers", "Leisure & marine", "Everyone"]
BADGES = ["None", "Best seller", "Trade favourite", "New in", "Heavy duty"]

# The components an editor can stack in a page, and the ones allowed in a post body.
BLOCK_TYPES = ["heroBanner", "featureBlock", "textBlock", "imageBlock", "videoBlock", "collectionBlock"]
POST_BLOCK_TYPES = ["textBlock", "imageBlock", "videoBlock"]
COLLECTION_KINDS = ["categories", "spotlights", "guides", "posts", "postListing", "guideListing", "faqs"]

# id: (name, display field, fields)
TYPES = {
    # reusable pieces
    "heroBanner": ("Hero banner", "title", [
        symbol("title", "Title", required=True), text("description", "Description"), image("image", "Image"),
        symbol("ctaLabel", "CTA label"), symbol("ctaHref", "CTA path", t=False),
        image("secondImage", "Second image (home variant)"), enum("variant", "Variant", ["default", "home"])]),
    "featureBlock": ("Feature block", "title", [
        symbol("title", "Title", required=True), rich("copy", "Copy"), image("image", "Image"), enum("layout", "Layout", ["image_left", "image_right"])]),
    "guideStep": ("Guide step", "stepTitle", [
        symbol("stepTitle", "Step title", required=True), text("stepBody", "Step body", required=True), text("proTip", "Pro tip")]),
    "useCase": ("Use case", "useCase", [symbol("useCase", "Use case", required=True), text("description", "Description")]),
    "textBlock": ("Text block", "name", [symbol("name", "Internal name", t=False, required=True), rich("text", "Text", required=True)]),
    "imageBlock": ("Image block", "name", [
        symbol("name", "Internal name", t=False, required=True), image("image", "Image", required=True), symbol("alt", "Alt text")]),
    "videoBlock": ("Video block", "name", [
        symbol("name", "Internal name", t=False, required=True), symbol("videoTitle", "Video title"), symbol("src", "Video URL", t=False, required=True)]),
    # One type for every list-like section (a type per section would exceed the 25 content types of the Free plan).
    "collectionBlock": ("Collection block", "name", [
        symbol("name", "Internal name", t=False, required=True), enum("kind", "Kind", COLLECTION_KINDS), symbol("title", "Title"),
        symbol("linkLabel", "Link label"), symbol("searchPlaceholder", "Search placeholder"), symbol("searchButtonLabel", "Search button label"),
        refs_any("items", "Items (guides, spotlights, posts or FAQs)", ["buyingGuide", "productSpotlight", "blogPost", "faq"])]),
    "navLink": ("Navigation link", "label", [
        symbol("label", "Label", required=True), symbol("href", "Path", t=False, required=True), boolean("highlight", "Highlight")]),
    "footerColumn": ("Footer column", "heading", [symbol("heading", "Heading", required=True), refs("links", "Links", "navLink")]),
    # root types
    "page": ("Page", "title", [
        symbol("title", "Title", required=True), slug(), text("description", "Description"),
        refs_any("components", "Components (top to bottom)", BLOCK_TYPES), *seo()]),
    "author": ("Author", "name", [
        symbol("name", "Name", t=False, required=True), slug(), image("picture", "Picture", required=True), text("bio", "Bio")]),
    "blogPost": ("Blog post", "title", [
        symbol("title", "Title", required=True), slug(), ref("author", "Author", "author"), date("date", "Date"),
        image("featuredImage", "Featured image", required=True), ref("relatedPost", "Related post", "blogPost"),
        boolean("isArchived", "Archived"), *seo(), symbol("seoKeywords", "SEO keywords"),
        refs_any("content", "Content blocks", POST_BLOCK_TYPES), integer("readTime", "Read time (minutes)")]),
    "faq": ("FAQ", "question", [
        symbol("question", "Question", required=True), slug(), rich("answer", "Answer", required=True), enum("topic", "Topic", TOPICS),
        integer("sortOrder", "Sort order"), boolean("isFeatured", "Featured")]),
    "buyingGuide": ("Buying guide", "title", [
        symbol("title", "Title", required=True), slug(), text("summary", "Summary", required=True), image("heroImage", "Hero image"),
        enum("audience", "Audience", AUDIENCES), integer("readMinutes", "Read minutes"), refs("steps", "Steps", "guideStep"),
        symbols("checklist", "Checklist (one 'before you order' check per item)", t=True),
        symbols("recommendedBcProducts", "Recommended BigCommerce product IDs"), symbols("recommendedSkus", "Recommended SKUs"),
        refs("relatedFaqs", "Related FAQs", "faq"), ref("author", "Author", "author")]),
    "productSpotlight": ("Product spotlight", "title", [
        symbol("title", "Title", required=True), slug(), integer("bcProductId", "BigCommerce product ID"), symbol("bcSku", "BigCommerce SKU", t=False),
        symbol("tagline", "Tagline", required=True), rich("editorialSummary", "Editorial summary"),
        symbols("keyFeatures", "Key features", t=True), refs("useCases", "Use cases", "useCase"), symbols("pairsWellWithSkus", "Pairs well with (SKUs)"),
        enum("badge", "Badge", BADGES), image("editorialImage", "Editorial image"), boolean("isFeatured", "Featured")]),
    "announcementBar": ("Announcement bar", "title", [
        symbol("title", "Internal name", t=False, required=True), symbol("message", "Message", required=True),
        symbol("ctaLabel", "CTA label"), symbol("ctaHref", "CTA path", t=False),
        enum("style", "Style", ["info", "promo", "warning"]), enum("audience", "Audience", ["everyone", "logged_in", "guests"]),
        date("startsAt", "Starts at"), date("endsAt", "Ends at"), boolean("isActive", "Active")]),
    "siteNavigation": ("Site navigation", "title", [
        symbol("title", "Internal name", t=False, required=True), refs("headerLinks", "Header links", "navLink"),
        refs("footerColumns", "Footer columns", "footerColumn"), symbol("salesEmail", "Sales email", t=False),
        symbol("supportPhone", "Support phone", t=False), symbol("openingHours", "Opening hours"), symbol("legalText", "Legal text")]),
}


def locales():
    existing = {l["code"]: l for l in cf.api("GET", "/locales")["items"]}
    if cf.EN not in existing:
        old = next(l for l in existing.values() if l["default"])
        cf.api("PUT", f"/locales/{old['sys']['id']}", {"name": "English", "code": cf.EN, "fallbackCode": None, "optional": False,
                                                        "contentDeliveryApi": True, "contentManagementApi": True}, version=old["sys"]["version"])
        print(f"  default locale {old['code']} -> {cf.EN}")
    if cf.FR not in existing:
        cf.api("POST", "/locales", {"name": "French", "code": cf.FR, "fallbackCode": cf.EN, "optional": False,
                                    "contentDeliveryApi": True, "contentManagementApi": True})
        print(f"  added locale {cf.FR} (falls back to {cf.EN})")


def _remove_entry(entry):
    """Unpublishes (if needed) and deletes an entry."""
    if entry["sys"].get("publishedVersion"):
        entry = cf.api("DELETE", f"/entries/{entry['sys']['id']}/published", version=entry["sys"]["version"])
    cf.api("DELETE", f"/entries/{entry['sys']['id']}", version=entry["sys"]["version"])


def apply_type(id_, name, fields, display, prune):
    """Creates/updates a content type. Fields the model no longer has are kept as they are, unless `prune`: then they are first
    omitted (published) and then removed (Contentful deletes a field only after it was omitted); their values leave the entries."""
    existing = cf.get_or_none(f"/content_types/{id_}")
    extra = [f for f in (existing or {}).get("fields", []) if f["id"] not in {x["id"] for x in fields}]
    if extra and not prune:
        print(f"  {id_}: keeping {[f['id'] for f in extra]} (run with --prune to remove)")
        cf.upsert_content_type(id_, name, fields + extra, display)
    elif extra:
        cf.upsert_content_type(id_, name, fields + [{**f, "omitted": True} for f in extra], display)
        cf.upsert_content_type(id_, name, fields, display)
        print(f"  {id_}: removed {[f['id'] for f in extra]}")
    else:
        cf.upsert_content_type(id_, name, fields, display)


def remove_types(prune):
    """Content types that are no longer in the model: listed, and with `prune` their entries and the type are deleted."""
    for t in cf.api("GET", "/content_types", params={"limit": 100})["items"]:
        if t["sys"]["id"] in TYPES:
            continue
        entries = cf.api("GET", "/entries", params={"content_type": t["sys"]["id"], "limit": 1000})["items"]
        if not prune:
            print(f"  {t['sys']['id']}: no longer in the model ({len(entries)} entries); run with --prune to delete")
            continue
        for e in entries:
            _remove_entry(e)
        if t["sys"].get("publishedVersion"):
            t = cf.api("DELETE", f"/content_types/{t['sys']['id']}/published", version=t["sys"]["version"])
        cf.api("DELETE", f"/content_types/{t['sys']['id']}", version=t["sys"]["version"])
        print(f"  {t['sys']['id']}: deleted with {len(entries)} entries")


def main():
    prune = "--prune" in sys.argv
    locales()
    for id_, (name, display, fields) in TYPES.items():
        apply_type(id_, name, fields, display, prune)
        print(f"  content type {id_}")
    remove_types(prune)


if __name__ == "__main__":
    main()
