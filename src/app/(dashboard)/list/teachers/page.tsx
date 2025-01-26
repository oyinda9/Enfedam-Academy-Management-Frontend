import React from "react";
import { View, Filter, ArrowDownNarrowWide } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import TableSearch from "@/components/TableSearch";
import FormModal from "@/components/FormModal";
import { role, teachersData } from "../../../../../lib/data";

type Teacher = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  phone: string;
  photo: string;
  subjects: string[];
  classes: string[];
  address: string;
};

const columns = [
  { headers: "Info", accessor: "info" },
  { headers: "Teacher ID", accessor: "teacherId", className: "hidden md:table-cell" },
  { headers: "Subject", accessor: "subject" },
  { headers: "Classes", accessor: "classes" },
  { headers: "Phone", accessor: "phone" },
  { headers: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { headers: "Actions", accessor: "actions" },
];

const TeacherListPage = () => {
  const renderRow = (item: Teacher) => (
    <tr key={item.id} className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50">
      <td className="flex items-center gap-4 p-4">
        <img
          src={item.photo}
          alt="Teacher"
          width={40}
          height={40}
          className="md:hidden xl:block rounded-full"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-700">{item.email || "No Email"}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.teacherId}</td>
      <td className="hidden md:table-cell">{item.subjects.join(", ")}</td>
      <td className="hidden md:table-cell">{item.classes.join(", ")}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200">
              <View size={16} />
            </button>
          </Link>
          {role === "admin" && <FormModal table="teacher" type="delete" id={item.id} />}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP SECTION */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <Filter size={22} color="black" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <ArrowDownNarrowWide size={22} color="black" />
            </button>
            {role === "admin" && <FormModal table="teacher" type="create" />}
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div>
        <Table columns={columns} renderRow={renderRow} data={teachersData} />
      </div>

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default TeacherListPage;
