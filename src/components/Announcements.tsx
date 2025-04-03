"use client";
import React, { useState, useEffect } from "react";

import "react-calendar/dist/Calendar.css";
import { Ellipsis } from "lucide-react";
import { getAllEvents } from "@/services/eventsServices"; 
const EventCalendar = () => {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();

        // Sort events by createdAt in descending order (latest first)
        const sortedEvents = data.sort(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setEvents(sortedEvents);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-4 rounded-md mb-8 ">
      

      {/* Events Section */}
      <div className="flex items-center justify-between mt-6">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Ellipsis className="cursor-pointer text-black" />
      </div>

      {/* List of Events */}
      <div className="flex flex-col gap-4 h-[420px] overflow-y-auto">
        {loading ? (
          <p>Loading events...</p>
        ) : (
          events.map((event) => (
            <div
              className="p-5 rounded-md border-2 border-gray-200 border-t-4 odd:border-t-red-500 even:border-t-[#5fa0cb]"
              key={event.id}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600">{event.title}</h1>

                <h1 className="font-semibold text-gray-400">
                  {new Date(event.createdAt).toLocaleDateString("en-GB")}
                </h1>
              </div>
              <p className="mt-2 text-black text-sm">{event.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
