'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDownIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const navigation = [
  {
    name: 'Start Here',
    href: '/start',
    children: [],
    highlight: true,
  },
  {
    name: 'Explore',
    href: '/providers',
    children: [
      { name: 'Providers', href: '/providers', desc: 'Search 1.7M+ providers' },
      { name: 'Procedures', href: '/procedures', desc: '500 HCPCS codes analyzed' },
      { name: 'States', href: '/states', desc: 'All 50 states + territories' },
      { name: 'Specialties', href: '/specialties', desc: '100+ medical specialties' },
    ],
  },
  {
    name: 'Fraud',
    href: '/fraud',
    children: [
      { name: 'Fraud Overview', href: '/fraud', desc: 'Hub for all fraud analysis' },
      { name: 'Fraud Watchlist', href: '/fraud/watchlist', desc: '500 flagged providers' },
      { name: 'Deep Dive Profiles', href: '/fraud/deep-dives', desc: 'Top 20 most suspicious' },
      { name: 'Impossible Numbers', href: '/fraud/impossible-numbers', desc: '400+ services/day?' },
      { name: 'Report Fraud', href: '/fraud/report', desc: 'OIG hotline & resources' },
    ],
  },
  {
    name: 'Investigations',
    href: '/investigations',
    children: [],
  },
  {
    name: 'Data',
    href: '/trends',
    children: [
      { name: 'Spending Trends', href: '/trends', desc: '10-year payment patterns' },
      { name: 'Markup Analysis', href: '/markup', desc: 'Charged vs paid' },
      { name: 'Drug Spending', href: '/drug-spending', desc: 'Pharmaceutical pipeline' },
      { name: 'Rural vs Urban', href: '/rural-urban', desc: 'Geographic divide' },
      { name: 'Deep Analysis', href: '/analysis', desc: 'All 9 analysis pages' },
      { name: 'Downloads', href: '/downloads', desc: 'Raw data & CSVs' },
    ],
  },
  {
    name: 'Tools',
    href: '/lookup',
    children: [
      { name: 'Provider Lookup', href: '/lookup', desc: 'Search any provider' },
      { name: 'Compare', href: '/compare', desc: 'Side-by-side comparison' },
      { name: 'Cost Calculator', href: '/calculator', desc: 'Estimate procedure costs' },
      { name: 'Your Medicare Dollar', href: '/your-medicare-dollar', desc: 'Where your taxes go' },
    ],
  },
  {
    name: 'About',
    href: '/about',
    children: [
      { name: 'About OpenMedicare', href: '/about', desc: 'Our mission' },
      { name: 'Methodology', href: '/methodology', desc: 'How we analyze the data' },
      { name: 'Updates', href: '/updates', desc: 'What\'s new' },
    ],
  },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveDropdown(name)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const handleDropdownEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-3 lg:py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-medicare-primary font-playfair">
                OpenMedicare
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="ml-10 hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.children.length > 0 ? (
                  <div
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        pathname?.startsWith(item.href) && item.href !== '/providers'
                          ? 'text-medicare-primary bg-blue-50'
                          : 'text-gray-700 hover:text-medicare-primary hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                      <ChevronDownIcon className={`ml-1 h-3.5 w-3.5 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </Link>

                    {activeDropdown === item.name && (
                      <div
                        className="absolute left-0 top-full pt-1 z-50"
                        onMouseEnter={handleDropdownEnter}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div className="w-64 bg-white rounded-lg shadow-lg ring-1 ring-black/5 py-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2.5 hover:bg-blue-50 transition-colors"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div className="text-sm font-medium text-gray-900">{child.name}</div>
                              {child.desc && (
                                <div className="text-xs text-gray-500 mt-0.5">{child.desc}</div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      (item as any).highlight
                        ? 'text-medicare-primary bg-blue-50 border border-medicare-primary/30 hover:bg-blue-100'
                        : pathname?.startsWith(item.href)
                          ? 'text-medicare-primary bg-blue-50'
                          : 'text-gray-700 hover:text-medicare-primary hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Search icon */}
          <Link href="/search" className="ml-2 p-2 text-gray-500 hover:text-medicare-primary rounded-md hover:bg-gray-50 transition-colors" aria-label="Search">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </Link>

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
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/25"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
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

            <div className="px-4 py-4">
              {navigation.map((item) => (
                <div key={item.name} className="mb-1">
                  {item.children.length > 0 ? (
                    <div>
                      <button
                        className="flex items-center justify-between w-full rounded-lg px-3 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileExpanded(mobileExpanded === item.name ? null : item.name)}
                      >
                        {item.name}
                        <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${mobileExpanded === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileExpanded === item.name && (
                        <div className="ml-2 mb-2 border-l-2 border-blue-100">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block rounded-lg px-4 py-2.5 hover:bg-blue-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <div className="text-sm font-medium text-gray-800">{child.name}</div>
                              {child.desc && (
                                <div className="text-xs text-gray-500">{child.desc}</div>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50"
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
      )}
    </header>
  )
}
