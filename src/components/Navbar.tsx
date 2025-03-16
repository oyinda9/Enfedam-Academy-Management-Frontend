"use client";
import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { Search, MessageCircle, Megaphone, UserCircle } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserName(userData.name || ""); // Default to "User" if name is missing
      setUserRole(userData.role || ""); // Default to "Admin" if role is missing
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/"); // Redirect to login page
  };

  return (
    <div className="flex items-center justify-between mr-6">
      {/* SEARCH BAR */}
      <div className="hidden md:flex mt-6">
        <div className="relative w-full mx-4">
          <input
            type="text"
            placeholder="Search menu..."
            className="pl-10 pr-2 py-2 w-full border border-black rounded-full text-gray-700 text-sm "
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 "
          />
        </div>
      </div>

      {/* ICONS AND USERS */}
      <div className="flex items-center gap-8 mt-6">
        {/* Message Icon */}
        <div className="bg-white w-8 h-8 flex items-center justify-center rounded-full shadow cursor-pointer">
          <MessageCircle size={20} className="text-blue-500" />
        </div>

        {/* Announcement Icon with Notification Badge */}
        <div className="relative">
          <div className="bg-white w-8 h-8 flex items-center justify-center rounded-full shadow cursor-pointer">
            <Megaphone size={20} className="text-blue-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
            1
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-sm">
            <span className="font-medium text-gray-800">{userName}</span>
            <span className="text-xs text-gray-400">{userRole}</span>
          </div>
          <div className="relative">
            {/* User Icon */}
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer relative flex items-center"
            >
              <UserCircle size={26} className="text-gray-500" />
            </div>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-[300px] bg-white shadow-lg rounded-lg border z-10">
                <ul className="py-2 text-gray-700">
                  <li>
                    <a
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
                <div className="border-t px-4 py-4 text-xs text-gray-500 text-center">
                  Powered by Enfedam Academy
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
