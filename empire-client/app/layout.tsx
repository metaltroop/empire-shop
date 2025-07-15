import BottomNav from '@/components/BottomNav'
import './globals.css'

export const metadata = {
  title: 'Empire Infotech',
  description: 'Custom PC, Repair & Accessories',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative pb-20"> {/* bottom padding for nav */}
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
