import TableSearch from "@/components/TableSearch";
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Filter, ArrowDownNarrowWide, Plus } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role } from "../../../../lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";

type ResultList = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
};
const columns = [
  {
    headers: "Title",
    accessor: "title",
  },
  {
    headers: "Student",
    accessor: "student",
    className: "hidden md:table-cell",
  },

  {
    headers: "Class",
    accessor: "class",
  },
  {
    headers: "Score",
    accessor: "score",
    className: "hidden md:table-cell",
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
const renderRow = (item: ResultList) => (
  <tr
    key={item.id}
    className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50"
  >
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="flex-semibold">{item.title}</h3>
      </div>
    </td>
    <td className="hidden md:table-cell">
      {item.studentName + " " + item.studentSurname}
    </td>
    <td className="hidden md:table-cell">{item.className}</td>
    <td className="hidden md:table-cell">{item.score}</td>
    <td className="hidden md:table-cell">
      {item.teacherName + " " + item.teacherSurname}
    </td>
    <td className="hidden md:table-cell">
      {" "}
      {new Intl.DateTimeFormat("en-US").format(item.startTime)}
    </td>

    <td>
      <div className="flex items-center gap-2 self-end">
        <Link href={`/list/teachers/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200">
            <Pencil width={16} />
          </button>
        </Link>

        {role === "admin" && (
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-200">
            <Trash2 width={16} />
          </button>
        )}
      </div>
    </td>
  </tr>
);
const ResultsListPage = async ({
  searchParams = {}, // Provide a default empty object
}: {
  searchParams?: { [key: string]: string };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  // URL QUERY PARAMS RULES
  const query: Prisma.ResultWhereInput = {}; // Initialize the query object

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId": {
            query.studentId = value;
            break;
          }

          case "search": {
            query.OR = [
              {
                exam: { title: { contains: value, mode: "insensitive" } },
                student: { name: { contains: value, mode: "insensitive" } },
              },
            ];
            break;
          }
          default:
            break;
        }
      }
    }
  }

  // Execute Prisma transaction for fetching data and count
  const [dataResponse, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: {
          select: {
            name: true,
            surname: true,
          },
        },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },

        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },

      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({
      where: query,
    }),
  ]);

  const data = dataResponse.map((item) => {
    const assessment = item.exam || item.assignment;
    if (!assessment) return null;
    const isExam = " startTime " in assessment;
    return {
      id: item.id,
      title: assessment.title,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: assessment.lesson.teacher.name,
      teacherSurname: assessment.lesson.teacher.surname,
      score: item.score,
      className: assessment.lesson.class.name,
      startTime: isExam ? assessment.startTime : assessment.startDate,
    };
  });
  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold ">All Results</h1>
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

export default ResultsListPage;
