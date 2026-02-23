import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Is Your Doctor Flagged? Free Medicare Provider Lookup',
  description: 'Check if your doctor appears on our Medicare fraud watchlist or flagged provider lists. Search by name or NPI — free, instant, and based on public CMS data.',
  openGraph: {
    title: 'Is Your Doctor Flagged? Free Medicare Provider Lookup',
    description: 'Check if your doctor appears on our Medicare fraud watchlist or flagged provider lists. Search by name or NPI — free, instant, and based on public CMS data.',
    url: 'https://www.openmedicare.us/lookup',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
