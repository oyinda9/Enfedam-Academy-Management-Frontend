import TableSearch from "@/components/TableSearch";
import React from "react";
import { View, Trash2 } from "lucide-react";
import { Filter, ArrowDownNarrowWide, Plus } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
// import FormModal from "@/components/FormModal";
import Link from "next/link";
import { role } from "../../../../lib/data";

interface SubjectList {
  id: number;
  name: string;
  teachers?: { name: string }[]; // Fixed type to be an array
}

const dummyData: SubjectList[] = [
  {
    id: 1,
    name: "Mathematics",
    teachers: [{ name: "Mr. John" }, { name: "Mrs. Smith" }],
  },
  {
    id: 2,
    name: "English",
    teachers: [{ name: "Ms. Davis" }],
  },
  {
    id: 3,
    name: "Science",
    teachers: [], // Explicit empty array for clarity
  },
];

const columns = [
  {
    headers: "Subject Name",
    accessor: "subject",
  },
  {
    headers: "Teachers Name",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    headers: "Actions",
    accessor: "action",
  },
];

const renderRow = (item: SubjectList) => (
  <tr
    key={item.id}
    className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50"
  >
    <td className="p-4">
      <h3 className="font-semibold">{item.name}</h3>
    </td>
    <td className="hidden md:table-cell">
      {item.teachers && item.teachers.length > 0
        ? item.teachers.map((teacherItem) => teacherItem.name).join(", ")
        : "No teacher assigned"}
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

const SubjectListPage = ({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) => {
  const { page } = searchParams || {};
  const p = page ? parseInt(page) : 1;

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4">
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
      <Table columns={columns} renderRow={renderRow} data={dummyData} />
      {/* PAGINATION */}
      <Pagination page={p} count={dummyData.length} />
    </div>
  );
};

export default SubjectListPage;
