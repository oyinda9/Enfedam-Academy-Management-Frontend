"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import components with SSR disabled
const BigCalendar = dynamic(() => import("@/components/BigCalendar"), { ssr: false });
const EventCalendar = dynamic(() => import("@/components/EventCalendar"), { ssr: false });
const Announcements = dynamic(() => import("@/components/Announcements"), { ssr: false });

const Studentpage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row font-poppins">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (41)</h1>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default Studentpage;
