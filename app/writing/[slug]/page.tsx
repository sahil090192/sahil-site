import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import PageNav from '@/components/PageNav'
import { getAllPosts, getPostBySlug, formatDate } from '@/lib/posts'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} — Sahil Agarwal`,
    description: post.excerpt,
  }
}

export default async function WritingPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageNav page="write" />

      <article style={{
        flex: 1,
        padding: 'clamp(3rem, 8vh, 6rem) clamp(2rem, 9vw, 9rem)',
      }}>
        <header style={{ maxWidth: '68ch', marginBottom: '3rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-fraunces, serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            lineHeight: 1.12,
            color: 'var(--ink)',
            marginBottom: '1.2rem',
            letterSpacing: '-0.015em',
          }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {post.date && (
              <time style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: '0.7rem',
                color: 'var(--ink-faint)',
                letterSpacing: '0.04em',
              }}>
                {formatDate(post.date)}
              </time>
            )}
            {post.tags?.map(tag => (
              <span key={tag} style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: '0.58rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink-faint)',
                background: 'rgba(0,0,0,0.04)',
                padding: '0.2em 0.6em',
                borderRadius: '2px',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </header>

        <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', maxWidth: '68ch', marginBottom: '3rem' }} />

        <div className="prose-writing" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
          <MDXRemote source={post.content} />
        </div>
      </article>
    </div>
  )
}
