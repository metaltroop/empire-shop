//empire-client/app/layout.tsx
import BottomNav from '@/components/BottomNav'
import { CartProvider } from '@/contexts/CartContext'
import './globals.css'
import '@/styles/animations.css'

export const metadata = {
  title: 'Empire Infotech',
  description: 'Custom PC, Repair & Accessories',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative pb-20"> {/* bottom padding for nav */}
        <CartProvider>
          {children}
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  )
}
