import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'History Reading Analyzer',
  description: 'Break down your history readings into key arguments and evidence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
