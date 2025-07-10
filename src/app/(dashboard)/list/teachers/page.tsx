"use client";

import { useEffect, useState } from "react";
import {
  View,
  Filter,
  ArrowDownNarrowWide,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  Droplets,
  User,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import TableSearch from "@/components/TableSearch";
import FormModal from "@/components/FormModal";
import { getAllTeachers, type TeacherList } from "@/services/teacherServices";

// Define interfaces for better type safety
interface Subject {
  id: number;
  name: string;
}

interface Class {
  id: number;
  name: string;
}

interface TeacherData extends TeacherList {
  subjects?: Subject[];
  classes?: Class[];
}

interface ApiResponse<T> {
  message: string;
  data: T[];
}

const columns = [
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

const ITEMS_PER_PAGE = 10;

const ResponsiveTeacherListPage = () => {
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching teachers...");
        const response = await getAllTeachers();
        console.log("Teachers API Response:", response);

        // Handle different possible response structures
        let teachersData: TeacherData[] = [];

        if (Array.isArray(response)) {
          // Direct array response
          teachersData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          // Nested response with data property
          teachersData = response.data;
        } else if (response?.teachers && Array.isArray(response.teachers)) {
          // Nested response with teachers property
          teachersData = response.teachers;
        } else {
          console.warn("Unexpected teachers response structure:", response);
          teachersData = [];
        }

        console.log("Processed teachers data:", teachersData);
        setTeachers(teachersData);

        if (teachersData.length === 0) {
          console.warn("No teachers found");
        }
      } catch (error) {
        console.error("Failed to load teachers", error);
        setError("Failed to load teachers. Please try again.");
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();

    // Get user role from localStorage
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

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

  // Helper functions
  const getSubjectsText = (item: TeacherData) => {
    try {
      if (!item.subjects) return "N/A";
      if (!Array.isArray(item.subjects)) return "N/A";
      if (item.subjects.length === 0) return "N/A";

      const subjectNames = item.subjects
        .filter((s) => s && typeof s === "object" && s.name)
        .map((s) => s.name)
        .filter((name) => name && name.trim());

      return subjectNames.length > 0 ? subjectNames.join(", ") : "N/A";
    } catch (error) {
      console.error("Error processing subjects for teacher:", item.id, error);
      return "N/A";
    }
  };

  const getClassesText = (item: TeacherData) => {
    try {
      if (!item.classes) return "N/A";
      if (!Array.isArray(item.classes)) return "N/A";
      if (item.classes.length === 0) return "N/A";

      const classNames = item.classes
        .filter((c) => c && typeof c === "object" && c.name)
        .map((c) => c.name)
        .filter((name) => name && name.trim());

      return classNames.length > 0 ? classNames.join(", ") : "N/A";
    } catch (error) {
      console.error("Error processing classes for teacher:", item.id, error);
      return "N/A";
    }
  };

  const formatBirthday = (birthday: string) => {
    try {
      if (!birthday) return "N/A";
      const date = new Date(birthday);
      if (isNaN(date.getTime())) return "N/A";
      return date.toISOString().split("T")[0].replace(/-/g, "/");
    } catch (error) {
      console.error("Error formatting birthday for teacher:", birthday, error);
      return "N/A";
    }
  };

  // Desktop table row renderer (your original)
  const renderRow = (item: TeacherData) => {
    return (
      <tr
        key={item.id}
        className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50"
      >
        <td className="hidden lg:table-cell px-2 py-2 items-start">
          {`${item.name || ""} ${item.surname || ""}`.trim() || "N/A"}
        </td>
        <td className="hidden lg:table-cell px-2 py-2">
          {item.email || "N/A"}
        </td>
        <td className="hidden lg:table-cell px-2 py-2">
          {getSubjectsText(item)}
        </td>
        <td className="hidden lg:table-cell px-6 py-2">
          {getClassesText(item)}
        </td>
        <td className="hidden lg:table-cell px-6 py-2">
          {item.phone || "N/A"}
        </td>
        <td className="hidden lg:table-cell px-6 py-2">
          {item.address || "N/A"}
        </td>
        <td className="hidden lg:table-cell px-6 py-2">
          {item.bloodType || "N/A"}
        </td>
        <td className="hidden lg:table-cell px-6 py-2">{item.sex || "N/A"}</td>
        <td className="hidden lg:table-cell px-6 py-2">
          {formatBirthday(item.birthday)}
        </td>
        <td className="px-6 py-2">
          <div className="flex items-center gap-2">
            <Link href={`/list/teachers/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200 hover:bg-blue-300 transition-colors">
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
  };

  // Mobile card component
  const TeacherCard = ({ teacher }: { teacher: TeacherData }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header with name and actions */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {`${teacher.name || ""} ${teacher.surname || ""}`.trim() || "N/A"}
          </h3>
          <div className="flex items-center gap-1 text-gray-600 mt-1">
            <Mail size={14} className="flex-shrink-0" />
            <span className="text-sm truncate">{teacher.email || "N/A"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Link href={`/list/teachers/${teacher.id}`}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors">
              <View size={16} className="text-blue-600" />
            </button>
          </Link>
          {userRole === "ADMIN" && (
            <FormModal
              table="teacher"
              type="delete"
              id={teacher.id}
              data={undefined}
            />
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 gap-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={14} className="flex-shrink-0" />
          <span>{teacher.phone || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={14} className="flex-shrink-0" />
          <span className="truncate">{teacher.address || "N/A"}</span>
        </div>
      </div>

      {/* Academic Information */}
      <div className="grid grid-cols-1 gap-2 mb-3">
        <div className="flex items-start gap-2 text-sm">
          <BookOpen size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="font-medium text-gray-700">Subjects: </span>
            <span className="text-gray-600">{getSubjectsText(teacher)}</span>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <Users size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="font-medium text-gray-700">Classes: </span>
            <span className="text-gray-600">{getClassesText(teacher)}</span>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={14} className="flex-shrink-0" />
          <span className="truncate">{teacher.sex || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Droplets size={14} className="flex-shrink-0" />
          <span>{teacher.bloodType || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
          <Calendar size={14} className="flex-shrink-0" />
          <span>{formatBirthday(teacher.birthday)}</span>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="bg-white lg:bg-gray-50 p-4 rounded-md flex-1 mt-0 lg:min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading teachers...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white lg:bg-gray-50 p-4 rounded-md flex-1 mt-0 lg:min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block bg-white p-4 rounded-md flex-1 mt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">All Teachers</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4">
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

        {teachers.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-600 mb-4">No teachers found</p>
              {userRole === "ADMIN" && (
                <FormModal table="teacher" type="create" />
              )}
            </div>
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              renderRow={renderRow}
              data={paginatedTeachers}
            />
            <Pagination
              page={currentPage}
              count={teachers.length}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden bg-gray-50 min-h-screen">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">Teachers</h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {teachers.length} total
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
          {teachers.length === 0 ? (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No teachers found
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by adding your first teacher.
                </p>
                {(userRole === "ADMIN" || userRole === "EXECUTIVE") && (
                  <FormModal table="teacher" type="create" />
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              {/* Teacher Cards */}
              <div className="space-y-4 mb-6">
                {paginatedTeachers.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
              </div>

              {/* Mobile Pagination */}
              <div className="bg-white rounded-lg p-4">
                <Pagination
                  page={currentPage}
                  count={teachers.length}
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

export default ResponsiveTeacherListPage;
