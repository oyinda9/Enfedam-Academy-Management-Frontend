import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="h-screen flex">
        {/* LEFT (Sidebar) */}
        <div className="w-[14%] md:w-[25%] lg:w-[16%] xl:w-[14%] bg-white shadow-md">
          <Link
            href="/"
            className="flex items-center gap-2 mt-6 ml-4"
          >
            <Image src="/enfedam logo.jpg" alt="logo" width={40} height={32} />
            <span className="hidden lg:block text-lg font-medium">Enfedam Academy</span>
          </Link>
          <Menu />
        </div>
    
        {/* RIGHT (Main Content) */}
        <div className="w-[86%] md:w-[75%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-auto">
          <Navbar />
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
    
  }