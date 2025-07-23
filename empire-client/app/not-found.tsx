
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-blue-500">Coming Soon!</h1>
        <p className="text-gray-600">
          We're working hard to bring you something amazing.
        </p>
        <div className="mt-8">
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg
                     hover:bg-blue-600 transition-colors duration-200"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}