import React from "react";

const Announcements = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Annoucements</h1>
        <span className="text-sm text-gray-600">View all</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-blue-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">
              Lorem ipsum dolor sit.adipisicing elit.
            </h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-01-01
            </span>
          </div>
          <p className="text-sm text-gray-500  mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
            perferendis facilis soluta corrupti ducimus odit praesentium
          </p>
        </div>

        <div className="bg-green-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">
              Lorem ipsum dolor sit.adipisicing elit.
            </h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-01-01
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
            perferendis facilis soluta corrupti ducimus odit praesentium
          </p>
        </div>

        <div className="bg-red-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">
              Lorem ipsum dolor sit.adipisicing elit.
            </h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-01-01
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
            perferendis facilis soluta corrupti ducimus odit praesentium
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
