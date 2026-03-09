import PageNav from '@/components/PageNav'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Projects — Sahil Agarwal' }

const projects = [
  {
    title: 'Codename Clue Generator',
    desc: 'A smart assistant for Codenames players — generates word-only clues using vector embeddings and GPT.',
    status: 'In Progress',
    href: '#',
  },
  {
    title: 'TweetSpeaker',
    desc: 'Reads tweets aloud using voice AI. Designed for listening while driving, walking, or showering.',
    status: 'Prototype',
    href: '#',
  },
  {
    title: 'Gold ROI Tracker',
    desc: 'Helps track jewelry market value and historical ROI. Web-based, mobile-first.',
    status: 'Design Stage',
    href: '#',
  },
  {
    title: 'Skynet But Cute',
    desc: 'A techno-optimist brand: AI jokes, predictions, and sci-fi content with auto-posting tools.',
    status: 'Live',
    href: 'https://instagram.com/skynetbutcute',
  },
  {
    title: 'Recipe Reboot',
    desc: 'Healthy and flavorful Indian food recipes with macros and couple-cooking collabs.',
    status: 'Ideation',
    href: '#',
  },
]

const statusColor: Record<string, string> = {
  'Live':         'var(--accent)',
  'In Progress':  '#7a6a5a',
  'Prototype':    '#7a6a5a',
  'Design Stage': 'var(--ink-faint)',
  'Ideation':     'var(--ink-faint)',
}

export default function ProjectsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageNav page="build" />

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
          marginBottom: '0.6rem',
        }}>
          Projects
        </h1>
        <p style={{
          fontFamily: 'var(--font-dm-sans, sans-serif)',
          fontSize: '0.9rem',
          color: 'var(--ink-faint)',
          marginBottom: 'clamp(2.5rem, 6vh, 4.5rem)',
          maxWidth: '48ch',
          lineHeight: 1.6,
        }}>
          Builds, experiments, and ideas — some live, some in progress, some just fun to make.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5px',
          maxWidth: '960px',
          background: 'var(--rule)',
          border: '1px solid var(--rule)',
        }}>
          {projects.map(p => (
            <a
              key={p.title}
              href={p.href}
              target={p.href.startsWith('http') ? '_blank' : undefined}
              rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="project-card"
              style={{
                display: 'block',
                padding: '2rem',
                background: 'var(--bg)',
                textDecoration: 'none',
              }}
            >
              <h2 style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontWeight: 500,
                fontSize: '1rem',
                color: 'var(--ink)',
                marginBottom: '0.5rem',
                letterSpacing: '-0.01em',
              }}>
                {p.title}
              </h2>
              <p style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: '0.85rem',
                color: 'var(--ink-mid)',
                lineHeight: 1.6,
                marginBottom: '1.2rem',
              }}>
                {p.desc}
              </p>
              <span style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: '0.6rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: statusColor[p.status] ?? 'var(--ink-faint)',
              }}>
                {p.status}
              </span>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
