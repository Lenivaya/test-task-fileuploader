import './globals.css'
import '@file-uploader/ui/styles.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { TRPCProvider } from './providers'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'File Uploader',
  description: 'A modern file management application',
  keywords: ['file upload', 'file management', 'cloud storage'],
  authors: [{ name: 'File Uploader Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#f8fafc'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='h-full'>
      <body className={`${inter.className} h-full`}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  )
}
