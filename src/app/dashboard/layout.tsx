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
      <div className="w-[90%] sm:w-[40%] md:w-[30%] lg:w-[20%] xl:w-[16%]  bg-white">
        <Link href="/" className="flex items-center gap-2 mt-6 ml-4">
          <Image src="/enfedam logo.jpg" alt="logo" width={40} height={32} />
          <span className=" font-bold hidden sm:block text-sm md:text-base lg:text-lg  whitespace-nowrap">
            Enfedam Academy
          </span>
        </Link>
        <Menu />
      </div>

      {/* RIGHT (Main Content) */}
      <div className="w-full sm:w-[90%] md:w-[75%] lg:w-[80%] xl:w-[85%] bg-[#F7F8FA]  overflow-auto">
        <Navbar />
        <div className="p-4 ">{children}</div>
      </div>
    </div>
  );
}
