import Image from "next/image";
import Link from "next/link";
import { getTileLinks } from "@/lib/bigcommerce";
import { categoryLabel, type Locale } from "@/lib/i18n";

/** Photo mosaic of the five top-level catalog categories: one tall lead tile, four square ones. */
export async function CategoryTiles({ locale }: { locale: Locale }) {
  const tiles = await getTileLinks(locale);
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:grid-rows-2">
      {tiles.map((c, i) => (
        <li key={c.path} className={i === 0 ? "col-span-2 row-span-1 md:col-span-1 md:row-span-2" : ""}>
          <Link
            href={c.href}
            className={`group relative block overflow-hidden rounded-[4px] bg-ink ${i === 0 ? "aspect-[16/9] md:aspect-auto md:h-full md:min-h-[26rem]" : "aspect-[4/3]"}`}
          >
            <Image
              src={`/images/categories/${c.photo}`}
              alt=""
              fill
              sizes="(min-width: 1100px) 360px, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <span className="font-display text-xl font-extrabold leading-tight text-white [font-stretch:88%] md:text-2xl">
                {c.label ?? categoryLabel(locale, c.name)}
              </span>
              <span className="mt-2 block h-[3px] w-8 bg-amber transition-all duration-300 group-hover:w-14" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
