import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 's402 - HTTP-402 Payments for Sei',
  description: 'Built on x402 by Coinbase. Optimized for Sei. Real micropayments, real transactions.',
  keywords: 'sei, payments, http-402, micropayments, usdc, blockchain',
  authors: [{ name: 's402 Team' }],
  openGraph: {
    title: 's402 - HTTP-402 Payments for Sei',
    description: 'Micropayments protocol for Sei. Built on x402 foundation.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brutal-white">
        {children}
      </body>
    </html>
  )
}


