import Link from 'next/link'

const sisterSites = [
  { name: 'OpenMedicaid', href: 'https://www.openmedicaid.org', description: 'Medicaid Spending Tracker' },
  { name: 'OpenFeds', href: 'https://www.openfeds.org', description: 'Federal Workforce Tracker' },
  { name: 'OpenSpending', href: 'https://www.openspending.us', description: 'Federal Spending Tracker' },
]

const navigation = [
  {
    name: 'Explore',
    items: [
      { name: 'Providers', href: '/providers' },
      { name: 'Procedures', href: '/procedures' },
      { name: 'States', href: '/states' },
      { name: 'Specialties', href: '/specialties' },
      { name: 'Search', href: '/search' },
    ],
  },
  {
    name: 'Fraud Analysis',
    items: [
      { name: 'Still Out There (AI)', href: '/fraud/still-out-there' },
      { name: 'Fraud Overview', href: '/fraud' },
      { name: 'Fraud Watchlist', href: '/fraud/watchlist' },
      { name: 'Deep Dive Profiles', href: '/fraud/deep-dives' },
      { name: 'Impossible Numbers', href: '/fraud/impossible-numbers' },
      { name: 'Report Fraud', href: '/fraud/report' },
    ],
  },
  {
    name: 'Investigations',
    items: [
      { name: 'The Algorithm Knows', href: '/investigations/algorithm-knows' },
      { name: 'How We Built the Model', href: '/investigations/how-we-built-the-model' },
      { name: 'Internal Medicine Crisis', href: '/investigations/internal-medicine-crisis' },
      { name: 'Florida & California Fraud', href: '/investigations/florida-california-fraud' },
      { name: 'Million Dollar Flagged', href: '/investigations/million-dollar-flagged' },
      { name: 'All Investigations', href: '/investigations' },
    ],
  },
  {
    name: 'Tools',
    items: [
      { name: 'Provider Lookup', href: '/lookup' },
      { name: 'Compare', href: '/compare' },
      { name: 'Cost Calculator', href: '/calculator' },
      { name: 'Your Medicare Dollar', href: '/your-medicare-dollar' },
      { name: 'Downloads', href: '/downloads' },
    ],
  },
  {
    name: 'About',
    items: [
      { name: 'About OpenMedicare', href: '/about' },
      { name: 'Methodology', href: '/methodology' },
      { name: 'Glossary', href: '/glossary' },
      { name: 'Data Sources', href: '/data-sources' },
      { name: 'API Docs', href: '/api-docs' },
      { name: 'Updates', href: '/updates' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-6 xl:gap-8">
          <div className="xl:col-span-1 space-y-8">
            <div>
              <Link href="/" className="text-2xl font-bold text-white font-playfair">
                OpenMedicare
              </Link>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                Independent Medicare data journalism
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">Sister Sites</h3>
              <ul role="list" className="mt-4 space-y-3">
                {sisterSites.map((site) => (
                  <li key={site.name}>
                    <a href={site.href} target="_blank" rel="noopener noreferrer" className="text-sm leading-6 text-gray-300 hover:text-white">
                      {site.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-16 xl:mt-0 xl:col-span-5 grid grid-cols-2 md:grid-cols-5 gap-8">
            {navigation.map((section) => (
              <div key={section.name}>
                <h3 className="text-sm font-semibold leading-6 text-white">{section.name}</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="text-xs leading-5 text-gray-400">
            <div className="mb-4">
              <strong>Data Sources:</strong> Centers for Medicare & Medicaid Services (CMS), Medicare Provider Utilization and Payment Data
            </div>
            <div className="mb-4">
              <strong>Disclaimer:</strong> This site is an independent journalism project. Data analysis and editorial content are not affiliated with or endorsed by CMS or any government agency. All spending figures are based on publicly available Medicare payment records.
            </div>
            <div className="mb-4">
              <strong>Sister Sites:</strong>{' '}
              <a href="https://www.openmedicaid.org" target="_blank" rel="noopener noreferrer" className="hover:text-white">OpenMedicaid</a>
              {' · '}
              <a href="https://www.openfeds.org" target="_blank" rel="noopener noreferrer" className="hover:text-white">OpenFeds</a>
              {' · '}
              <a href="https://www.openspending.us" target="_blank" rel="noopener noreferrer" className="hover:text-white">OpenSpending</a>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <p>&copy; {new Date().getFullYear()} OpenMedicare. Independent data journalism. Built by <a href="https://thedataproject.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">TheDataProject.ai</a></p>
              <div className="mt-2 sm:mt-0">
                <Link href="/about" className="hover:text-white">Methodology</Link>
                <span className="mx-2">•</span>
                <Link href="/downloads" className="hover:text-white">Download Data</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}