import Image from "next/image";
import Link from "next/link";
import { firstAuthor, type Post } from "@/lib/blog";
import { formatDate, localePath, type Locale } from "@/lib/i18n";

export function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const author = firstAuthor(post);
  return (
    <article className="group">
      <Link href={localePath(locale, post.url)} className="block">
        {post.featured_image && (
          <div {...(post.$?.featured_image ?? {})} className="overflow-hidden rounded-[4px] bg-bench">
            <Image
              src={post.featured_image.url}
              alt=""
              width={800}
              height={450}
              className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <h3
          {...(post.$?.title ?? {})}
          className="mt-4 text-lg font-semibold leading-snug underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-amber"
        >
          {post.title}
        </h3>
      </Link>
      {post.seo?.meta_description && (
        <p className="mt-2 line-clamp-3 text-[0.95rem] text-slate">{post.seo.meta_description}</p>
      )}
      <p className="meta mt-3">
        {author && <span>{author.title}</span>}
        {post.date && <span>{formatDate(locale, post.date)}</span>}
      </p>
    </article>
  );
}

export function PostGrid({ posts, locale }: { posts: Post[]; locale: Locale }) {
  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <PostCard key={p.uid} post={p} locale={locale} />
      ))}
    </div>
  );
}
