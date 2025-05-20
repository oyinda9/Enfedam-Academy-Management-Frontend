import React from "react";
import { Ellipsis } from "lucide-react";

const UserCard = ({ type, count }: { type: string; count: number }) => {
  return (
    <div className="rounded-2xl odd:bg-[#5fa0cb] even:bg-red-500 p-4 min-w-[260px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-500">
          2024/2025
        </span>
        <Ellipsis className="cursor-pointer text-white" />
      </div>
      <h1 className="text-2xl text-white mt-2">{count.toLocaleString()}</h1>
      <h2 className="capitalize text-sm font-medium text-white">{type}s</h2>
    </div>
  );
};

export default UserCard;
