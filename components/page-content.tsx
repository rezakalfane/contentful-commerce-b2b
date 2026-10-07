import { GuideView } from "@/components/guide-view";
import { PageBlocks } from "@/components/page-blocks";
import { PostView } from "@/components/post-view";
import { getGuide, getPage, getPost, getPosts } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

/** The content of a route: the Page for a key, an article, a guide. */
export async function PageContent({ pageKey, locale, path, q }: { pageKey: string; locale: Locale; path?: string; q?: string }) {
  const page = await getPage(pageKey, locale);
  return page ? <PageBlocks blocks={page.blocks} locale={locale} path={path} q={q} /> : null;
}

export async function PostContent({ slug, locale }: { slug: string; locale: Locale }) {
  const [post, all] = await Promise.all([getPost(slug, locale), getPosts(locale)]);
  if (!post) return null;
  // Related reading: the latest other articles by the same first author.
  const byAuthor = post.authors[0]?.name;
  const related = all.filter((p) => p.id !== post.id && p.authors[0]?.name === byAuthor).slice(0, 3);
  return (
    <PostView post={post} related={related} locale={locale} />
  );
}

export async function GuideContent({ slug, locale }: { slug: string; locale: Locale }) {
  const guide = await getGuide(slug, locale);
  return guide ? (
    <GuideView guide={guide} locale={locale} />
  ) : null;
}
