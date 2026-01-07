import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Study with Hubert',
  description: 'Transform your readings into structured arguments, evidence, and insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
