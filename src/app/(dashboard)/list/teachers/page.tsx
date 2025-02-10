import React from "react";
import { View, Filter, ArrowDownNarrowWide, User } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import TableSearch from "@/components/TableSearch";
import FormModal from "@/components/FormModal";
import { role } from "../../../../lib/data";
import { Class, Lesson, Prisma, Teacher } from "@prisma/client";
import Image from "next/image";
import { Subjects } from "react-hook-form";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";

type TeacherList = Teacher & { subjects: Subjects[] } & {
  lessons: Lesson[];
} & {
  classes: Class[];
};

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
        <User className="w-8 h-8 rounded-full border border-gray-600  text-gray-500 md:hidden xl:block" />
      )}
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-700">{item.email || "No Email"}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.id}</td>
    <td className="hidden md:table-cell">
      {item.subjects?.length
        ? item.subjects
            .map((subject) => subject?.name || "No subject name")
            .join(" ,")
        : "No subject name"}
    </td>
    <td className="hidden md:table-cell">
      {item.classes?.length
        ? item.classes.map((classItem) => classItem.name).join(" ,")
        : "No class name"}
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
const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string } | undefined;
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL QUERY PARAMS RULES
  const query: Prisma.TeacherWhereInput = {}; // Initialize the query object

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId": {
            query.lessons = {
              some: {
                classId: parseInt(value, 10),
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
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
        lessons: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count({
      where: query,
    }),
  ]);

  // console.log(count);
  console.log(searchParams);

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
