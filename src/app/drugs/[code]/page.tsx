import { redirect } from 'next/navigation'
import fs from 'fs'
import path from 'path'

export default async function DrugDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  // J-code drugs have detail pages under /procedures/[code]
  // Redirect there for the full detail view
  redirect(`/procedures/${code.toUpperCase()}`)
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'public', 'data', 'procedures')
  try {
    return fs.readdirSync(dir)
      .filter(f => f.startsWith('J') && f.endsWith('.json'))
      .map(f => ({ code: f.replace('.json', '') }))
  } catch { return [] }
}
