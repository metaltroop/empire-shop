import Image from 'next/image'
import Link from 'next/link'

type ServiceCardProps = {
  name: string
  image: string
  href: string
}

export default function ServiceCard({ name, image, href }: ServiceCardProps) {
  return (
    <Link 
      href={href}
      className={`
        flex flex-col items-center gap-3 p-4 rounded-xl
        bg-gradient-to-b from-white to-gray-50
        border border-gray-200
        shadow-[0_2px_8px_rgba(0,0,0,0.06)]
        hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]
        hover:border-blue-200
        hover:from-blue-50 hover:to-white
        hover:scale-[1.02] active:scale-[0.98]
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-blue-400
        h-[140px] justify-between
        group
      `}
    >
      <div className="relative w-14 h-14 transform group-hover:scale-110 transition-transform duration-300">
        <Image
          src={`/${image}.webp`}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
      <span className="text-sm font-medium text-gray-700 text-center min-h-[2.5rem] flex items-center group-hover:text-blue-600 transition-colors duration-300">
        {name}
      </span>
    </Link>
  )
}