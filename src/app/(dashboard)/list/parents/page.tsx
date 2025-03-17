"use client";

import React, { useEffect, useState } from "react";
import TableSearch from "@/components/TableSearch";
import { Filter, ArrowDownNarrowWide } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role } from "../../../../lib/data";
import FormModal from "@/components/FormModal";
import { getAllStudent } from "@/services/parentService";
interface ParentList {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  students: { id: number; name: string }[];
}


const columns = [
  { headers: "Info", accessor: "info" },
  { headers: "Student Name", accessor: "students", className: "hidden md:table-cell" },
  { headers: "Email", accessor: "email" },
  { headers: "Phone", accessor: "phone" },
  { headers: "Address", accessor: "address" },
  { headers: "Action", accessor: "action" },
];

const ParentListPage = () => {
 const [parents, setParents] = useState<ParentList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const data = await getAllStudent();
        setParents(data);
      } catch (error) {
        console.error("Failed to load teachers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParents();
  }, []);
  
const renderRow = (item: ParentList) => (
  <tr key={item.id} className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50">
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
      </div>
    </td>
    <td className="hidden md:table-cell">
      {item.students.length
        ? item.students.map((student) => student.name).join(", ")
        : "No students"}
    </td>
    <td className="hidden md:table-cell">{item.email}</td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td className="hidden md:table-cell">{item.address}</td>
    <td>
      <div className="flex items-center gap-2 self-end">
        <Link href={`/list/teachers/${item.id}`}></Link>
        {role === "admin" && (
          <>
            <FormModal table="parent" type="update" data={item} />
            <FormModal table="parent" type="delete" id={item.id} data={undefined} />
          </>
        )}
      </div>
    </td>
  </tr>
);
if (loading) return <p>Loading parents...</p>;
  if (parents.length === 0) return <p>No parents found.</p>;
  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <Filter size={22} color="black" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <ArrowDownNarrowWide size={22} color="black" />
            </button>
            {role === "admin" && <FormModal table="parent" type="create" data={undefined} />}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div>
        <Table columns={columns} renderRow={renderRow} data={parents} />
      </div>

      {/* PAGINATION (Dummy - Replace with real logic if needed) */}
      <Pagination page={1} count={parents.length} />
    </div>
  );
};

export default ParentListPage;
