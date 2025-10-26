import type { Metadata } from 'next'
import { plusJakartaSans } from "@/lib/fonts";
import './globals.css'
import { QueryProvider } from "@/providers/query-provider";

export const metadata: Metadata = {
  title: 'Real Estate Search',
  description: 'Find your perfect property with AI-powered search',
}

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
    <body className={plusJakartaSans.className}>
    <QueryProvider>
      {children}
    </QueryProvider>
    </body>
    </html>
  )
}