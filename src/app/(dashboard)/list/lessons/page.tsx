import TableSearch from "@/components/TableSearch";
import React from "react";
import { Filter, ArrowDownNarrowWide, Plus } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role } from "../../../../lib/data";
import FormModal from "@/components/FormModal";

interface DummyLesson {
  id: number;
  subject: { id: number; name: string };
  class: { id: number; name: string };
  teacher: { id: number; name: string; surname: string };
}

// Dummy Data
const dummyLessons: DummyLesson[] = [
  {
    id: 1,
    subject: { id: 101, name: "Mathematics" },
    class: { id: 201, name: "Grade 10" },
    teacher: { id: 301, name: "John", surname: "Doe" },
  },
];

const columns = [
  { headers: "Subject", accessor: "subject" },
  { headers: "Class", accessor: "class" },
  { headers: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
  { headers: "Actions", accessor: "actions" },
];

const renderRow = (item: DummyLesson) => (
  <tr key={item.id} className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50">
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.subject.name}</h3>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.class.name}</td>
    <td className="hidden md:table-cell">{item.teacher.name + " " + item.teacher.surname}</td>
    <td>
      <div className="flex items-center gap-2 self-end">
        <Link href={`/list/teachers/${item.id}`}>
          <FormModal table="lesson" type="update" id={item.id} data={undefined} />
        </Link>
        {role === "admin" && <FormModal table="lesson" type="delete" id={item.id} data={undefined} />}
      </div>
    </td>
  </tr>
);

const LessonListPage = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
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
      <div>
        <Table columns={columns} renderRow={renderRow} data={dummyLessons} />
      </div>

      {/* PAGINATION */}
      <Pagination page={1} count={dummyLessons.length} />
    </div>
  );
};

export default LessonListPage;
