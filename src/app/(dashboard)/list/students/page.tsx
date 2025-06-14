"use client";

import React, { useState, useEffect } from "react";
import TableSearch from "@/components/TableSearch";
import { View, Filter, ArrowDownNarrowWide } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import { getAllStudents } from "@/services/studentService";
import PulseLoader from "@/components/loader";

const columns = [
  {
    headers: "Full Name",
    accessor: "fullName",
    className: "",
    visibleFor: ["ADMIN", "USER"],
  },
    
  {
    headers: "Email",
    accessor: "Email",
    className: "",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Phone",
    accessor: "Phone",
    className: "",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Address",
    accessor: "Address",
    className: "",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Blood-Type",
    accessor: "fullName",
    className: "",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Gender",
    accessor: "Gender",
    className: "",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "DOB",
    accessor: "DOB",
    className: "",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Class",
    accessor: "Class",
    className: "",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Parent",
    accessor: "Parent",
    className: "",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Email",
    accessor: "Email",
    className: "",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Phone",
    accessor: "Phone",
    className: "",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Actions",
    accessor: "Actions",
    className: "",
    visibleFor: ["ADMIN", "USER"],
  },
];

const ITEMS_PER_PAGE = 5;

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(loggedInUser);

    const fetchStudents = async () => {
      try {
        const data = await getAllStudents();

        if (loggedInUser?.role === "USER") {
          const filteredStudents = data.filter(
            (student) => student.parent?.id === loggedInUser?.user?.id
          );
          setStudents(filteredStudents);
        } else if (loggedInUser?.role === "TEACHER") {
          const filteredTeacherStudents = data.filter(
            (student) => student.class?.supervisorId === loggedInUser?.user?.id
          );
          setStudents(filteredTeacherStudents);
        } else if (loggedInUser?.role === "ADMIN") {
          setStudents(data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
  const paginatedStudents = students.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderRow = (item) => {
    const isParent = user?.role === "USER";
    const isTeacher = user?.role === "TEACHER";
    const isAdmin = user?.role === "ADMIN";

    if (isParent) {
      return (
        <tr
          key={`parent-${item.id}`}
          className="even:bg-slate-100 text-sm hover:bg-red-50"
        >
          <td colSpan={100} className="p-0">
            <div className="bg-white w-full shadow-lg rounded-lg p-6 border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <strong>Full Name:</strong>
                  <p>
                    {`${item.name || "N/A"} ${item.surname || "N/A"}`.trim()}
                  </p>
                </div>
                <div>
                  <strong>Email:</strong>
                  <p>{item.email || "No Email"}</p>
                </div>
                <div>
                  <strong>Phone:</strong>
                  <p>{item.phone || "No Phone"}</p>
                </div>
                <div>
                  <strong>Blood Type:</strong>
                  <p>{item.bloodType || "N/A"}</p>
                </div>
                <div>
                  <strong>Birthday:</strong>
                  <p>
                    {item.birthday
                      ? new Date(item.birthday).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <strong>Class:</strong>
                  <p>{item.class?.name || "No Class"}</p>
                </div>
                <div>
                  <strong>Parent Name:</strong>
                  <p>
                    {item.parent
                      ? `${item.parent.name} ${item.parent.surname}`.trim()
                      : "No Parent Info"}
                  </p>
                </div>
                <div>
                  <strong>Parent Email:</strong>
                  <p>{item.parent?.email || "No Parent Email"}</p>
                </div>
                <div>
                  <strong>Parent Phone:</strong>
                  <p>{item.parent?.phone || "No Parent Phone"}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Link href={`/list/students/${item.id}`}>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 transition">
                    <View width={20} />
                  </button>
                </Link>
              </div>
            </div>
          </td>
        </tr>
      );
    } else if (isTeacher) {
      return (
        <tr
          key={`teacher-${item.id}`}
          className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50"
        >
          <td className="hidden lg:table-cell px-4 py-2">
            {`${item.name || "N/A"} ${item.surname || "N/A"}`.trim()}
          </td>
          <td className="hidden md:table-cell px-6 py-2">
            {item.email || "No Email"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.phone || "No Phone"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.address || "No address"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.bloodType || "N/A"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.sex || "No sex"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {new Date(item.birthday).toLocaleDateString() || "N/A"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.class.name || "No class Assigned"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.parent
              ? `${item.parent.name} ${item.parent.surname}`.trim()
              : "No Parent Info"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.parent.email || "No email "}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.parent.phone || "No phone "}
          </td>
          <td className="px-4 py-2">
            <div className="flex items-center gap-4">
              <Link href={`/list/teachers/${item.id}`}>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200">
                  <View width={18} />
                </button>
              </Link>
              <FormModal table="teacher" type="delete" id={item.id} />
            </div>
          </td>
        </tr>
      );
    } else if (isAdmin) {
      return (
        <tr
          key={`admin-${item.id}`}
          className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50"
        >
          <td className="hidden lg:table-cell px-4 py-2">
            {`${item.name || "N/A"} ${item.surname || "N/A"}`.trim()}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.email || "No Email"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.phone || "No Phone"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.address || "No address"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.bloodType || "N/A"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.sex || "N/A"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {new Date(item.birthday).toLocaleDateString() || "N/A"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.class?.name || "No Class"}
          </td>
          <td className="hidden md:table-cell px-6 py-2">
            {item.parent
              ? `${item.parent.name} ${item.parent.surname}`.trim()
              : "No Parent Info"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.parent?.email || "No Parent Email"}
          </td>
          <td className="hidden md:table-cell px-4 py-2">
            {item.parent?.phone || "No Parent Phone"}
          </td>
          <td className="px-4 py-2">
            <div className="flex items-center gap-4">
              <Link href={`/list/students/${item.id}`}>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200">
                  <View width={18} />
                </button>
              </Link>
              <FormModal table="student" type="delete" id={item.id} />
            </div>
          </td>
        </tr>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0 text-black">
      <div className="flex items-center justify-between">
        <section>
          <h1 className="hidden md:block text-lg font-semibold">
            {user?.role === "USER" ? "My Children" : "All Students"}
          </h1>
        </section>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <Filter size={22} color="black" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <ArrowDownNarrowWide size={22} color="black" />
            </button>
            {user?.role === "ADMIN" && (
              <FormModal table="student" type="create" />
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <PulseLoader />
        </div>
      ) : (
        <>
          {user?.role === "USER" ? (
            <table className="w-full mt-4">
              <tbody>
                {paginatedStudents.map((student) => renderRow(student))}
              </tbody>
            </table>
          ) : (
            <Table
              columns={columns}
              renderRow={renderRow}
              data={paginatedStudents}
            />
          )}
          <Pagination
            page={currentPage}
            count={students.length}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default StudentListPage;
