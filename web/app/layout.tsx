import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Daily Quests',
  description: 'Create by lahuman',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <header>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
              <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                <a href="/" className="flex items-center">
                  <Image src="/ironMan.png" height={9} width={20} className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                  <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">DQ</span>
                </a>
                <ul className="flex">
                  <li className="mr-6">
                    <Link className="text-blue-500 hover:text-blue-800" href="/todo">Quest</Link>
                  </li>
                  <li className="mr-6">
                    <Link className="text-blue-500 hover:text-blue-800" href="/member">Member</Link>
                  </li>
                  <li className="mr-6">
                    <Link className="text-blue-500 hover:text-blue-800" href="/manager/req">Manager</Link>
                  </li>
                </ul>
              </div>
            </nav>
          </header>
          {children}</AuthProvider>
      </body>
    </html>
  )
}
