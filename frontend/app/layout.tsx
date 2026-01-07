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
      <body className="min-h-screen">
        {/* Decorative corner flourish */}
        <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none opacity-[0.07]">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--color-ink)]">
            <path d="M0,0 Q50,10 50,50 Q10,50 0,0" fill="currentColor" />
            <path d="M10,0 L10,30 M0,10 L30,10" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
        <div className="fixed top-0 right-0 w-32 h-32 pointer-events-none opacity-[0.07] -scale-x-100">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--color-ink)]">
            <path d="M0,0 Q50,10 50,50 Q10,50 0,0" fill="currentColor" />
            <path d="M10,0 L10,30 M0,10 L30,10" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
        </div>

        {children}
      </body>
    </html>
  )
}
