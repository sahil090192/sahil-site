import Link from 'next/link'
import GaltonBoard from '@/components/GaltonBoard'
import Marquee from '@/components/Marquee'
import PageNav from '@/components/PageNav'
import { getAllPosts } from '@/lib/posts'
import type { MarqueeItem } from '@/components/Marquee'

export default function Home() {
  const posts = getAllPosts()
  const latest = posts[0]

  const marqueeItems: MarqueeItem[] = [
    ...posts.slice(0, 8).map(p => ({
      type: 'Writing',
      title: p.title,
      href: `/writing/${p.slug}`,
    })),
    { type: 'Project', title: 'Codename Clue Generator', href: '/projects' },
    { type: 'Project', title: 'Gold ROI Tracker', href: '/projects' },
    { type: 'Project', title: 'Skynet But Cute', href: '/projects' },
    { type: 'Resume', title: 'Available on request', href: '/misc' },
  ]

  const heroStyle: React.CSSProperties = {
    fontFamily: 'var(--font-fraunces, serif)',
    fontStyle: 'italic',
    fontWeight: 300,
    lineHeight: 1.38,
    letterSpacing: '-0.01em',
    color: 'var(--ink)',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <PageNav />
      <main className="hero-grid" style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr min(420px, 38vw)',
        alignItems: 'center',
        gap: 'clamp(2rem, 5vw, 6rem)',
        padding: 'clamp(4rem, 11vh, 8rem) clamp(2rem, 9vw, 9rem)',
      }}>

        {/* ── Hero text ── */}
        <div style={{ maxWidth: '640px' }}>

          {/* Opening line — slightly larger, full ink */}
          <p className="anim-1" style={{
            ...heroStyle,
            fontSize: 'clamp(1.9rem, 3.5vw, 3.2rem)',
            marginBottom: '0.45em',
          }}>
            Hi, I&rsquo;m Sahil.
          </p>

          {/* Main paragraph — all one flowing block */}
          <p className="anim-2" style={{
            ...heroStyle,
            fontSize: 'clamp(1.35rem, 2.2vw, 2rem)',
            color: 'var(--ink-mid)',
            marginBottom: 0,
          }}>
            I like to{' '}
            <Link href="/projects" className="verb-link">build<sup>↗</sup></Link>
            {' '}things that are worth using,{' '}
            <Link href="/writing" className="verb-link">write<sup>↗</sup></Link>
            {' '}things that are worth reading,
            {' '}and{' '}
            <Link href="/misc" className="verb-link">travel<sup>↗</sup></Link>
            {' '}to places that change me.{' '}
            In my day time I&rsquo;m a Product Manager in Big Tech,
            {' '}and during the rest of the day I love goofing around,
            {' '}learning new stuff, playing tennis, and making Costco
            {' '}runs with my wife.
          </p>

          {/* Recently */}
          {latest && (
            <div className="anim-3" style={{
              marginTop: '2.5rem',
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.75rem',
            }}>
              <span style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: '0.65rem',
                fontWeight: 500,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: 'var(--ink-faint)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                Recently
              </span>
              <span style={{
                fontFamily: 'var(--font-fraunces, serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: '0.95rem',
                color: 'var(--ink-mid)',
              }}>
                Published{' '}
                <Link href={`/writing/${latest.slug}`} style={{
                  color: 'var(--accent)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                  textDecorationThickness: '0.5px',
                }}>
                  {latest.title}
                </Link>
              </span>
            </div>
          )}
        </div>

        {/* ── Galton board ── */}
        <div className="anim-5 galton-col" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GaltonBoard />
        </div>
      </main>

      <Marquee items={marqueeItems} />
    </div>
  )
}
