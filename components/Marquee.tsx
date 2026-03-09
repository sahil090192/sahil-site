export interface MarqueeItem {
  type: string
  title: string
  href: string
}

export default function Marquee({ items }: { items: MarqueeItem[] }) {
  if (items.length === 0) return null
  const doubled = [...items, ...items]

  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className="marquee-item"
            style={{ textDecoration: 'none' }}
          >
            <span className="marquee-type">{item.type}</span>
            <span className="marquee-title">{item.title}</span>
            <span className="marquee-sep" aria-hidden>—</span>
          </a>
        ))}
      </div>
    </div>
  )
}
