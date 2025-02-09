import TableSearch from "@/components/TableSearch";
import React from "react";
import { View, User } from "lucide-react";
import { Filter, ArrowDownNarrowWide } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role } from "../../../../lib/data";
import FormModal from "@/components/FormModal";
import { Attendance, Class, Prisma, Result, Student } from "@prisma/client";
import { ITEM_PER_PAGE } from "@/lib/settings";
import prisma from "@/lib/prisma";
import Image from "next/image";

type StudentList = Student & { attendances: Attendance[] } & {
  results: Result[];
} & {
  class: Class[];
};
const columns = [
  {
    headers: "Info",
    accessor: "info",
  },
  {
    headers: "Student ID",
    accessor: "studentId",
    className: "hidden md:table-cell",
  },
  {
    headers: "Grade",
    accessor: "grade",
  },

  {
    headers: "Phone",
    accessor: "phone",
  },
  {
    headers: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    headers: "Actions",
    accessor: "actions",
  },
];

const renderRow = (item: StudentList) => (
  <tr
    key={item.id}
    className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50"
  >
    <td className="flex items-center gap-4 p-4">
      {item.img ? (
        <Image
          src={item.img}
          alt="student"
          width={40}
          height={40}
          className="md:hidden xl:block rounded-full"
        />
      ) : (
        <User className="w-8 h-8 rounded-full border border-gray-600  text-gray-500 md:hidden xl:block" />
      )}
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-700">{item.email || "No Email"}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.username}</td>
    <td className="hidden md:table-cell">{item.classId}</td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td className="hidden md:table-cell">{item.address}</td>
    <td>
      <div className="flex items-center gap-2 self-end">
        <Link href={`/list/students/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200">
            <View width={16} />
          </button>
        </Link>

        {role === "admin" && (
          <FormModal
            table="student"
            type="delete"
            id={item.id}
            data={undefined}
          />
        )}
      </div>
    </td>
  </tr>
);

const StudentListPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string  } | undefined;
}) => {
  const { page, ...queryParams } = searchParams ??{} ;
  const p = page ? parseInt(page) : 1;

  // URL QUERY PARAMS RULES
  const query: Prisma.StudentWhereInput = {}; // Initialize the query object

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId": {
            query.lessons = {
              some: {
                teacherId: value,
              },
            };
            break;
          }
          case "search": {
            query.name = {
              contains: value,
              mode: "insensitive",
            };
            break;
          }
        }
      }
    }
  }

  // Execute Prisma transaction for fetching data and count
  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        attendances: true,
        results: true,
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.student.count({
      where: query,
    }),
  ]);

  // console.log(count);
  console.log(searchParams);
  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold ">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <Filter size={22} color="black" />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <ArrowDownNarrowWide size={22} color="black" />
            </button>

            {role === "admin" && <FormModal table="student" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <div className="">
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>
      {/* PAGINATION */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default StudentListPage;
