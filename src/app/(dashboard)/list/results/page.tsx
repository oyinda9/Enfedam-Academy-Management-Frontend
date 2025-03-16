import TableSearch from "@/components/TableSearch";
import React from "react";
import { Pencil, Trash2, Filter, ArrowDownNarrowWide, Plus } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";

const role = "admin"; // Simulating an admin role for actions
interface ResultList {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
}

const dummyData:ResultList[] = [
  {
    id: 1,
    title: "Math Exam",
    studentName: "John",
    studentSurname: "Doe",
    teacherName: "Alice",
    teacherSurname: "Smith",
    score: 85,
    className: "Grade 10",
    startTime: new Date("2024-03-10T10:00:00Z"),
  },
  {
    id: 2,
    title: "Science Quiz",
    studentName: "Jane",
    studentSurname: "Doe",
    teacherName: "Bob",
    teacherSurname: "Johnson",
    score: 92,
    className: "Grade 11",
    startTime: new Date("2024-03-12T12:00:00Z"),
  },
];

const columns = [
  { headers: "Title", accessor: "title" },
  { headers: "Student", accessor: "student", className: "hidden md:table-cell" },
  { headers: "Class", accessor: "class" },
  { headers: "Score", accessor: "score", className: "hidden md:table-cell" },
  { headers: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
  { headers: "Date", accessor: "date" },
  { headers: "Actions", accessor: "actions" },
];

const renderRow = (item: ResultList) => (
  <tr key={item.id} className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50">
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="flex-semibold">{item.title}</h3>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.studentName + " " + item.studentSurname}</td>
    <td className="hidden md:table-cell">{item.className}</td>
    <td className="hidden md:table-cell">{item.score}</td>
    <td className="hidden md:table-cell">{item.teacherName + " " + item.teacherSurname}</td>
    <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
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

const ResultsListPage = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
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
      <Table columns={columns} renderRow={renderRow} data={dummyData} />
      {/* PAGINATION */}
      <Pagination page={1} count={dummyData.length} />
    </div>
  );
};

export default ResultsListPage;
