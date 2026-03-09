import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const WRITING_DIR = path.join(process.cwd(), 'content', 'writing')

export interface PostMeta {
  slug: string
  title: string
  date: string
  tags?: string[]
  excerpt?: string
}

export interface Post extends PostMeta {
  content: string
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(WRITING_DIR)) return []

  return fs
    .readdirSync(WRITING_DIR)
    .filter(f => /\.(mdx?|md)$/.test(f))
    .map(filename => {
      const slug = filename.replace(/\.(mdx?|md)$/, '')
      const raw = fs.readFileSync(path.join(WRITING_DIR, filename), 'utf-8')
      const { data } = matter(raw)
      return {
        slug,
        title: (data.title as string) ?? slug,
        date: (data.date as string) ?? '',
        tags: data.tags as string[] | undefined,
        excerpt: data.excerpt as string | undefined,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  for (const ext of ['.mdx', '.md']) {
    const filepath = path.join(WRITING_DIR, slug + ext)
    if (fs.existsSync(filepath)) {
      const raw = fs.readFileSync(filepath, 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug,
        title: (data.title as string) ?? slug,
        date: (data.date as string) ?? '',
        tags: data.tags as string[] | undefined,
        excerpt: data.excerpt as string | undefined,
        content,
      }
    }
  }
  return null
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatMonthYear(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}
