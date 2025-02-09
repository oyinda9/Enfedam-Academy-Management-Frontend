import TableSearch from "@/components/TableSearch";
import React from "react";
import { View } from "lucide-react";
import { Filter, ArrowDownNarrowWide } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role, studentsData } from "../../../../lib/data";
import FormModal from "@/components/FormModal";
type Student = {
  id: number;
  studentId: string;
  name: string;
  email?: string;
  phone?: string;
  photo: string;
  grade: string[];
  class: string[];
  address: string;
};
const columns = [
  {
    headers: "Info",
    accessor: "info",
  },
  {
    headers: "Student ID",
    accessor: "studentId",
    className: "hidden md:table-cell",
  },
  {
    headers: "Grade",
    accessor: "grade",
  },

  {
    headers: "Phone",
    accessor: "phone",
  },
  {
    headers: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    headers: "Actions",
    accessor: "actions",
  },
];
const StudentListPage = () => {
  const renderRow = (item: Student) => (
    <tr
      key={item.id}
      className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50"
    >
      <td className="flex items-center gap-4 p-4">
        <img
          src={item.photo}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block rounded-full "
        />
        <div className="flex flex-col">
          <h3 className="flex-semibold">{item.name}</h3>
          <p className="font-xs text-gray-700">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.studentId}</td>
      <td className="hidden md:table-cell">{item.grade}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2 self-end">
          <Link href={`/list/students/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200">
              <View width={16} />
            </button>
          </Link>

          {role === "admin" && (
            <FormModal
              table="student"
              type="delete"
              id={item.id}
              data={undefined}
            />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold ">All Students</h1>
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
              <FormModal table="student" type="create" data={undefined} />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <div className="">
        <Table columns={columns} renderRow={renderRow} data={studentsData} />
      </div>
      {/* PAGINATION */}

      <Pagination />
    </div>
  );
};

export default StudentListPage;
