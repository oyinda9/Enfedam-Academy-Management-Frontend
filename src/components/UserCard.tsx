import React from "react";
import { Ellipsis } from "lucide-react";

const UserCard = ({ type, count }: { type: string; count: number }) => {
  return (
    <div className="rounded-2xl odd:bg-[#5fa0cb] even:bg-red-500 px-3 py-3 w-[140px] sm:w-[180px] md:w-[220px] lg:w-[260px]">
      <div className="flex items-center justify-between w-full">
        {/* Year badge hidden on mobile, shown on sm and up */}
        <span className="hidden sm:inline-block text-[10px] bg-white px-2 py-1 rounded-full text-green-500">
          2024/2025
        </span>
        {/* Ellipsis on the left */}
        <Ellipsis className="text-white h-4 w-4 sm:h-5 sm:w-5 cursor-pointer" />
      </div>
      <h1 className="text-lg sm:text-xl text-white mt-2">
        {count.toLocaleString()}
      </h1>
      <h2 className="capitalize text-xs sm:text-sm font-medium text-white">
        {type}s
      </h2>
    </div>
  );
};

export default UserCard;
