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
        flex flex-col items-center gap-3 p-4 rounded-2xl
        bg-white border border-gray-200
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        hover:border-gray-300 
        hover:scale-[1.02] active:scale-[0.98]
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-blue-500
        h-[140px] justify-between
      `}
    >
      <div className="relative w-14 h-14">
        <Image
          src={`/${image}.webp`}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
      <span className="text-sm font-medium text-gray-800 text-center min-h-[2.5rem] flex items-center">
        {name}
      </span>
    </Link>
  )
}