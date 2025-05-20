"use client";

import React, { useEffect, useState } from "react";
import TableSearch from "@/components/TableSearch";
import { Trash2 } from "lucide-react";
import Pagination from "@/components/Pagination";
import FormModal from "@/components/FormModal";
import { getAllEvents } from "@/services/eventsServices";

interface EventList {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 5;

const EventsListPage: React.FC = () => {
  const [events, setEvents] = useState<EventList[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();

    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const paginatedEvents = events.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP SECTION */}
  
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <Filter size={22} color="black" />
            </button> */}
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <ArrowDownNarrowWide size={22} color="black" />
            </button> */}
            {userRole === "ADMIN" && <FormModal table="event" type="create" />}
          </div>
        </div>
      </div>

      {/* EVENTS LIST (Card Layout) */}
      <div className="mt-4 grid gap-4 ">
        {paginatedEvents.map((item) => (
          <div
            key={item.id}
            className="p-4 border rounded-lg shadow-md bg-white hover:bg-gray-100 transition"
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="text-xs text-gray-500 mt-2">
              Created: {new Date(item.createdAt).toLocaleDateString("en-CA")}
            </p>

            {userRole === "ADMIN" && (
              <button className="mt-3 text-red-500 hover:text-red-700 flex items-center gap-1">
                <Trash2 width={16} /> Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <Pagination
        page={currentPage}
        count={events.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default EventsListPage;
