import React from "react";
import { Filter, ArrowDownNarrowWide, Plus } from "lucide-react";
import TableSearch from "@/components/TableSearch";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import { role } from "../../../../lib/data";

const columns = [
  { headers: "Subject", accessor: "subject" },
  { headers: "Class", accessor: "class" },
  {
    headers: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  { headers: "Due Date", accessor: "dueDate" },
  { headers: "Actions", accessor: "actions" },
];

const dummyData = [
  {
    id: 1,
    subject: "Mathematics",
    class: "JS1",
    teacher: "Sholanke Precious",
    dueDate: "20/04/25",
  },
  {
    id: 2,
    subject: "English",
    class: "SS2",
    teacher: "John Doe",
    dueDate: "18/04/25",
  },
];

const AssignmentListPage = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Assignments
        </h1>
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

      {/* TABLE */}
      <div className="mt-4">
        <Table
          columns={columns}
          data={dummyData}
          renderRow={(item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.subject}</td>
              <td className="p-2">{item.class}</td>
              <td className="p-2 hidden md:table-cell">{item.teacher}</td>
              <td className="p-2">{item.dueDate}</td>
              <td className="p-2">
                <button className="text-blue-500 hover:underline">Edit</button>
              </td>
            </tr>
          )}
        />
      </div>

      {/* PAGINATION */}
      <Pagination page={1} count={dummyData.length} />
    </div>
  );
};

export default AssignmentListPage;
