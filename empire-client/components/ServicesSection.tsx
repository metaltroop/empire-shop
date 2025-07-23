// empire-client/components/ServicesSection.tsx
import { lazy, Suspense } from 'react'
import Link from 'next/link'

// Lazy load ServiceCard
const ServiceCard = lazy(() => import('./ServiceCard'))

const services = [
  {
    name: 'Custom PC Build',
    image: 'cpb',
    href: '/PartPicker',
    color: 'blue'
  },
  {
    name: 'PC Repair',
    image: 'pc-repair',
    href: '/services/pc-repair',
    color: 'orange'
  },
  {
    name: 'Laptop Repair',
    image: 'laptop',
    href: '/services/laptop-repair',
    color: 'purple'
  },
  {
    name: 'Printer Service',
    image: 'printer',
    href: '/services/printer',
    color: 'green'
  },
  {
    name: 'CCTV',
    image: 'cctv',
    href: '/services/cctv',
    color: 'red'
  },
  {
    name: 'PC Accessories',
    image: 'accessories',
    href: '/services/accessories',
    color: 'yellow'
  }
]

export default function ServicesSection() {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold">Our Services</h2>
        <Link href="/services" className="text-sm text-blue-600">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 w-full">
        {services.map((service) => (
          <div key={service.name} className="w-full">
            <Suspense fallback={
              <div className="animate-pulse bg-gray-200 rounded-2xl h-[140px]" />
            }>
              <ServiceCard
                name={service.name}
                image={service.image}
                href={service.href}
              />
            </Suspense>
          </div>
        ))}
      </div>
    </section>
  )
}