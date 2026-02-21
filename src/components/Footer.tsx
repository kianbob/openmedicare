import Link from 'next/link'

const sisterSites = [
  { name: 'OpenMedicaid', href: 'https://www.openmedicaid.org', description: 'Medicaid spending transparency' },
  { name: 'OpenFeds', href: 'https://www.openfeds.org', description: 'Federal spending transparency' },
  { name: 'OpenSpending', href: 'https://www.openspending.us', description: 'Government spending data' },
]

const navigation = [
  {
    name: 'Explore',
    items: [
      { name: 'Providers', href: '/providers' },
      { name: 'Procedures', href: '/procedures' },
      { name: 'States', href: '/states' },
      { name: 'Specialties', href: '/specialties' },
    ],
  },
  {
    name: 'Analysis',
    items: [
      { name: 'Watchlist', href: '/watchlist' },
      { name: 'Markup Analysis', href: '/markup' },
      { name: 'Drug Spending', href: '/drug-spending' },
      { name: 'Rural vs Urban', href: '/rural-urban' },
    ],
  },
  {
    name: 'Tools',
    items: [
      { name: 'Provider Lookup', href: '/lookup' },
      { name: 'Compare Providers', href: '/compare' },
      { name: 'Cost Calculator', href: '/calculator' },
    ],
  },
  {
    name: 'About',
    items: [
      { name: 'About Us', href: '/about' },
      { name: 'Data Downloads', href: '/downloads' },
      { name: 'Investigations', href: '/investigations' },
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
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div>
              <Link href="/" className="text-2xl font-bold text-white font-playfair">
                OpenMedicare
              </Link>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                Follow the Money in Medicare
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Professional data journalism tracking Medicare physician spending across 10 years (2014-2023).
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">Sister Sites</h3>
              <ul role="list" className="mt-6 space-y-4">
                {sisterSites.map((site) => (
                  <li key={site.name}>
                    <a
                      href={site.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      <span className="font-medium">{site.name}</span>
                      <span className="block text-xs text-gray-400">{site.description}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">{navigation[0].name}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation[0].items.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">{navigation[1].name}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation[1].items.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">{navigation[2].name}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation[2].items.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">{navigation[3].name}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation[3].items.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <p>&copy; {new Date().getFullYear()} OpenMedicare. Independent data journalism.</p>
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