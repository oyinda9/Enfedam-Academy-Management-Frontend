"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  Settings,
  UserCircle,
  LogOut,
  Award,
} from "lucide-react";

const Menu = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Assuming you store user role in localStorage after login
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const mainMenuItems = [
    {
      label: "Home",
      icon: <Home size={20} />,
      link: "/",
      visible: ["ADMIN", "STUDENT", "USER", "TEACHER"],
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
      label: "Students",
      icon: <GraduationCap size={20} />,
      link: "/list/students",
      visible: ["ADMIN", "TEACHER", "USER"],
    },
    {
      label: "Exams",
      icon: <ClipboardList size={20} />,
      link: "/list/exams",
      visible: ["ADMIN", "STUDENT", "USER", "TEACHER"],
    },
    {
      label: "Lessons",
      icon: <Book size={20} />,
      link: "/list/lessons",
      visible: ["ADMIN", "TEACHER"],
    },
    {
      label: "Subjects",
      icon: <Book size={20} />,
      link: "/list/subjects",
      visible: ["ADMIN", "TEACHER"],
    },
    {
      label: "Classes",
      icon: <School size={20} />,
      link: "/list/classes",
      visible: ["ADMIN", "TEACHER", "STUDENT"],
    },
    {
      label: "Assignments",
      icon: <FileText size={20} />,
      link: "/list/assignments",
      visible: ["ADMIN", "STUDENT", "TEACHER"],
    },
    {
      label: "Attendance",
      icon: <CheckCircle size={20} />,
      link: "/list/attendance",
      visible: ["ADMIN", "USER", "TEACHER"],
    },
    {
      label: "Result",
      icon: <Award size={20} />,
      link: "/list/results",
      visible: ["ADMIN", "USER", "TEACHER", "STUDENT"],
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
  ];

  const secondaryMenuItems = [
    {
      label: "Settings",
      icon: <Settings size={20} />,
      link: "/settings",
      visible: ["ADMIN", "STUDENT", "TEACHER"],
    },
    {
      label: "Profile",
      icon: <UserCircle size={20} />,
      link: "/profile",
      visible: ["ADMIN", "STUDENT", "USER", "TEACHER"],
    },
    {
      label: "Logout",
      icon: <LogOut size={20} />,
      link: "/logout",
      visible: ["ADMIN", "STUDENT", "USER", "TEACHER"],
    },
  ];

  return (
    <nav className="p-4 w-64 flex flex-col justify-between items-center">
      {/* Main Menu */}
      <div>
        <ul className="space-y-4">
          {mainMenuItems.map((item) => {
            if (userRole && item.visible.includes(userRole)) {
              return (
                <li key={item.label} className="flex flex-col gap-2">
                  <Link
                    href={item.link}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-blue-300"
                  >
                    <span className="text-blue-600">{item.icon}</span>
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>

      {/* Secondary Menu */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Account</h2>
        <ul className="space-y-4">
          {secondaryMenuItems.map((item) => {
            if (userRole && item.visible.includes(userRole)) {
              return (
                <li
                  key={item.label}
                  className="flex items-center space-x-4 cursor-pointer hover:bg-gray-200 p-2 rounded"
                >
                  <Link
                    href={item.link}
                    className="flex items-center space-x-4 text-gray-800 text-sm font-medium"
                  >
                    <span className="text-blue-600">{item.icon}</span>
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
