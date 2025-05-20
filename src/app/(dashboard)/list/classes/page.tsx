"use client";

import React, { useEffect, useState } from "react";
import TableSearch from "@/components/TableSearch";
import { Trash2, Filter, ArrowDownNarrowWide } from "lucide-react";
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

const ITEMS_PER_PAGE = 5; // Adjust number of items per page

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

const ClassesListPage: React.FC = () => {
  const [classes, setClass] = useState<ClassList[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
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
    fetchClasses();

    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const handleDelete = async (classId: string) => {
    const loadingToast = toast.loading("Please wait... Deleting class...", {
      position: "top-right",
      autoClose: false, // Set to false to keep it visible until the operation finishes
      closeButton: true,
      draggable: true,
      theme: "colored",
    });

    try {
      // API call to delete the class
      await DeleteClassById(classId);
      // Dismiss the loading toast first
      toast.dismiss(loadingToast);

      // Then show a new success toast
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

      // Update the class state to reflect the deleted class
      setClass((prevClasses) => prevClasses.filter((c) => c.id !== classId));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      // Remove the loading toast
      toast.dismiss(loadingToast);

      // Show a new, separate error toast
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

  // Render Row Function
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

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      <ToastContainer />
      {/* TOP SECTION */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <Filter size={22} color="black" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <ArrowDownNarrowWide size={22} color="black" />
            </button>
            {userRole === "ADMIN" && <FormModal table="class" type="create" />}
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
  );
};

export default ClassesListPage;
