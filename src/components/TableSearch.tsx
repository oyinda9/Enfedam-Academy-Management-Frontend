"use client"
import React from 'react'
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const TableSearch = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (e.currentTarget[0] as HTMLInputElement).value; // Ensure value is properly extracted
    const params = new URLSearchParams(window.location.search);
    params.set("search", value);
    router.push(`${window.location.pathname}?${params.toString()}`); // Removed unnecessary space
  };

  return (
    <div>
      {/* SEARCH BAR */}
      <form onSubmit={handleSubmit} className=" w-full md:auto flex items-center gap-2">
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
      </form>
    </div>
  );
};

export default TableSearch;
