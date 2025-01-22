import React from "react";
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
} from "lucide-react";

const Menu = () => {
  const mainMenuItems = [
    { label: "Home", icon: <Home size={20} />, link: "/home" },
    { label: "Teachers", icon: <User size={20} />, link: "/teachers" },
    { label: "Parents", icon: <Users size={20} />, link: "/parents" },
    { label: "Students", icon: <GraduationCap size={20} />, link: "/students" },
    { label: "Exams", icon: <ClipboardList size={20} />, link: "/exams" },
    { label: "Lessons", icon: <Book size={20} />, link: "/lessons" },
    { label: "Classes", icon: <School size={20} />, link: "/classes" },
    {
      label: "Assignments",
      icon: <FileText size={20} />,
      link: "/assignments",
    },
    {
      label: "Attendance",
      icon: <CheckCircle size={20} />,
      link: "/attendance",
    },
    { label: "Events", icon: <Calendar size={20} />, link: "/events" },
    { label: "Messages", icon: <MessageSquare size={20} />, link: "/messages" },
  ];

  const secondaryMenuItems = [
    { label: "Settings", icon: <Settings size={20} />, link: "/settings" },
    { label: "Profile", icon: <UserCircle size={20} />, link: "/profile" },
    { label: "Logout", icon: <LogOut size={20} />, link: "/logout" },
  ];

  return (
    <nav className="p-4 w-64  flex flex-col justify-between items-center">
      {/* Main Menu */}
      <div>
    
        <ul className="space-y-4">
          {mainMenuItems.map((item, index) => (
            <li
              key={index}
              className="flex items-center space-x-4 cursor-pointer hover:bg-gray-200 p-2 rounded"
            >
              <span className="text-blue-600">{item.icon}</span>
              <a
                href={item.link}
                className="text-gray-800 text-sm font-medium hidden lg:block "
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Secondary Menu */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Account</h2>
        <ul className="space-y-4">
          {secondaryMenuItems.map((item, index) => (
            <li
              key={index}
              className="flex items-center space-x-4 cursor-pointer hover:bg-gray-200 p-2 rounded"
            >
              <span className="text-blue-600">{item.icon}</span>
              <a
                href={item.link}
                className="text-gray-800 text-sm font-medium hidden lg:block"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
