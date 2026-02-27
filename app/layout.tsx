import type { Metadata } from 'next'
import { Nunito, DM_Sans, Cinzel } from 'next/font/google'
import './globals.css'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', weight: ['400','600','700','800'] })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body', weight: ['400','500','600'] })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', weight: ['400','700'] })

export const metadata: Metadata = {
  title: 'jennypooh 🤖🐉',
  description: 'Choose your companion and discover your compatibility.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${dmSans.variable} ${cinzel.variable} antialiased`}>
        <div className="page-fade">{children}</div>
      </body>
    </html>
  )
}
