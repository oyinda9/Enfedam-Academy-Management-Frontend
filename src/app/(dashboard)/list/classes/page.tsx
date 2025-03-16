import React from "react";
import TableSearch from "@/components/TableSearch";
import { View, Trash2, Filter, ArrowDownNarrowWide } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role } from "../../../../lib/data";
import FormModal from "@/components/FormModal";

// Dummy Data
const dummyData = [
  {
    id: 1,
    name: "Basic Science",
    capacity: 30,
    gradeId: "JS1",
    supervisor: { name: "John", surname: "Doe" },
  },
  {
    id: 2,
    name: "Mathematics",
    capacity: 25,
    gradeId: "SS1",
    supervisor: { name: "Jane", surname: "Smith" },
  },
];

// Table Columns
const columns = [
  { headers: "Class Name", accessor: "name" },
  { headers: "Capacity", accessor: "capacity" },
  { headers: "Grade", accessor: "gradeId" },
  { headers: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
  { headers: "Actions", accessor: "actions" },
];

// Render Row Function
const renderRow = (item: (typeof dummyData)[0]) => (
  <tr key={item.id} className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50">
    <td className="p-4">{item.name}</td>
    <td className="hidden md:table-cell">{item.capacity}</td>
    <td className="hidden md:table-cell">{item.gradeId}</td>
    <td className="hidden md:table-cell">
      {item.supervisor?.name + " " + item.supervisor?.surname || "No Supervisor"}
    </td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/teachers/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200">
            <View width={16} />
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

const ClassesListPage: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP SECTION */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <Filter size={22} color="black" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <ArrowDownNarrowWide size={22} color="black" />
            </button>
            {role === "admin" && <FormModal table="class" type="create" data={undefined} />}
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="mt-4">
        <Table columns={columns} renderRow={renderRow} data={dummyData} />
      </div>

      {/* PAGINATION */}
      <Pagination page={1} count={dummyData.length} />
    </div>
  );
};

export default ClassesListPage;
