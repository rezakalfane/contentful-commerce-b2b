"""Seed image helpers: branded gradients, author avatars, and product photos pulled from BigCommerce."""
import json
import os
import sys
import urllib.request

from PIL import Image, ImageDraw, ImageFont

import cf


def font(size, bold=True):
    for p in ("/System/Library/Fonts/Helvetica.ttc", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"):
        try:
            return ImageFont.truetype(p, size, index=1 if bold and p.endswith(".ttc") else 0)
        except OSError:
            continue
    return ImageFont.load_default(size)


def gradient(w, h, c1, c2, shift=0):
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        for x in range(w):
            t = min(1, max(0, (x / w * 0.6 + y / h * 0.4)))
            px[x, y] = tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))
    d = ImageDraw.Draw(img, "RGBA")
    for k in range(4):  # soft decorative circles, shifted per image for variety
        r = (140 + 60 * k + shift * 9) % 420 + 80
        cx = (w * (0.15 + 0.22 * k) + shift * 53) % w
        cy = (h * (0.2 + 0.2 * k) + shift * 31) % h
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 255, 14))
    return img


def make_avatar(author, path):
    img = gradient(400, 400, *author["colors"])
    d = ImageDraw.Draw(img)
    initials = "".join(p[0] for p in author["name"].split()[:2])
    f = font(150)
    d.text(((400 - d.textlength(initials, font=f)) / 2, 110), initials, font=f, fill="white")
    img.save(path)


def bc_photos(ids):
    """Downloads the default image of each BigCommerce product id (cached in IMG_DIR). Returns {id: local_path}."""
    env = cf.ENV
    url = f"https://store-{env['BIGCOMMERCE_STORE_HASH']}-{env['BIGCOMMERCE_CHANNEL_ID']}.mybigcommerce.com/graphql"
    query = "query($ids:[Int!]){site{products(entityIds:$ids,first:50){edges{node{entityId defaultImage{url(width:800)}}}}}}"
    req = urllib.request.Request(
        url, data=json.dumps({"query": query, "variables": {"ids": sorted(set(ids))}}).encode(),
        headers={"Authorization": f"Bearer {env['BIGCOMMERCE_STOREFRONT_TOKEN']}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req) as r:
        data = json.load(r)
    if "errors" in data:
        sys.exit("BigCommerce GraphQL error: " + str(data["errors"][0].get("message")))
    out = {}
    for e in data["data"]["site"]["products"]["edges"]:
        n = e["node"]
        if not n["defaultImage"]:
            continue
        path = os.path.join(cf.IMG_DIR, f"bc-{n['entityId']}.png")
        if not os.path.exists(path):
            with urllib.request.urlopen(n["defaultImage"]["url"]) as r, open(path, "wb") as f:
                f.write(r.read())
        out[n["entityId"]] = path
    return out


def compose(photo_paths, colors, size, shift, out):
    """Product photos on white rounded cards, centred on a branded gradient."""
    w, h = size
    img = gradient(w, h, *colors, shift=shift)
    n = len(photo_paths)
    pad, gap = int(h * 0.09), int(h * 0.05)
    card_h = h - 2 * pad
    card_w = min(card_h, (w - 2 * pad - gap * (n - 1)) // n)
    x = (w - (n * card_w + (n - 1) * gap)) // 2
    mask = Image.new("L", (card_w, card_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, card_w - 1, card_h - 1], radius=int(card_h * 0.05), fill=255)
    for p in photo_paths:
        card = Image.new("RGBA", (card_w, card_h), (255, 255, 255, 255))
        photo = Image.open(p).convert("RGBA")
        photo.thumbnail((card_w - 40, card_h - 40))
        card.alpha_composite(photo, ((card_w - photo.width) // 2, (card_h - photo.height) // 2))
        img.paste(card.convert("RGB"), (x, pad), mask)
        x += card_w + gap
    img.save(out)
