"use client";

import React, { useEffect, useState } from "react";
import { View, Filter, ArrowDownNarrowWide } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import TableSearch from "@/components/TableSearch";
import FormModal from "@/components/FormModal";
import { role } from "../../../../lib/data";
// import Image from "next/image";
import { getAllTeachers } from "@/services/teacherServices";

interface TeacherList {
  id: number;
  surname: string;
  bloodType: string;
  name: string;
  birthday: string;
  sex: string;
  email?: string;
  phone?: string;
  address?: string;
  img?: string;
  subjects?: { id: number; name: string }[];
  classes?: { id: number; name: string }[];
}
const columns = [
  // { headers: "Info", accessor: "info" },
  // {
  //   headers: "Teacher ID",
  //   accessor: "teacherId",
  //   className: "hidden md:table-cell",
  // },

  // {
  //   headers: "Username",
  //   accessor: "Username",
  //   className: "hidden lg:table-cell",
  // },

  {
    headers: "Full-Name",
    accessor: "fullname",
    className: "hidden lg:table-cell",
  },


  {
    headers: "Email",
    accessor: "Email",
    className: "hidden lg:table-cell",
  },
  {
    headers: "Subject",
    accessor: "subject",
    className: "hidden lg:table-cell",
  },
  {
    headers: "Classes",
    accessor: "classes",
    className: "hidden lg:table-cell",
  },
  { headers: "Phone", accessor: "phone", className: "hidden lg:table-cell" },

  {
    headers: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    headers: "Blood-Type",
    accessor: "Blood-Type",
    className: "hidden lg:table-cell",
  },
  {
    headers: "Gender",
    accessor: "Gender",
    className: "hidden lg:table-cell",
  },
  {
    headers: "Birthday",
    accessor: "Birthday",
    className: "hidden lg:table-cell",
  },
  { headers: "Actions", accessor: "actions" },
];

const ITEMS_PER_PAGE = 10; // Adjust number of items per page
const TeacherListPage = () => {
  const [teachers, setTeachers] = useState<TeacherList[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getAllTeachers();
        setTeachers(data);
      } catch (error) {
        console.error("Failed to load teachers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();

    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(teachers.length / ITEMS_PER_PAGE);
  const paginatedTeachers = teachers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const renderRow = (item: TeacherList) => (
    <tr
      key={item.id}
      className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50   "
    >
      <td className="hidden lg:table-cell px-2 py-2  items-start">
        {`${item.name || "N/A"}  ${item.surname || "N/A"}`.trim()}
      </td>
      <td className="hidden lg:table-cell px-2 py-2">{item.email || "N/A"}</td>
      {/* <td className="hidden lg:table-cell px-4 py-2">
        {item.username || "N/A"}
      </td> */}
      {/* <td className="hidden lg:table-cell px-4 py-2">{item.id}</td> */}
      <td className="hidden lg:table-cell px-2 py-2">
        {item.subjects?.length
          ? item.subjects.map((s) => s.name).join(", ")
          : "N/A"}
      </td>
      <td className="hidden lg:table-cell px-6 py-2">
        {item.classes?.length
          ? item.classes.map((c) => c.name).join(", ")
          : "N/A"}
      </td>

      <td className="hidden lg:table-cell px-6 py-2">{item.phone || "N/A"}</td>

      <td className="hidden lg:table-cell px-6 py-2">
        {item.address || "N/A"}
      </td>
      <td className="hidden lg:table-cell px-6 py-2">
        {item.bloodType || "N/A"}
      </td>
      <td className="hidden lg:table-cell px-6 py-2">{item.sex || "N/A"}</td>
      <td className="hidden lg:table-cell px-6 py-2">
        {item.birthday
          ? new Date(item.birthday)
              .toISOString()
              .split("T")[0]
              .replace(/-/g, "/")
          : "N/A"}
      </td>

      <td className="px-6 py-2">
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200">
              <View size={16} />
            </button>
          </Link>
          {userRole === "ADMIN" && (
            <FormModal
              table="teacher"
              type="delete"
              id={item.id}
              data={undefined}
            />
          )}
        </div>
      </td>
    </tr>
  );

  if (loading) return <p>Loading teachers...</p>;
  if (teachers.length === 0) return <p>No teachers found.</p>;

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
      <Table columns={columns} renderRow={renderRow} data={paginatedTeachers} />

      {/* PAGINATION */}
      {/* PAGINATION */}
      <Pagination
        page={currentPage}
        count={teachers.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TeacherListPage;
