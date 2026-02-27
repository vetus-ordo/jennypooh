import type { Metadata } from 'next'
import { Lora, Nunito } from 'next/font/google'
import './globals.css'

const lora = Lora({ subsets: ['latin'], variable: '--font-lora' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'Life Scenarios | Compatibility Quest',
  description: 'Choose your companion and discover your compatibility.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${nunito.variable} antialiased`}>
        <div className="page-fade">{children}</div>
      </body>
    </html>
  )
}
