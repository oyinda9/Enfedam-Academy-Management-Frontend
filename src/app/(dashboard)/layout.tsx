import type React from "react"
import Link from "next/link"
import Image from "next/image"
import Menu from "@/components/Menu"
import Navbar from "@/components/Navbar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-screen flex">
      {/* Sidebar - Hidden on mobile, visible on md+ */}
      <div className="hidden md:flex md:w-[30%] lg:w-[20%] xl:w-[16%] bg-white flex-col flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 mt-6 ml-4">
          <Image src="/enfedam logo.jpg" alt="logo" width={40} height={32} />
          <span className="font-bold text-black text-[12px] md:text-[12px] lg:text-[14px] whitespace-nowrap">
            Enfedam Academy
          </span>
        </Link>
        <Menu />
      </div>

      {/* Main content */}
      <div className="flex-1 bg-[#F7F8FA]  overflow-auto flex flex-col">
        <Navbar />
        {/* Mobile Menu - Only shows on mobile */}
        <div className="md:hidden">
          <Menu />
        </div>
        <div className="p-4 flex-1">{children}</div>
      </div>
    </div>
  )
}
