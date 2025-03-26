"use client";

import React from "react";

const ITEMS_PER_PAGE = 5;

interface PaginationProps {
  page: number;
  count: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, count, onPageChange }) => {
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  return (
    <div className="p-4 flex items-center justify-between text-gray-700">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-[60px] h-[40px] flex items-center justify-center rounded-lg 
          bg-gradient-to-r from-blue-500 to-blue-400 text-white text-xs font-semibold shadow-md 
          transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-blue-500 hover:shadow-lg 
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-3 text-sm">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageIndex = index + 1;
          return (
            <button
              key={pageIndex}
              onClick={() => onPageChange(pageIndex)}
              className={`w-[40px] h-[40px] flex items-center justify-center rounded-lg 
                transition-all duration-300 ease-in-out shadow-md font-semibold
                ${
                  page === pageIndex
                    ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white scale-110 shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-300 hover:text-white hover:shadow-md"
                }`}
            >
              {pageIndex}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="w-[60px] h-[40px] flex items-center justify-center rounded-lg 
          bg-gradient-to-r from-blue-500 to-blue-400 text-white text-xs font-semibold shadow-md 
          transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-blue-500 hover:shadow-lg 
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
