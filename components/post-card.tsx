import Image from "next/image";
import { tag } from "@/core/edit";
import Link from "next/link";
import type { Post } from "@/lib/content";
import { formatDate, localePath, type Locale } from "@/lib/i18n";

export function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const author = post.authors[0];
  return (
    <article className="group">
      <Link href={localePath(locale, post.url)} className="block">
        {post.image && (
          <div {...tag(post, "image")} className="overflow-hidden rounded-[4px] bg-bench">
            <Image
              src={post.image.url}
              alt=""
              width={800}
              height={450}
              className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <h3 {...tag(post, "title")} className="mt-4 text-lg font-semibold leading-snug underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-amber">
          {post.title}
        </h3>
      </Link>
      {post.description && <p {...tag(post, "description")} className="mt-2 line-clamp-3 text-[0.95rem] text-slate">{post.description}</p>}
      <p className="meta mt-3">
        {author && <span>{author.name}</span>}
        {post.date && <span>{formatDate(locale, post.date)}</span>}
      </p>
    </article>
  );
}

export function PostGrid({ posts, locale }: { posts: Post[]; locale: Locale }) {
  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} locale={locale} />
      ))}
    </div>
  );
}
