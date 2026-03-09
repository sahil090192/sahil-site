import type { Metadata } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['300', '400'],
  style: ['italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sahil Agarwal',
  description: 'Product manager. I build things worth using, write things worth reading, and travel to places that change me.',
  metadataBase: new URL('https://sahilagarwal.com'),
  openGraph: {
    title: 'Sahil Agarwal',
    description: 'Product manager. Builder. Writer.',
    url: 'https://sahilagarwal.com',
    siteName: 'Sahil Agarwal',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sahil Agarwal',
    description: 'Product manager. Builder. Writer.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${fraunces.variable}`}
        style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
      >
        {children}
      </body>
    </html>
  )
}
