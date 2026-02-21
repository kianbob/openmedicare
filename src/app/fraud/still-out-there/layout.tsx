import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Still Out There: ML-Flagged Providers — OpenMedicare',
  description: 'AI model trained on 8,300+ confirmed fraudsters identifies Medicare providers with identical billing patterns.',
  openGraph: {
    title: 'Still Out There: ML-Flagged Providers — OpenMedicare',
    description: 'AI model trained on 8,300+ confirmed fraudsters identifies Medicare providers with identical billing patterns.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
