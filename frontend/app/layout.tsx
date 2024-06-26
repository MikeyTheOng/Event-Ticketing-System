import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

import SessionProvider from "@/components/SessionProvider"

import Navbar from "@/components/ui/navbar/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EventJar | Your Ultimate Event Booking Platform",
  description:
    "Discover and book your next memorable event with EventJar, the leading platform for events and entertainment. Whether you're looking to attend concerts, sports events, or local festivals, EventJar makes it easy to find, compare, and secure your spot effortlessly. Join the fun today!",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={`${inter.className} bg-slate-200`}>
          <div className="" id="navbar">
            <Navbar session={session} />
          </div>
          <div className="">{children}</div>
        </body>
      </SessionProvider>
    </html>
  )
}
