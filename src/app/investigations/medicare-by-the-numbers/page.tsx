import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Breadcrumbs from '@/components/Breadcrumbs'

function loadJson(file: string) {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', file), 'utf-8'))
  } catch { return null }
}

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  return `$${n.toFixed(0)}`
}

interface StatCardProps {
  number: string
  label: string
  description: string
  href: string
  color: string
  align: 'left' | 'right'
}

function StatCard({ number, label, description, href, color, align }: StatCardProps) {
  const alignClass = align === 'right' ? 'md:ml-auto md:text-right' : ''
  const colorMap: Record<string, string> = {
    blue: 'from-blue-600 to-blue-800',
    emerald: 'from-emerald-600 to-emerald-800',
    purple: 'from-purple-600 to-purple-800',
    amber: 'from-amber-500 to-amber-700',
    red: 'from-red-600 to-red-800',
    rose: 'from-rose-600 to-rose-800',
    indigo: 'from-indigo-600 to-indigo-800',
    cyan: 'from-cyan-600 to-cyan-800',
    orange: 'from-orange-500 to-orange-700',
    teal: 'from-teal-600 to-teal-800',
  }
  const gradient = colorMap[color] || colorMap.blue

  return (
    <Link href={href} className={`block max-w-2xl ${alignClass} group`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
        <p className={`text-5xl md:text-7xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent leading-tight`}>
          {number}
        </p>
        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-3">{label}</p>
        <p className="text-gray-500 mt-2 text-base leading-relaxed">{description}</p>
        <span className="inline-block mt-4 text-sm font-medium text-blue-600 group-hover:underline">
          Explore this →
        </span>
      </div>
    </Link>
  )
}

export default function MedicareByTheNumbers() {
  const statesData = loadJson('states.json')
  const proceduresData = loadJson('procedures.json')

  const ca = statesData?.states?.find((s: any) => s.state === 'CA')
  const caTotal = ca ? fmt(ca.total_payments) : '$93.2B'

  const proc99213 = proceduresData?.procedures?.find((p: any) => p.code === '99213')
  const procTotal = proc99213 ? fmt(proc99213.total_payments) : '$44.4B'

  const stats: StatCardProps[] = [
    {
      number: '$854.8B',
      label: 'Total Medicare Payments Over 10 Years',
      description: 'From 2014 to 2023, Medicare paid out $854.8 billion to providers across America — nearly a trillion dollars flowing through a single program.',
      href: '/investigations/ten-year-explosion',
      color: 'blue',
      align: 'left',
    },
    {
      number: '1,721,798',
      label: 'Unique Providers',
      description: 'Nearly two million individual providers billed Medicare at least once. From solo family doctors to billion-dollar lab corporations.',
      href: '/investigations/biggest-billers',
      color: 'emerald',
      align: 'right',
    },
    {
      number: '24.5B',
      label: 'Services Delivered',
      description: '24.5 billion individual medical services — office visits, lab tests, surgeries, injections — every one logged and paid for.',
      href: '/investigations/most-expensive-medicare-procedures',
      color: 'purple',
      align: 'left',
    },
    {
      number: '$94B',
      label: '2023: The Highest Year Ever',
      description: 'Medicare spending hit a record $94 billion in 2023, continuing an upward trend that shows no signs of slowing.',
      href: '/investigations/ten-year-explosion',
      color: 'amber',
      align: 'right',
    },
    {
      number: '$81B',
      label: '2020: The COVID Crash',
      description: 'The pandemic caused the only spending dip in the decade. Elective procedures vanished, and Medicare payments dropped to $81 billion.',
      href: '/investigations/covid-impact',
      color: 'red',
      align: 'left',
    },
    {
      number: '4,636',
      label: '"Impossible" Providers',
      description: 'Providers who billed for more services per day than is physically possible. Some logged over 1,000 services in a single working day.',
      href: '/investigations/impossible-doctors',
      color: 'rose',
      align: 'right',
    },
    {
      number: '500',
      label: 'AI-Flagged for Fraud',
      description: 'Our machine learning model identified 500 providers with billing patterns consistent with fraud — charging far above peers with suspicious volume.',
      href: '/investigations/data-predicted-fraud',
      color: 'indigo',
      align: 'left',
    },
    {
      number: '3.77x',
      label: 'Average Markup Ratio',
      description: 'Providers charge Medicare 3.77 times what they actually get paid. The gap between billed and paid is a $2 trillion write-off.',
      href: '/investigations/two-trillion-writeoff',
      color: 'cyan',
      align: 'right',
    },
    {
      number: caTotal,
      label: 'Top State: California',
      description: 'California leads the nation in Medicare spending — more than any other state by a wide margin, driven by population and high-cost specialties.',
      href: '/investigations/medicare-spending-by-state',
      color: 'orange',
      align: 'left',
    },
    {
      number: procTotal,
      label: 'Top Procedure: 99213 (Office Visit)',
      description: `The 15-minute office visit is the backbone of American medicine. Code 99213 generated ${procTotal} in Medicare payments over the decade.`,
      href: '/investigations/office-visit-economy',
      color: 'teal',
      align: 'right',
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'Medicare By The Numbers', href: '/investigations/medicare-by-the-numbers' },
        ]} />

        <div className="text-center mb-16 mt-4">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">Visual Data Story</span>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-gray-900 mb-4">
            Medicare By The Numbers
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            A decade of American healthcare spending, distilled into the numbers that matter most.
          </p>
        </div>

        <div className="space-y-8 md:space-y-12">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            <p className="text-2xl font-bold text-gray-900 mb-3">Want to dig into the data yourself?</p>
            <p className="text-gray-500 mb-6">Every number on this page comes from public CMS data. We analyzed 10 years of Medicare provider records.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/investigations/how-much-does-your-doctor-make" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Look Up a Specialty →
              </Link>
              <Link href="/investigations" className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Browse All Investigations
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500 text-center">
          <p>Data source: CMS Medicare Provider Utilization and Payment Data, 2014–2023.</p>
        </div>
      </div>
    </main>
  )
}
