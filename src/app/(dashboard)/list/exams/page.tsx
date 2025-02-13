import TableSearch from "@/components/TableSearch";
import React from "react";
// import {   } from "lucide-react";
import { Filter, ArrowDownNarrowWide, Plus } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
// import Link from "next/link";
import { role } from "../../../../lib/data";
// import FormModal from "@/components/FormModal";
import prisma from "@/lib/prisma";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import { ITEM_PER_PAGE } from "@/lib/settings";
type ExamList = Exam & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
} & { class: Class[] };
const columns = [
  {
    headers: "Subject",
    accessor: "subject",
  },
  {
    headers: "Class",
    accessor: "class",
  },
  {
    headers: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    headers: "Date",
    accessor: "date",
  },

  {
    headers: "Actions",
    accessor: "actions",
  },
];
const renderRow = (item: ExamList) => (
  <tr
    key={item.id}
    className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50"
  >
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="flex-semibold">{item.lesson.subject.name}</h3>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.lesson.class.name}</td>
    <td className="hidden md:table-cell">
      {item.lesson.teacher.name + " " + item.lesson.teacher.surname}
    </td>
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("en-US").format(item.startTime)}
    </td>

    {/* <td>
      <div className="flex items-center gap-2 self-end">
        <Link href={`/list/exams/${item.id}`}>
          <FormModal table="exam" type="update" id={item.id} />
        </Link>

        {role === "admin" && (
          <FormModal table="exam" type="delete" id={item.id} />
        )}
      </div>
    </td> */}
  </tr>
);
const ExamListPage = async ({
  searchParams = {}, // Provide a default empty object
}: {
  searchParams?: { [key: string]: string };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  // URL QUERY PARAMS RULES
  const query: Prisma.ExamWhereInput = {}; // Initialize the query object

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId": {
            query.lesson = { classId: parseInt(value) };
            break;
          }
          case "teacherId": {
            query.lesson = { teacherId: value };
            break;
          }
          case "search": {
            query.lesson = {
              subject: {
                name: {
                  contains: value,
                  mode: "insensitive",
                },
              },
            };
            break;
          }
        }
      }
    }
  }

  // Execute Prisma transaction for fetching data and count
  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: {
              select: { name: true },
            },
            teacher: {
              select: { name: true, surname: true },
            },
            class: {
              select: { name: true },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.exam.count({
      where: query,
    }),
  ]);

  // console.log(count);
  console.log(searchParams);

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold ">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <Filter size={22} color="black" />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <ArrowDownNarrowWide size={22} color="black" />
            </button>

            {role === "admin" && (
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
                <Plus size={22} color="black" />
              </button>
            )}
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

export default ExamListPage;
