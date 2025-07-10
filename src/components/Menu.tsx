"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Home,
  User,
  Users,
  GraduationCap,

  Book,
  School,
  FileText,
  CheckCircle,
  Calendar,
  MessageSquare,
  ReceiptText,
  Captions,
  Award,
  Wallet,
  MenuIcon,
  X,
} from "lucide-react"

const Menu = () => {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const storedRole = localStorage.getItem("role")
    if (storedRole) {
      setUserRole(storedRole)
    }
  }, [])

  const dashboardLinks = {
    ADMIN: "/admin",
    EXECUTIVE: "/executives",
    STUDENT: "/student",
    TEACHER: "/teacher",
    USER: "/parent",
  }

  const mainMenuItems = [
    {
      label: "Home",
      icon: <Home size={20} />,
      link: dashboardLinks[userRole as keyof typeof dashboardLinks] || "/",
      visible: ["ADMIN", "STUDENT", "USER", "TEACHER", "EXECUTIVE"],
    },
    {
      label: "Students",
      icon: <GraduationCap size={20} />,
      link: "/list/students",
      visible: ["ADMIN", "TEACHER", "USER", ],
    },
    {
      label: "Teachers",
      icon: <User size={20} />,
      link: "/list/teachers",
      visible: ["ADMIN","EXECUTIVE",],
    },
    {
      label: "Parents",
      icon: <Users size={20} />,
      link: "/list/parents",
      visible: ["ADMIN", "TEACHER", "EXECUTIVE"],
    },
    {
      label: "Classes",
      icon: <School size={20} />,
      link: "/list/classes",
      visible: ["ADMIN", "TEACHER", "STUDENT", "EXECUTIVE"],
    },
    {
      label: "Subjects",
      icon: <Book size={20} />,
      link: "/list/subjects",
      visible: ["ADMIN", "TEACHER", "EXECUTIVE"],
    },
    {
      label: "Lessons",
      icon: <Captions size={20} />,
      link: "/list/lessons",
      visible: ["ADMIN", "TEACHER", "EXECUTIVE"],
    },
 
    {
      label: "Assignments",
      icon: <FileText size={20} />,
      link: "/list/assignments",
      visible: ["STUDENT", "TEACHER"],
    },
    {
      label: "Attendance",
      icon: <CheckCircle size={20} />,
      link: "/list/attendance",
      visible: ["ADMIN", "TEACHER", "EXECUTIVE"],
    },
    {
      label: "Result",
      icon: <Award size={20} />,
      link: "/list/results",
      visible: ["ADMIN", "USER", "TEACHER", "STUDENT", "EXECUTIVE"],
    },
    {
      label: "Report",
      icon: <ReceiptText size={20} />,
      link: "/list/report",
      visible: ["ADMIN", "EXECUTIVE"],
    },
    {
      label: "Financial Report",
      icon: <Wallet size={20} />,
      link: "/list/finance",
      visible: ["ADMIN"],
    },
    {
      label: "Payment",
      icon: <Wallet size={20} />,
      link: "/list/Payments",
      visible: ["USER"],
    },
    {
      label: "Events",
      icon: <Calendar size={20} />,
      link: "/list/events",
      visible: ["ADMIN", "STUDENT", "USER", "TEACHER", "EXECUTIVE"],
    },
    {
      label: "Messages",
      icon: <MessageSquare size={20} />,
      link: "/list/messages",
      visible: ["ADMIN", "STUDENT", "USER", "TEACHER", "EXECUTIVE"],
    },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white  rounded-md shadow-md border"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMobileMenu} />
      )}

      {/* Navigation Menu */}
      <nav
        className={`
          fixed lg:static top-0 left-0 h-full bg-white  lg:border-r lg:border-gray-200 z-40 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
           p-4 flex flex-col justify-start
        `}
      >
        {/* Main Menu */}
        <div className="flex-1">
          <ul className="space-y-2">
            {mainMenuItems.map((item) => {
              if (userRole && item.visible.includes(userRole)) {
                return (
                  <li key={item.label}>
                    <Link
                      href={item.link}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 text-gray-600 py-3 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 group"
                    >
                      <span className="text-blue-600 group-hover:text-blue-700 flex-shrink-0">{item.icon}</span>
                      <span className="font-medium text-xs">{item.label}</span>
                    </Link>
                  </li>
                )
              }
              return null
            })}
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Menu
