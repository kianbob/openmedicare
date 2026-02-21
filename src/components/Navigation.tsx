'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
  {
    name: 'Explore',
    href: '#',
    children: [
      { name: 'Providers', href: '/providers' },
      { name: 'Procedures', href: '/procedures' },
      { name: 'States', href: '/states' },
      { name: 'Specialties', href: '/specialties' },
    ],
  },
  {
    name: 'Analysis',
    href: '#',
    children: [
      { name: 'Watchlist', href: '/watchlist' },
      { name: 'Markup', href: '/markup' },
      { name: 'Drug Spending', href: '/drug-spending' },
      { name: 'Rural vs Urban', href: '/rural-urban' },
      { name: 'Trends', href: '/trends' },
    ],
  },
  {
    name: 'Investigations',
    href: '/investigations',
    children: [],
  },
  {
    name: 'Tools',
    href: '#',
    children: [
      { name: 'Provider Lookup', href: '/lookup' },
      { name: 'Compare', href: '/compare' },
      { name: 'Calculator', href: '/calculator' },
    ],
  },
  {
    name: 'About',
    href: '/about',
    children: [],
  },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-gray-200 py-4 lg:border-none">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-medicare-primary font-playfair">
                OpenMedicare
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="ml-10 hidden space-x-8 lg:flex">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.children.length > 0 ? (
                  <div
                    className="group"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center text-sm font-medium text-gray-700 hover:text-medicare-primary">
                      {item.name}
                      <ChevronDownIcon className="ml-1 h-4 w-4" />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="absolute left-0 z-10 mt-2 w-48 origin-top-left bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-medicare-primary"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-medicare-primary"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="text-xl font-bold text-medicare-primary font-playfair">
                    OpenMedicare
                  </span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <div key={item.name}>
                        {item.children.length > 0 ? (
                          <div>
                            <div className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900">
                              {item.name}
                            </div>
                            <div className="ml-4 space-y-1">
                              {item.children.map((child) => (
                                <Link
                                  key={child.name}
                                  href={child.href}
                                  className="block rounded-lg px-3 py-2 text-sm leading-7 text-gray-700 hover:bg-gray-50 hover:text-medicare-primary"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-medicare-primary"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}