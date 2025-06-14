"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Home,
  User,
  Users,
  GraduationCap,
  ClipboardList,
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
    STUDENT: "/student",
    TEACHER: "/teacher",
    USER: "/parent",
  }

  const mainMenuItems = [
    {
      label: "Home",
      icon: <Home size={20} />,
      link: dashboardLinks[userRole as keyof typeof dashboardLinks] || "/",
      visible: ["ADMIN", "STUDENT", "USER", "TEACHER"],
    },
    {
      label: "Students",
      icon: <GraduationCap size={20} />,
      link: "/list/students",
      visible: ["ADMIN", "TEACHER", "USER"],
    },
    {
      label: "Teachers",
      icon: <User size={20} />,
      link: "/list/teachers",
      visible: ["ADMIN"],
    },
    {
      label: "Parents",
      icon: <Users size={20} />,
      link: "/list/parents",
      visible: ["ADMIN", "TEACHER"],
    },
    {
      label: "Classes",
      icon: <School size={20} />,
      link: "/list/classes",
      visible: ["ADMIN", "TEACHER", "STUDENT"],
    },
    {
      label: "Subjects",
      icon: <Book size={20} />,
      link: "/list/subjects",
      visible: ["ADMIN", "TEACHER"],
    },
    {
      label: "Lessons",
      icon: <Captions size={20} />,
      link: "/list/lessons",
      visible: ["ADMIN", "TEACHER"],
    },
    {
      label: "Exams",
      icon: <ClipboardList size={20} />,
      link: "/list/exams",
      visible: ["ADMIN", "STUDENT", "TEACHER"],
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
      visible: ["ADMIN", "TEACHER"],
    },
    {
      label: "Result",
      icon: <Award size={20} />,
      link: "/list/results",
      visible: ["ADMIN", "USER", "TEACHER", "STUDENT"],
    },
    {
      label: "Report",
      icon: <ReceiptText size={20} />,
      link: "/list/report",
      visible: ["ADMIN"],
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
      visible: ["ADMIN", "STUDENT", "USER", "TEACHER"],
    },
    {
      label: "Messages",
      icon: <MessageSquare size={20} />,
      link: "/list/messages",
      visible: ["ADMIN", "STUDENT", "USER", "TEACHER"],
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md border"
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
          fixed lg:static top-0 left-0 h-full bg-white border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-64 lg:w-64 p-4 flex flex-col justify-start overflow-y-auto
        `}
      >
        {/* Mobile Menu Header */}
        <div className="lg:hidden flex justify-between items-center mb-6 pt-12">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
        </div>

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
                      <span className="font-medium text-sm lg:text-base">{item.label}</span>
                    </Link>
                  </li>
                )
              }
              return null
            })}
          </ul>
        </div>

        {/* Footer for mobile */}
        <div className="lg:hidden mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">School Management System</p>
        </div>
      </nav>
    </>
  )
}

export default Menu
