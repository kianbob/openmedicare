import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicare Drug Costs — Part B Administered Drugs | OpenMedicare',
  description: 'Explore Medicare Part B drug costs. Browse physician-administered drugs by HCPCS J-code with spending data, provider counts, and cost-per-service breakdowns.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
