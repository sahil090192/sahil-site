import PageNav from '@/components/PageNav'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Projects — Sahil Agarwal' }

const projects = [
  {
    title: 'MenuSage',
    desc: 'What should I eat from this restaurant\'s menu? An AI advisor that filters recommendations by your health conditions.',
    tags: ['AI', 'Python'],
    status: 'Live',
    github: 'https://github.com/sahil090192/MenuSage',
  },
  {
    title: 'Flightery',
    desc: 'Real-time flight visualization with live ADS-B data feeds. Watch the sky move.',
    tags: ['Visualization', 'JS'],
    status: 'Live',
    github: 'https://github.com/sahil090192/flightery',
  },
  {
    title: 'Music DNA',
    desc: 'A visual portrait of my listening history — a personal data story told through Spotify.',
    tags: ['Data', 'HTML'],
    status: 'Live',
    github: 'https://github.com/sahil090192/musicdna',
  },
  {
    title: 'Skynet But Cute',
    desc: 'Content generation pipeline powering my techno-optimist AI + sci-fi social presence.',
    tags: ['AI', 'Python'],
    status: 'Running',
    github: 'https://github.com/sahil090192/skynetcontent',
    live: 'https://instagram.com/skynetbutcute',
  },
  {
    title: 'Nexagram',
    desc: 'Agentify your Instagram game — autonomous content tools and engagement pipelines.',
    tags: ['AI', 'JS'],
    status: 'Prototype',
    github: 'https://github.com/sahil090192/nexagram',
  },
  {
    title: 'GoldenSetDoctor',
    desc: 'AI eval golden set management — a product for keeping model quality healthy over time.',
    tags: ['AI', 'Python'],
    status: 'In Progress',
    github: 'https://github.com/sahil090192/GoldenSetDoctor',
  },
  {
    title: 'Sonakeep',
    desc: 'A note-keeping app built to scratch my own itch. Clean, fast, opinionated.',
    tags: ['App', 'TypeScript'],
    status: 'In Progress',
    github: 'https://github.com/sahil090192/sonakeep-649',
  },
  {
    title: 'Codename Clue Generator',
    desc: 'A smart assistant for Codenames players — generates word-only clues using vector embeddings and GPT.',
    tags: ['AI'],
    status: 'Ideation',
    github: null,
  },
]

const statusDot: Record<string, string> = {
  'Live':        '#4a9960',
  'Running':     '#4a9960',
  'In Progress': '#b85c38',
  'Prototype':   '#7a6a5a',
  'Ideation':    '#c5c0b8',
}

export default function ProjectsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageNav page="build" />

      <main style={{
        flex: 1,
        padding: 'clamp(3rem, 8vh, 6rem) clamp(2rem, 9vw, 9rem)',
        maxWidth: '900px',
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
          {projects.map(p => {
            const href = p.github ?? p.live ?? null
            return (
              <a
                key={p.title}
                href={href ?? undefined}
                target={href ? '_blank' : undefined}
                rel={href ? 'noopener noreferrer' : undefined}
                className="project-card"
                style={{
                  display: 'block',
                  padding: '2rem',
                  background: 'var(--bg)',
                  textDecoration: 'none',
                  cursor: href ? 'pointer' : 'default',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h2 style={{
                    fontFamily: 'var(--font-dm-sans, sans-serif)',
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: 'var(--ink)',
                    letterSpacing: '-0.01em',
                    margin: 0,
                  }}>
                    {p.title}
                  </h2>
                  {href && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--ink-faint)' }}>↗</span>
                  )}
                </div>

                <p style={{
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  fontSize: '0.85rem',
                  color: 'var(--ink-mid)',
                  lineHeight: 1.6,
                  marginBottom: '1.2rem',
                }}>
                  {p.desc}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{
                      width: '5px', height: '5px',
                      borderRadius: '50%',
                      background: statusDot[p.status] ?? '#ccc',
                      display: 'inline-block',
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: 'var(--font-dm-sans, sans-serif)',
                      fontSize: '0.58rem',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-faint)',
                    }}>
                      {p.status}
                    </span>
                  </span>

                  {p.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: 'var(--font-dm-sans, sans-serif)',
                      fontSize: '0.56rem',
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
              </a>
            )
          })}
        </div>
      </main>
    </div>
  )
}
