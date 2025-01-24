import React from 'react'
import { Search, } from "lucide-react";
const TableSearch = () => {
  return (
    <div>
          {/* SEARCH BAR */}
      <div className=" w-full md:auto  flex items-center gap-2">
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
    </div>
  )
}

export default TableSearch