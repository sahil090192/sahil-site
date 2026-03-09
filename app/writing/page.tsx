import Link from 'next/link'
import PageNav from '@/components/PageNav'
import { getAllPosts, formatMonthYear } from '@/lib/posts'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Writing — Sahil Agarwal' }

export default function WritingPage() {
  const posts = getAllPosts()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageNav page="write" />

      <main style={{
        flex: 1,
        padding: 'clamp(3rem, 8vh, 6rem) clamp(2rem, 9vw, 9rem)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-fraunces, serif)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
          marginBottom: 'clamp(2.5rem, 6vh, 4.5rem)',
        }}>
          Writing
        </h1>

        {posts.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: 'var(--ink-faint)', fontSize: '1rem' }}>
            Nothing published yet.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: '720px' }}>
            {posts.map((post, i) => (
              <li
                key={post.slug}
                style={{
                  paddingBottom: '2.5rem',
                  marginBottom: '2.5rem',
                  borderBottom: i < posts.length - 1 ? '1px solid var(--rule)' : 'none',
                }}
              >
                <Link href={`/writing/${post.slug}`} className="post-link" style={{ textDecoration: 'none', display: 'block' }}>
                  <h2
                    className="post-title"
                    style={{
                      fontFamily: 'var(--font-fraunces, serif)',
                      fontStyle: 'italic',
                      fontWeight: 300,
                      fontSize: 'clamp(1.3rem, 2.2vw, 1.9rem)',
                      lineHeight: 1.2,
                      color: 'var(--ink)',
                      marginBottom: '0.55rem',
                      transition: 'color 0.2s',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p style={{
                      fontFamily: 'var(--font-dm-sans, sans-serif)',
                      fontSize: '0.875rem',
                      color: 'var(--ink-mid)',
                      lineHeight: 1.65,
                      marginBottom: '0.75rem',
                      maxWidth: '60ch',
                    }}>
                      {post.excerpt}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    {post.date && (
                      <time style={{
                        fontFamily: 'var(--font-dm-sans, sans-serif)',
                        fontSize: '0.68rem',
                        color: 'var(--ink-faint)',
                        letterSpacing: '0.04em',
                      }}>
                        {formatMonthYear(post.date)}
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
                        padding: '0.2em 0.55em',
                        borderRadius: '2px',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
