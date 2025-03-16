import React from "react";
import { View, Filter, ArrowDownNarrowWide, User } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import TableSearch from "@/components/TableSearch";
import FormModal from "@/components/FormModal";
import { role } from "../../../../lib/data";
import Image from "next/image";

interface TeacherList {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  img?: string;
  subjects?: { name: string }[];
  classes?: { name: string }[];
}

// Dummy data
const dummyTeachers: TeacherList[] = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, City",
    img: "",
    subjects: [{ name: "Mathematics" }],
    classes: [{ name: "Grade 10" }, { name: "Grade 11" }],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "987-654-3210",
    address: "456 Elm St, Town",
    img: "",
    subjects: [{ name: "Science" }],
    classes: [{ name: "Grade 9" }],
  },
];

const columns = [
  { headers: "Info", accessor: "info" },
  {
    headers: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  { headers: "Subject", accessor: "subject" },
  { headers: "Classes", accessor: "classes" },
  { headers: "Phone", accessor: "phone" },
  {
    headers: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  { headers: "Actions", accessor: "actions" },
];

const renderRow = (item: TeacherList) => (
  <tr
    key={item.id}
    className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50"
  >
    <td className="flex items-center gap-4 p-4">
      {item.img ? (
        <Image
          src={item.img}
          alt="Teacher"
          width={40}
          height={40}
          className="md:hidden xl:block rounded-full"
        />
      ) : (
        <User className="w-8 h-8 rounded-full border border-gray-600 text-gray-500 md:hidden xl:block" />
      )}
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-700">{item.email || "No Email"}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.id}</td>
    <td className="hidden md:table-cell">
      {item.subjects?.length
        ? item.subjects.map((s) => s.name).join(", ")
        : "No subject"}
    </td>
    <td className="hidden md:table-cell">
      {item.classes?.length
        ? item.classes.map((c) => c.name).join(", ")
        : "No class"}
    </td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td className="hidden lg:table-cell">{item.address}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/teachers/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200">
            <View size={16} />
          </button>
        </Link>
        {role === "admin" && (
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

const TeacherListPage = () => {
  const data = dummyTeachers;
  const count = data.length;
  const p = 1; // Default page to 1 since it's dummy data

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
      <div>
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default TeacherListPage;
