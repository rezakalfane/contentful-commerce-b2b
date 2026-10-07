import Link from "next/link";

/** Previous / next links for cursor pagination. Renders nothing when there is only one page. */
export function Pager({ prevHref, nextHref, previous, next }: { prevHref?: string; nextHref?: string; previous: string; next: string }) {
  if (!prevHref && !nextHref) return null;
  return (
    <nav className="mt-12 flex items-center justify-between border-t border-line pt-6">
      {prevHref ? (
        <Link href={prevHref} className="btn btn-outline">
          {previous}
        </Link>
      ) : (
        <span />
      )}
      {nextHref && (
        <Link href={nextHref} className="btn btn-outline">
          {next}
        </Link>
      )}
    </nav>
  );
}
