import Image from "next/image";
import { tag } from "@/core/edit";
import Link from "next/link";
import { PostGrid } from "@/components/post-card";
import type { Post } from "@/lib/content";
import { fill, formatDate, getMessages, localePath, type Locale } from "@/lib/i18n";

/** A blog article: header, hero image, body blocks, author card and related reading. */
export function PostView({ post, related = [], locale }: { post: Post; related?: Post[]; locale: Locale }) {
  const t = getMessages(locale);
  const author = post.authors[0];
  return (
    <article className="page py-10 md:py-14">
      <Link href={localePath(locale, "/blog")} className="text-sm font-medium text-slate underline decoration-line decoration-2 underline-offset-4 hover:decoration-amber">
        {t.backToArticles}
      </Link>
      <h1 {...tag(post, "title")} className="mt-6 max-w-[22ch] text-balance">{post.title}</h1>
      <p className="meta mt-5">
        {author && <span {...tag(author, "name")}>{author.name}</span>}
        {post.date && <span {...tag(post, "date")}>{formatDate(locale, post.date)}</span>}
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_17rem]">
        <div>
          {post.image && (
            <div {...tag(post, "image")} className="overflow-hidden rounded-[4px] bg-bench">
              <Image src={post.image.url} alt={post.image.alt} width={1600} height={900} priority className="w-full" />
            </div>
          )}
          <div {...tag(post, "blocks")} className="mt-10 space-y-8">
            {post.blocks.map((b, i) =>
              b.type === "text" ? (
                <div key={i} {...tag(b, "html")} className="rte" dangerouslySetInnerHTML={{ __html: b.html }} />
              ) : b.type === "image" ? (
                <div key={i} {...tag(b, "img")}>
                  <Image src={b.img.url} alt={b.img.alt} width={1600} height={900} className="w-full rounded-[4px]" />
                </div>
              ) : (
                <video key={i} controls {...tag(b, "title")} src={b.src} aria-label={b.title} className="w-full rounded-[4px]" />
              ),
            )}
          </div>
        </div>

        {author && (
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-[4px] bg-bench p-5 text-[0.95rem]">
              <div className="flex items-center gap-3">
                {author.avatar && <Image {...tag(author, "avatar")} src={author.avatar.url} alt="" width={52} height={52} className="rounded-full" />}
                <p className="font-semibold leading-snug">{fill(t.aboutAuthor, { name: author.name })}</p>
              </div>
              {author.bio && <p {...tag(author, "bio")} className="mt-3 text-slate">{author.bio}</p>}
            </div>
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="mb-8">{t.relatedReading}</h2>
          <PostGrid posts={related} locale={locale} />
        </section>
      )}
    </article>
  );
}
