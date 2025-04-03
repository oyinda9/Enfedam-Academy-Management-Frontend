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
    className: "hidden lg:table-cell",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Email",
    accessor: "email",
    className: "hidden md:table-cell",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Phone",
    accessor: "phone",
    className: "hidden md:table-cell",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Blood Type",
    accessor: "bloodType",
    className: "hidden md:table-cell",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Sex",
    accessor: "sex",
    className: "hidden md:table-cell",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Birthday",
    accessor: "birthday",
    className: "hidden md:table-cell",
  },
  {
    headers: "Class",
    accessor: "class",
    className: "hidden md:table-cell",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Parent Name",
    accessor: "parentName",
    className: "hidden md:table-cell",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Parent Email",
    accessor: "parentEmail",
    className: "hidden md:table-cell",
    visibleFor: ["ADMIN", "USER"],
  },
  {
    headers: "Parent Phone",
    accessor: "parentPhone",
    className: "hidden md:table-cell",
    visibleFor: ["ADMIN", "USER"],
  },
  { headers: "Actions", accessor: "actions", visibleFor: ["ADMIN"] },
];

const ITEMS_PER_PAGE = 5; // Adjust number of items per page

const StudentListPage = () => {
  const [students, setStudents] = useState<[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null); // Store user data
  const [currentPage, setCurrentPage] = useState(1);

  // useEffect(() => {
  //   const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}"); // Assuming user data is stored in localStorage
  //   setUser(loggedInUser); // Set the user data once when the component mounts

  //   const fetchStudents = async () => {
  //     try {
  //       const data = await getAllStudents();

  //       // If the logged-in user is a parent, filter students based on the logged-in parent's ID
  //       if (loggedInUser.role === "USER" && loggedInUser.user.id) {
  //         const filteredStudents = data.filter(
  //           (student: any) => student.parent?.id === loggedInUser.user.id
  //         );
  //         console.log("user", loggedInUser.user.id);
  //         setStudents(filteredStudents);
  //       } else {
  //         setStudents(data); // For admin, show all students
  //       }
  //     } catch (error) {
  //       console.error("Error fetching students:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStudents();
  // }, []); // Empty dependency array to run only once when the component mounts

  // Calculate pagination

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(loggedInUser); // Set the user data once when the component mounts

    const fetchStudents = async () => {
      try {
        const data = await getAllStudents();

        // If the logged-in user is a parent, filter students based on the logged-in parent's ID
        if (loggedInUser?.role === "USER" && loggedInUser?.user?.id) {
          const filteredStudents = data.filter(
            (student: any) => student.parent?.id === loggedInUser.user.id
          );
          console.log("user", loggedInUser.user.id);
          setStudents(filteredStudents);
        } else if (loggedInUser?.role === "ADMIN") {
          // For admin, show all students
          setStudents(data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []); // Only run once when the component mounts

  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
  const paginatedStudents = students.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const renderRow = (item) => {
    const isParent = user?.role === "USER";

    return (
      <tr
        key={item.id}
        className={`border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50 ${
          isParent
            ? "flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-md"
            : ""
        }`}
      >
        {isParent ? (
          // Parent view with columns shown, in a more card-like style
          <>
            <div className="flex-1">
              <strong>{`Full Name:`}</strong>
              <p>{`${item.name || "N/A"} ${item.surname || "N/A"}`.trim()}</p>
            </div>
            <div className="flex-1">
              <strong>{`Email:`}</strong>
              <p>{item.email || "No Email"}</p>
            </div>
            <div className="flex-1">
              <strong>{`Phone:`}</strong>
              <p>{item.phone || "No Phone"}</p>
            </div>
            <div className="flex-1">
              <strong>{`Blood Type:`}</strong>
              <p>{item.bloodType || "N/A"}</p>
            </div>
            <div className="flex-1">
              <strong>{`Birthday:`}</strong>
              <p>{new Date(item.birthday).toLocaleDateString() || "N/A"}</p>
            </div>
            <div className="flex-1">
              <strong>{`Class:`}</strong>
              <p>{item.class?.name || "No Class"}</p>
            </div>
            <div className="flex-1">
              <strong>{`Parent Name:`}</strong>
              <p>
                {item.parent
                  ? `${item.parent.name} ${item.parent.surname}`.trim()
                  : "No Parent Info"}
              </p>
            </div>
            <div className="flex-1">
              <strong>{`Parent Email:`}</strong>
              <p>{item.parent?.email || "No Parent Email"}</p>
            </div>
            <div className="flex-1">
              <strong>{`Parent Phone:`}</strong>
              <p>{item.parent?.phone || "No Parent Phone"}</p>
            </div>

            <div className="mt-4 flex gap-4">
              <Link href={`/list/students/${item.id}`}>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200">
                  <View width={18} />
                </button>
              </Link>
              <FormModal table="student" type="delete" id={item.id} />
            </div>
          </>
        ) : (
          // Admin view as a table row
          <>
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
              {item.address || "No Address"}
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
          </>
        )}
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0 text-black">
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
    </div>
  );
};

export default StudentListPage;
