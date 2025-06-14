"use client";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Ellipsis } from "lucide-react";
import { getAllEvents } from "@/services/eventsServices";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCalendar, setShowCalendar] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        const sortedEvents = data.sort(
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

  // Mobile: Show only 3 upcoming events initially
  const displayedEvents = window.innerWidth < 640 ? events.slice(0, 3) : events;

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
      {/* Header with toggle for mobile */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg sm:text-xl font-semibold">Events Calendar</h1>
        <Ellipsis className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      {/* Mobile calendar toggle */}
      <button 
        className="sm:hidden w-full py-2 mb-3 text-sm font-medium text-blue-600 flex items-center justify-center gap-2"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
        <svg 
          className={`w-4 h-4 transition-transform ${showCalendar ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Calendar - Hidden on mobile when toggled off */}
      {showCalendar && (
        <div className="mb-4">
          <Calendar 
            onChange={onChange} 
            value={value}
            className="border-0 text-sm sm:text-base"
            tileClassName="rounded-md"
            navigationLabel={({ label }) => <span className="font-medium">{label}</span>}
          />
        </div>
      )}

      {/* Events Section */}
      <div className="space-y-3">
        <h2 className="font-medium text-sm sm:text-base text-gray-700">
          Upcoming Events {window.innerWidth < 640 && `(${displayedEvents.length})`}
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 rounded-md border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No upcoming events</p>
        ) : (
          <>
            <div className="space-y-3">
              {displayedEvents.map((event) => (
                <div
                  className="p-3 sm:p-4 rounded-md border border-gray-200 shadow-xs hover:shadow-sm transition-shadow"
                  key={event.id}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-medium text-sm sm:text-base text-gray-800 line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                      {new Date(event.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Show more button for mobile */}
            {window.innerWidth < 640 && events.length > 3 && (
              <button 
                className="w-full py-2 text-sm font-medium text-blue-600"
                onClick={() => setDisplayedEvents(events)}
              >
                View All Events
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;