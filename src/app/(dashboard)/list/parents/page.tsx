"use client";

import React, { useEffect, useState } from "react";
import TableSearch from "@/components/TableSearch";
import { Filter, ArrowDownNarrowWide, View } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role } from "../../../../lib/data";
import FormModal from "@/components/FormModal";
import { getAllParent } from "@/services/parentService";
import PulseLoader from "@/components/loader";
import { getTeacherById } from "@/services/teacherServices";
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
  {
    headers: "Student Name",
    accessor: "students",
    className: "hidden md:table-cell",
  },
  { headers: "Email", accessor: "email" },
  { headers: "Phone", accessor: "phone" },
  { headers: "Address", accessor: "address" },
  { headers: "Action", accessor: "action" },
];
const ITEMS_PER_PAGE = 5; // Adjust number of items per page
const ParentListPage = () => {
  const [parents, setParents] = useState<ParentList[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any | null>(null); // Store user data
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(loggedInUser);
  
    const fetchParents = async () => {
      try {
        const data = await getAllParent();
  
        if (loggedInUser?.role === "TEACHER") {
          // Fetch the full teacher profile using the user ID to get classId
          const teacherProfile = await getTeacherById(loggedInUser.user.id);
          const teacherClassId = teacherProfile?.classes?.[0]?.id;

          console.log("teacher profile",teacherProfile)
          console.log("teacher class id",teacherClassId)
  
          // Filter parents whose students belong to the teacher's class
          const filteredParents = data.filter((parent) =>
            parent.students?.some(
              (student) => student.classId === teacherClassId
            )
          );
  
          setParents(filteredParents);
        } else if (loggedInUser?.role === "ADMIN") {
          // Admin sees all parents
          setParents(data);
        }
      } catch (error) {
        console.error("Failed to load parents", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchParents();
  }, []);

  const totalPages = Math.ceil(parents.length / ITEMS_PER_PAGE);
  const paginatedParents = parents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const renderRow = (item: ParentList) => {
    const isTeacher = user?.role === "TEACHER";
    const isAdmin = user?.role === "ADMIN";
    return (
      <tr
        key={item.id}
        className={`border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50 ${
          isTeacher ? "" : ""
        }`}
      >
        {isTeacher ? (
          // Teacher view as a table row style
          <>
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
            <td className="px-4 py-2">
              <div className="flex items-center gap-4">
                {" "}
                {/* Increased gap for better spacing */}
                <Link href={`/list/parents/${item.id}`}>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200">
                    <View width={18} />
                  </button>
                </Link>
                {userRole === "ADMIN" && (
                  <FormModal table="student" type="delete" id={item.id} />
                )}
              </div>
            </td>
          </>
        ) : isAdmin ? (
          // Admin view as a table row
          <>
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
            <td className="px-4 py-2">
              <div className="flex items-center gap-4">
                {" "}
                {/* Increased gap for better spacing */}
                <Link href={`/list/parents/${item.id}`}>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200">
                    <View width={18} />
                  </button>
                </Link>
                {userRole === "ADMIN" && (
                  <FormModal table="student" type="delete" id={item.id} />
                )}
              </div>
            </td>
          </>
        ) : null}
      </tr>
    );
  };

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
            {role === "admin" && (
              <FormModal table="parent" type="create" data={undefined} />
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <PulseLoader />
        </div>
      ) : user?.role === "ADMIN" || user?.role === "TEACHER" ? (
        <Table
          columns={columns}
          renderRow={renderRow}
          data={paginatedParents}
        />
      ) : (
        <div className="mt-4">
          {paginatedParents.map((student) => renderRow(student))}
        </div>
      )}

      <Pagination
        page={currentPage}
        count={parents.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ParentListPage;
