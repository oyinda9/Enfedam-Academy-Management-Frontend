import TableSearch from "@/components/TableSearch";
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Filter, ArrowDownNarrowWide, Plus } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role } from "../../../../lib/data";
interface announcementsData {
  id: number;
  title: string;
  date: string;
}

// Dummy Data
const dummyAnnouncements: announcementsData[] = [
  {
    id: 1,
    title: "John Doe",
    date: "john@example.com",
  },
];
const columns = [
  {
    headers: "Title",
    accessor: "title",
  },

  {
    headers: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },

  {
    headers: "Actions",
    accessor: "actions",
  },
];
const MessagesListPage = () => {
  const renderRow = (item: announcementsData) => (
    <tr
      key={item.id}
      className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="flex-semibold">{item.title}</h3>
        </div>
      </td>

      <td className="hidden md:table-cell">{item.date}</td>

      <td>
        <div className="flex items-center gap-2 self-end">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200">
              <Pencil width={16} />
            </button>
          </Link>

          {role === "admin" && (
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-200">
              <Trash2 width={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold ">All Messages</h1>
        <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto">
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
        <Table
          columns={columns}
          renderRow={renderRow}
          data={dummyAnnouncements}
        />
      </div>
      {/* PAGINATION */}
      <Pagination page={1} count={dummyAnnouncements.length} />
    </div>
  );
};

export default MessagesListPage;
