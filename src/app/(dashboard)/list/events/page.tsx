"use client";
import React from "react";
import Link from "next/link";
import { eventsData, role } from "../../../../lib/data";
import FormModal from "@/components/FormModal";
import { Filter, ArrowDownNarrowWide } from "lucide-react";
import TableSearch from "@/components/TableSearch";

type Events = {
  id: number;
  title: string;
  class: number;
  startTime: string;
  date: string;
  endTime: number;
};

const EventsListPage = () => {
  return (
    <div>
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP SECTION */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">All Events</h1>
        <div className="flex items-center gap-4">
          <TableSearch />
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
            <Filter size={22} color="black" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
            <ArrowDownNarrowWide size={22} color="black" />
          </button>
          {role === "admin" && <FormModal table="event" type="create" />}
        </div>
      </div>

      {/* EVENTS LIST - SINGLE COLUMN */}
      <div className="flex flex-col gap-6">
        {eventsData.map((event: Events) => (
          <div
            key={event.id}
            className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition w-full"
          >
            <h2 className="text-2xl font-bold text-blue-700">{event.title}</h2>
            <p className="text-gray-600 text-sm mt-1">Class: {event.class}</p>
            <p className="text-gray-600 text-sm mt-1">
              Date: <span className="font-medium">{event.date}</span>
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Time: {event.startTime} - {event.endTime}
            </p>

            <div className="flex justify-between items-center mt-4">
              {/* <Link
                href={`/list/teachers/${event.id}`}
                className="text-blue-500 hover:underline"
              >
                View Details
              </Link> */}
              <div className="flex gap-2">
                <FormModal table="event" type="update" id={event.id} />
                {role === "admin" && (
                  <FormModal table="event" type="delete" id={event.id} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default EventsListPage;
