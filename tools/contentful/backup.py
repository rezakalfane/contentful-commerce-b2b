#!/usr/bin/env python3
"""Save everything in the space (content types, entries, assets as JSON) before a destructive change such as `schemas.py --prune`.
Usage: python3 tools/contentful/backup.py   -> .backups/contentful-<timestamp>.json (gitignored; never commit it)
"""
import datetime as dt
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import cf  # noqa: E402


def everything(path):
    items, skip = [], 0
    while True:
        page = cf.api("GET", path, params={"limit": 200, "skip": skip})
        items += page["items"]
        skip += 200
        if skip >= page["total"]:
            return items


def main():
    data = {"content_types": everything("/content_types"), "entries": everything("/entries"), "assets": everything("/assets"),
            "locales": cf.api("GET", "/locales")["items"]}
    out = os.path.join(cf.ROOT, ".backups")
    os.makedirs(out, exist_ok=True)
    path = os.path.join(out, f"contentful-{dt.datetime.now().strftime('%Y%m%d-%H%M%S')}.json")
    with open(path, "w") as f:
        json.dump(data, f)
    print(f"saved {len(data['content_types'])} content types, {len(data['entries'])} entries, {len(data['assets'])} assets -> {os.path.relpath(path, cf.ROOT)}")


if __name__ == "__main__":
    main()
