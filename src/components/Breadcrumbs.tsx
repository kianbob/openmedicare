import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/solid'

interface BreadcrumbItem {
  name: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Auto-prepend Home as specified in requirements
  const allItems = [
    { name: 'Home', href: '/' },
    ...items
  ]

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => (
          <li key={item.name} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
            )}
            
            {item.href && index < allItems.length - 1 ? (
              <Link 
                href={item.href}
                className="text-sm text-gray-500 hover:text-medicare-primary transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-sm text-gray-900 font-medium">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}