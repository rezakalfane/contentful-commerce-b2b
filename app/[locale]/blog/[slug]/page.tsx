import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditSupport } from "@/components/edit-support";
import { PostGrid } from "@/components/post-card";
import { firstAuthor, getPost } from "@/lib/blog";
import { previewParams } from "@/lib/contentful";
import { alternatesFor, fill, formatDate, getMessages, isLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const [{ locale, slug }, sp] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) return {};
  const post = await getPost(locale, slug, previewParams(sp));
  if (!post) return {};
  return {
    title: post.seo?.meta_title || post.title,
    description: post.seo?.meta_description,
    alternates: alternatesFor(locale, `/blog/${slug}`),
  };
}

export default async function PostPage({ params, searchParams }: PageProps<"/[locale]/blog/[slug]">) {
  const [{ locale, slug }, sp] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);
  const preview = previewParams(sp);
  const post = await getPost(locale, slug, preview);
  if (!post) notFound();

  const author = firstAuthor(post);

  return (
    <article className="page py-10 md:py-14">
      <EditSupport preview={preview} entry={post} />

      <Link href={localePath(locale, "/blog")} className="text-sm font-medium text-slate underline decoration-line decoration-2 underline-offset-4 hover:decoration-amber">
        {t.backToArticles}
      </Link>
      <h1 {...(post.$?.title ?? {})} className="mt-6 max-w-[22ch] text-balance">
        {post.title}
      </h1>
      <p className="meta mt-5">
        {author && <span {...(author.$?.title ?? {})}>{author.title}</span>}
        {post.date && <span {...(post.$?.date ?? {})}>{formatDate(locale, post.date)}</span>}
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_17rem]">
        <div>
          {post.featured_image && (
            <div {...(post.$?.featured_image ?? {})} className="overflow-hidden rounded-[4px] bg-bench">
              <Image src={post.featured_image.url} alt="" width={1600} height={900} priority className="w-full" />
            </div>
          )}
          <div {...(post.$?.body ?? {})} className="rte mt-10" dangerouslySetInnerHTML={{ __html: post.bodyHtml ?? "" }} />
        </div>

        {author && (
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-[4px] bg-bench p-5 text-[0.95rem]">
              <div className="flex items-center gap-3">
                {author.picture && (
                  <Image src={author.picture.url} alt="" width={52} height={52} className="rounded-full" />
                )}
                <p className="font-semibold leading-snug">{fill(t.aboutAuthor, { name: author.title })}</p>
              </div>
              {author.bio && (
                <p {...(author.$?.bio ?? {})} className="mt-3 text-slate">
                  {author.bio}
                </p>
              )}
            </div>
          </aside>
        )}
      </div>

      {post.related_post?.length ? (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="mb-8">{t.relatedReading}</h2>
          <PostGrid posts={post.related_post} locale={locale} />
        </section>
      ) : null}
    </article>
  );
}
