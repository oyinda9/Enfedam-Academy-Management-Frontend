import TableSearch from "@/components/TableSearch";
import React from "react";
import { Filter, ArrowDownNarrowWide } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { parentsData, role } from "../../../../lib/data";
import FormModal from "@/components/FormModal";
type Parent = {
  id: number;
  name: string;
  students: string[];
  phone?: string;
  email?: string;
  address: string;
};
const columns = [
  {
    headers: "Info",
    accessor: "info",
  },
  {
    headers: "Student Name",
    accessor: "students",
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
  },
];
const ParentListPage = () => {
  const renderRow = (item: Parent) => (
    <tr
      key={item.id}
      className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="flex-semibold">{item.name}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.students.join(",")}</td>
      <td className="hidden md:table-cell">{item.email}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2 self-end">
          <Link href={`/list/teachers/${item.id}`}></Link>

          {role === "admin" && (
            <>
              <FormModal table="parent" type="update" data={item} />
              <FormModal
                table="parent"
                type="delete"
                id={item.id}
                data={undefined}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold ">All Parents</h1>
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
              <FormModal table="parent" type="create" data={undefined} />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <div className="">
        <Table columns={columns} renderRow={renderRow} data={parentsData} />
      </div>
      {/* PAGINATION */}

      <Pagination />
    </div>
  );
};

export default ParentListPage;
