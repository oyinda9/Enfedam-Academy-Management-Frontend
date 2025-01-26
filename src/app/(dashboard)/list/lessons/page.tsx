import TableSearch from "@/components/TableSearch";
import React from "react";
// import {   } from "lucide-react";
import { Filter, ArrowDownNarrowWide, Plus } from "lucide-react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { lessonsData, role } from "../../../../../lib/data";
import FormModal from "@/components/FormModal";
type Lessons = {
  id: number;
  subject: string;
  class: number;
  teacher:number;

  
};
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
    headers: "Actions",
    accessor: "actions",
  },
];
const LessonListPage = () => {
  const renderRow = (item: Lessons) => (
    <tr key={item.id} className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50">
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="flex-semibold">{item.subject}</h3>
         
        </div>
      </td>
      <td  className="hidden md:table-cell">{item.class}</td>
      <td className="hidden md:table-cell">{item.teacher}</td>
    
      
      <td>
        <div className="flex items-center gap-2 self-end">
          <Link href={`/list/teachers/${item.id}`}>
          <FormModal table="lesson" type="update" id={item.id} data={undefined}/>
          </Link>

          {role === "admin" && (
             <FormModal table="lesson" type="delete" id={item.id} data={undefined}/>)}
          
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold ">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <Filter size={22} color="black" />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <ArrowDownNarrowWide size={22} color="black" />
            </button>

          {role === "admin" && (<button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300">
              <Plus size={22} color="black" />
            </button>)} 
          </div>
        </div>
      </div>
      {/* LIST */}
      <div className="">
        <Table columns={columns} renderRow={renderRow} data={lessonsData} />
      </div>
      {/* PAGINATION */}

      <Pagination />
    </div>
  );
};

export default LessonListPage;
