import React from "react";
import { Search, MessageCircle, Megaphone, UserCircle } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between">
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
            <span className="font-medium text-gray-800">Sholanke Precious</span>
            <span className="text-xs text-gray-400">Admin</span>
          </div>
          <div>
            <UserCircle size={26} className="text-gray-500 mr-6 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
