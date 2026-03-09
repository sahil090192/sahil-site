import PageNav from '@/components/PageNav'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Misc — Sahil Agarwal' }

export default function MiscPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageNav page="travel" />

      <main style={{
        flex: 1,
        padding: 'clamp(3rem, 8vh, 6rem) clamp(2rem, 9vw, 9rem)',
        maxWidth: '680px',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-fraunces, serif)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
          marginBottom: '0.6rem',
        }}>
          Miscellany
        </h1>
        <p style={{
          fontFamily: 'var(--font-dm-sans, sans-serif)',
          fontSize: '0.9rem',
          color: 'var(--ink-faint)',
          lineHeight: 1.6,
          marginBottom: 'clamp(2.5rem, 6vh, 4rem)',
          maxWidth: '44ch',
        }}>
          Travel notes, recommendations, things that don&rsquo;t fit anywhere else.
        </p>

        <div style={{ color: 'var(--ink-mid)', fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '0.95rem', lineHeight: 1.7 }}>
          <p style={{ fontStyle: 'italic', color: 'var(--ink-faint)' }}>More coming soon.</p>
        </div>
      </main>
    </div>
  )
}
