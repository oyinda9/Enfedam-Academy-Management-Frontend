import React from "react";
import Link from "next/link";
import { role } from "../../lib/data";
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
  Award
} from "lucide-react";

const Menu = () => {
  const mainMenuItems = [
    {
      label: "Home",
      icon: <Home size={20} />,
      link: "/",
      visible: ["admin", "student", "parent", "teacher"],
    },
    {
      label: "Teachers",
      icon: <User size={20} />,
      link: "/list/teachers",
      visible: ["admin",],
    },
    {
      label: "Parents",
      icon: <Users size={20} />,
      link: "/list/parents",
      visible: ["admin", "teacher"],
    },
    {
      label: "Students",
      icon: <GraduationCap size={20} />,
      link: "/list/students",
      visible: ["admin", "teacher","parent"
      ],
    },
    {
      label: "Exams",
      icon: <ClipboardList size={20} />,
      link: "/list/exams",
      visible: ["admin", "student", "parent", "teacher"],
    },
    {
      label: "Lessons",
      icon: <Book size={20} />,
      link: "/list/lessons",
      visible: ["admin", "teacher"],
    },
    {
      label: "Classes",
      icon: <School size={20} />,
      link: "/list/classes",
      visible: ["admin", "teacher","student"],
    },
    {
      label: "Assignments",
      icon: <FileText size={20} />,
      link: "/list/assignments",
      visible: ["admin", "student", "parent", "teacher"],
    },
    {
      label: "Attendance",
      icon: <CheckCircle size={20} />,
      link: "/list/attendance",
      visible: ["admin", "parent", "teacher"],
    },
    {
      label: "Result",
      icon: <Award size={20} />,
      link: "/list/results",
      visible: ["admin", "parent", "teacher","student"],
    },
    {
      label: "Events",
      icon: <Calendar size={20} />,
      link: "/list/events",
      visible: ["admin", "student", "parent", "teacher"],
    },
    {
      label: "Messages",
      icon: <MessageSquare size={20} />,
      link: "/list/messages",
      visible: ["admin", "student", "parent", "teacher"],
    },
  ];

  const secondaryMenuItems = [
    {
      label: "Settings",
      icon: <Settings size={20} />,
      link: "/settings",
      visible: ["admin", "student", "parent", "teacher"],
    },
    {
      label: "Profile",
      icon: <UserCircle size={20} />,
      link: "/profile",
      visible: ["admin", "student", "parent", "teacher"],
    },
    {
      label: "Logout",
      icon: <LogOut size={20} />,
      link: "/logout",
      visible: ["admin", "student", "parent", "teacher"],
    },
  ];

  return (
    <nav className="p-4 w-64 flex flex-col justify-between items-center">
      {/* Main Menu */}
      <div>
        <ul className="space-y-4">
          {mainMenuItems.map((item) => {
            if (item.visible.includes(role)) {
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
            if (item.visible.includes(role)) {
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
