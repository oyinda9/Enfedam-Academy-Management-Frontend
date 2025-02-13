import TableSearch from "@/components/TableSearch";
import React from "react";
import { View, Trash2 } from "lucide-react";
import { Filter, ArrowDownNarrowWide } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role } from "../../../../lib/data";
import FormModal from "@/components/FormModal";
import { Class, Prisma, Teacher } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
type ClassesList = Class  & {supervisor:Teacher[]}
const columns = [
  {
    headers: "Class Name",
    accessor: "name",
  },
  {
    headers: "Capacity",
    accessor: "capacity",
  },
  {
    headers: "Grade",
    accessor: "grade",
  },
  {
    headers: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },

  {
    headers: "Actions",
    accessor: "actions",
  },
];
const ClassesListPage =  async ({
  searchParams,
}: {
  searchParams: { [key: string]: string } | undefined;
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL QUERY PARAMS RULES
  const query: Prisma.ClassWhereInput = {}; // Initialize the query object

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
          case "supervisorId": {
            query.supervisorId = {
              contains: value,
          
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
    prisma.class.findMany({
      where: query,
      include: {
        lessons: true,
        supervisor:{
          select:{
            name:true,
            surname:true,
          }
        }
        
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.class.count({
      where: query,
    }),
  ]);

  // // console.log(count);
  // console.log(searchParams);
  const renderRow = (item: ClassesList
  ) => (
    <tr
      key={item.id}
      className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="flex-semibold">{item.name}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">{item.gradeId}</td>
      <td className="hidden md:table-cell"> {item.supervisor.name + " " + item.supervisor.surname || 'No Supervisor'}</td>
      

      <td>
        <div className="flex items-center gap-2 self-end">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200">
              <View width={16} />
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

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold ">All Classes</h1>
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
              <FormModal table="class" type="create" data={undefined} />
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

export default ClassesListPage;
