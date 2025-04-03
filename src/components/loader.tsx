import React from "react";

const PulseLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Loader Circle */}
      <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-spin-infinite"></div>
      {/* Loading Text */}
      <p className="text-gray-700 text-lg font-semibold">Loading...</p>

      {/* Tailwind CSS custom animations (this will work if you place it in the component itself) */}
      <style jsx>{`
        @keyframes spin-infinite {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-infinite {
          animation: spin-infinite 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PulseLoader;
