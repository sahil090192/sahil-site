import Link from 'next/link'

const navLinks = [
  { label: 'build',  href: '/projects' },
  { label: 'write',  href: '/writing'  },
  { label: 'travel', href: '/misc'     },
]

export default function PageNav({ page }: { page?: string }) {
  return (
    <nav style={{
      padding: '1.6rem clamp(2rem, 9vw, 9rem)',
      borderBottom: '1px solid var(--rule)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {/* Left: SA monogram (home link), hidden on home page */}
      {page ? (
        <Link href="/" style={{
          fontFamily: 'var(--font-fraunces, serif)',
          fontStyle: 'italic',
          fontSize: '1.1rem',
          color: 'var(--ink)',
          textDecoration: 'none',
          letterSpacing: '-0.01em',
        }}>
          SA
        </Link>
      ) : (
        <span style={{ visibility: 'hidden', fontSize: '1.1rem' }}>SA</span>
      )}

      {/* Right: nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        {navLinks.map(link => {
          const isActive = page?.toLowerCase() === link.label
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'var(--font-fraunces, serif)',
                fontStyle: 'italic',
                fontSize: '1rem',
                fontWeight: 300,
                textDecoration: 'none',
                color: isActive ? 'var(--accent)' : 'var(--ink-mid)',
                letterSpacing: '-0.01em',
                transition: 'color 0.2s',
              }}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
