"use client";

// import React, { useState, useEffect } from "react";
import TableSearch from "@/components/TableSearch";
import { View, User } from "lucide-react";
import { Filter, ArrowDownNarrowWide } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role } from "../../../../lib/data";
import FormModal from "@/components/FormModal";
import Image from "next/image";

interface StudentList {
  id: number;
  name: string;
  email?: string;
  img?: string;
  username: string;
  classId: string;
  phone: string;
  address: string;
}

// Dummy data for now
const dummyData: StudentList[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    username: "alice123",
    classId: "Grade 10",
    phone: "123-456-7890",
    address: "123 Main St, City",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    username: "bobsmith",
    classId: "Grade 11",
    phone: "987-654-3210",
    address: "456 Elm St, Town",
  },
  {
    id: 3,
    name: "Charlie Brown",
    username: "charlieb",
    classId: "Grade 9",
    phone: "555-555-5555",
    address: "789 Oak St, Village",
  },
];

const columns = [
  { headers: "Info", accessor: "info" },
  { headers: "Student ID", accessor: "studentId", className: "hidden md:table-cell" },
  { headers: "Grade", accessor: "grade" },
  { headers: "Phone", accessor: "phone" },
  { headers: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { headers: "Actions", accessor: "actions" },
];

const renderRow = (item: StudentList) => (
  <tr key={item.id} className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50">
    <td className="flex items-center gap-4 p-4">
      {item.img ? (
        <Image src={item.img} alt="student" width={40} height={40} className="md:hidden xl:block rounded-full" />
      ) : (
        <User className="w-8 h-8 rounded-full border border-gray-600 text-gray-500 md:hidden xl:block" />
      )}
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-700">{item.email || "No Email"}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.username}</td>
    <td className="hidden md:table-cell">{item.classId}</td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td className="hidden md:table-cell">{item.address}</td>
    <td>
      <div className="flex items-center gap-2 self-end">
        <Link href={`/list/students/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200">
            <View width={16} />
          </button>
        </Link>

        {role === "admin" && <FormModal table="student" type="delete" id={item.id} data={undefined} />}
      </div>
    </td>
  </tr>
);

const StudentListPage = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <Filter size={22} color="black" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <ArrowDownNarrowWide size={22} color="black" />
            </button>
            {role === "admin" && <FormModal table="student" type="create" />}
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

export default StudentListPage;
