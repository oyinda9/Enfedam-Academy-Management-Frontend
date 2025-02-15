import TableSearch from "@/components/TableSearch";
import React from "react";
import { Filter, ArrowDownNarrowWide, Plus } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { role } from "../../../../lib/data";
import prisma from "@/lib/prisma";
import { Class, Event, Prisma } from "@prisma/client";
import { ITEM_PER_PAGE } from "@/lib/settings";

type EventList = Event & { class: Class };

const columns = [
  {
    headers: "Event Details",
    accessor: "eventDetails",
  },
];

const renderRow = (item: EventList) => (
  <tr
    key={item.id}
    className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50"
  >
    <td className="p-4">
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg text-blue-600">{item.title}</h3>
        <p>
          <span className="font-medium">Class Name:</span> {item.class.name}
        </p>

        <p>
          <span className="font-medium"> Date:</span>{" "}
          {new Intl.DateTimeFormat("en-US").format(item.startTime)}
        </p>

        <p>
          <span className="font-medium"> Start Date:</span>{" "}
          {item.startTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </p>

        <p>
          <span className="font-medium">End Date:</span>{" "}
          {item.endTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </p>
      </div>
    </td>
  </tr>
);

const EventListPage = async ({
  searchParams = {},
}: {
  searchParams?: { [key: string]: string };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.EventWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = {
              contains: value,
              mode: "insensitive",
            };
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.event.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <Filter size={22} color="black" />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <ArrowDownNarrowWide size={22} color="black" />
            </button>

            {role === "admin" && (
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
                <Plus size={22} color="black" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="">
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default EventListPage;
