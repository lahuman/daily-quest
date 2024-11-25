

import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { HomeIcon, UserGroupIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import ClientNavLink from './ClientNavLink';

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
          <div className="flex flex-col h-screen bg-gray-50">
            {/* 모바일 상단 헤더 */}
            <header className="sticky top-0 z-50 bg-white shadow-sm md:hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <Link href="/" className="flex items-center space-x-2">
                  <Image
                    src="/ironMan.png"
                    height={32}
                    width={32}
                    className="rounded-lg"
                    alt="Logo"
                  />
                  <span className="text-xl font-bold text-gray-800">DQ</span>
                </Link>
              </div>
              {/* 모바일 네비게이션 */}
              <nav className="flex justify-around border-t border-gray-200 bg-white">

                <ClientNavLink href="/todo" isPc={false}>
                  <HomeIcon className="w-6 h-6" />
                  <span className="text-xs mt-1">할일</span>
                </ClientNavLink>
                <ClientNavLink href="/member" isPc={false}>
                  <UserGroupIcon className="w-6 h-6" />
                  <span className="text-xs mt-1">회원</span>
                </ClientNavLink>

                <ClientNavLink href="/manager/req" isPc={false}>
                  <Cog6ToothIcon className="w-6 h-6" />
                  <span className="text-xs mt-1">관리</span>
                </ClientNavLink>

              </nav>
            </header>

            {/* PC 사이드바 */}
            <aside className="hidden md:block w-64 bg-white shadow-lg fixed h-full">
              <div className="p-6">
                <Link href="/" className="flex items-center space-x-3">
                  <Image
                    src="/ironMan.png"
                    height={40}
                    width={40}
                    className="rounded-xl"
                    alt="Logo"
                  />
                  <span className="text-2xl font-bold text-gray-800">DQ</span>
                </Link>
              </div>

              <nav className="mt-6">
                <div className="px-4 space-y-2">

                  <ClientNavLink href="/todo" isPc={true}>
                    <HomeIcon className="w-6 h-6" />
                    <span className="font-medium">할일</span>
                  </ClientNavLink>


                  <ClientNavLink href="/member" isPc={true}>
                    <UserGroupIcon className="w-6 h-6" />
                    <span className="font-medium">회원</span>
                  </ClientNavLink>

                  <ClientNavLink href="/manager/req" isPc={true}>
                    <Cog6ToothIcon className="w-6 h-6" />
                    <span className="font-medium">관리</span>
                  </ClientNavLink>

                </div>
              </nav>
            </aside>

            {/* 메인 컨텐츠 */}
            <main className="flex-1 md:ml-64 overflow-y-auto">
              <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-4xl">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
