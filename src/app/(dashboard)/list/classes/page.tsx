"use client";

import type React from "react";
import { useEffect, useState } from "react";
import TableSearch from "@/components/TableSearch";
import {
  Trash2,
  Filter,
  ArrowDownNarrowWide,
  Users,
  GraduationCap,
  User,
  AlertTriangle,
  School,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import FormModal from "@/components/FormModal";
import { getAllclass, DeleteClassById } from "@/services/classServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ClassList {
  id: string;
  name: string;
  capacity: number;
  supervisor?: {
    name: string;
    surname: string;
  };
}

const ITEMS_PER_PAGE = 5;

// Table Columns
const columns = [
  { headers: "Class Name", accessor: "name" },
  { headers: "Capacity", accessor: "capacity" },
  {
    headers: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  { headers: "Actions", accessor: "actions" },
];

const ResponsiveClassesListPage: React.FC = () => {
  const [classes, setClass] = useState<ClassList[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchClasses = async () => {
    try {
      const data = await getAllclass();
      setClass(data);
    } catch (error) {
      console.error("Failed to load classes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();

    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const handleDelete = async (classId: string) => {
    const loadingToast = toast.loading("Please wait... Deleting class...", {
      position: "top-right",
      autoClose: false,
      closeButton: true,
      draggable: true,
      theme: "colored",
    });

    try {
      await DeleteClassById(classId);
      toast.dismiss(loadingToast);

      toast.success("Class deleted successfully.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
        style: {
          backgroundColor: "#4CAF50",
          color: "white",
          fontWeight: "bold",
        },
      });

      setClass((prevClasses) => prevClasses.filter((c) => c.id !== classId));
    } catch (error: any) {
      console.error("Failed to delete class:", error);

      const errorDetails = error?.response?.data?.details || "";

      let errorMessage =
        "An unexpected error occurred while deleting the class.";

      if (errorDetails.includes("Foreign key constraint")) {
        errorMessage =
          "Cannot delete class: there are students still assigned to it. Please remove or reassign them first.";
      } else if (error?.response?.data?.error) {
        errorMessage = `Error: ${error.response.data.error}`;
      } else if (error?.message === "Network Error") {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.dismiss(loadingToast);

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
        style: {
          backgroundColor: "#F44336",
          color: "white",
          fontWeight: "bold",
        },
      });
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(classes.length / ITEMS_PER_PAGE);
  const paginatedClasses = classes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Desktop table row renderer (your original)
  const renderRow = (item: ClassList) => (
    <tr
      key={item.id}
      className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50"
    >
      <td className="p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">
        {item.supervisor
          ? `${item.supervisor.name} ${item.supervisor.surname}`
          : "No Supervisor"}
      </td>
      <td>
        <div className="flex items-center justify-center">
          {userRole === "ADMIN" && (
            <button
              onClick={() => handleDelete(item.id)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-red-200 hover:bg-red-300 transition-colors"
              title="Delete Class"
            >
              <Trash2 width={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  // Mobile card component
  const ClassCard = ({ classItem }: { classItem: ClassList }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header with class name and actions */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <School size={20} className="text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {classItem.name}
            </h3>
            <div className="flex items-center gap-1 text-gray-600 mt-1">
              <Users size={14} className="flex-shrink-0" />
              <span className="text-sm">Capacity: {classItem.capacity}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          {userRole === "ADMIN" && (
            <button
              onClick={() => handleDelete(classItem.id)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors"
              title="Delete Class"
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          )}
        </div>
      </div>

      {/* Supervisor Information */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <User size={14} className="text-green-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="font-medium text-gray-700">Supervisor: </span>
            <span className="text-gray-600">
              {classItem.supervisor
                ? `${classItem.supervisor.name} ${classItem.supervisor.surname}`
                : "No Supervisor Assigned"}
            </span>
          </div>
        </div>
      </div>

      {/* Admin indicator */}
      {userRole === "ADMIN" && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full w-fit">
            <AlertTriangle size={12} />
            <span>Admin Actions Available</span>
          </div>
        </div>
      )}
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="bg-white lg:bg-gray-50 p-4 rounded-md flex-1 mt-0 lg:min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading classes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      {/* Desktop View */}
      <div className="hidden lg:block bg-white p-4 rounded-md flex-1 mt-0">
        {/* TOP SECTION */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">All Classes</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage school classes and their supervisors
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300 hover:bg-green-400 transition-colors">
                <Filter size={22} color="black" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300 hover:bg-green-400 transition-colors">
                <ArrowDownNarrowWide size={22} color="black" />
              </button>
              {(userRole === "ADMIN" || userRole === "EXECUTIVE") && (
                <FormModal table="teacher" type="create" />
              )}
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="mt-4">
          <Table
            columns={columns}
            renderRow={renderRow}
            data={paginatedClasses}
          />
        </div>

        {/* PAGINATION */}
        <Pagination
          page={currentPage}
          count={classes.length}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Mobile View */}
      <div className="lg:hidden bg-gray-50 min-h-screen">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Classes</h1>
                <p className="text-sm text-gray-600">School class management</p>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {classes.length} total
              </span>
            </div>

            {/* Mobile Search and Actions */}
            <div className="space-y-3">
              <TableSearch />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                    <Filter size={16} />
                    Filter
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                    <ArrowDownNarrowWide size={16} />
                    Sort
                  </button>
                </div>
                {(userRole === "ADMIN" || userRole === "EXECUTIVE") && (
                  <FormModal table="teacher" type="create" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          {classes.length === 0 ? (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No classes found
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by creating your first class.
                </p>
                {(userRole === "ADMIN" || userRole === "EXECUTIVE") && (
                  <FormModal table="teacher" type="create" />
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              {/* Class Cards */}
              <div className="space-y-4 mb-6">
                {paginatedClasses.map((classItem) => (
                  <ClassCard key={classItem.id} classItem={classItem} />
                ))}
              </div>

              {/* Mobile Pagination */}
              <div className="bg-white rounded-lg p-4">
                <Pagination
                  page={currentPage}
                  count={classes.length}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResponsiveClassesListPage;
