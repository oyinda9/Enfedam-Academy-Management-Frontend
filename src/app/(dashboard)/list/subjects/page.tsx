"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { View, Trash2, Filter, ArrowDownNarrowWide } from "lucide-react";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import FormModal from "@/components/FormModal";
import { getAllsubject } from "@/services/subjectService"; // Ensure correct import

interface SubjectList {
  type?: "create" | "update";
  id: number;
  name: string;
  teachers?: { name: string }[];
}
const ITEMS_PER_PAGE = 5; // Adjust number of items per page
// Table Columns
const columns = [
  { headers: "Subject Name", accessor: "name" },
  { headers: "Teachers Name", accessor: "teacher", className: "hidden md:table-cell" },
  { headers: "Actions", accessor: "action" },
];

const SubjectListPage = () => {
  const [subjects, setSubjects] = useState<SubjectList[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getAllsubject();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to load subjects", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();

    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);
    // Calculate pagination
    const totalPages = Math.ceil(subjects.length / ITEMS_PER_PAGE);
    const paginatedSubjects = subjects.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  
    const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    };

  const renderRow = (item: SubjectList) => (
    <tr key={item.id} className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50">
      <td className="p-4 font-semibold">{item.name}</td>
      <td className="hidden md:table-cell">
        {item.teachers?.length ? item.teachers.map((t) => t.name).join(", ") : "No teacher assigned"}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200">
              <View width={16} />
            </button>
          </Link>
          {userRole === "ADMIN" && (
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-200">
              <Trash2 width={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP SECTION */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <Filter size={22} color="black" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <ArrowDownNarrowWide size={22} color="black" />
            </button>
            {userRole === "ADMIN" && <FormModal table="subject" type="create" />}
          </div>
        </div>
      </div>

      {/* SUBJECTS TABLE */}
      <Table columns={columns} renderRow={renderRow} data={paginatedSubjects} />

      {/* PAGINATION */}
      <Pagination
        page={currentPage}
        count={subjects.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SubjectListPage;
