import TableSearch from '@/components/TableSearch'
import React from 'react'
import { Filter, ArrowDownNarrowWide   , Plus  } from 'lucide-react';
import Pagination from '@/components/Pagination';

const TeacherListPage = () => {
  return (
    <div className='bg-white p-4 rounded-md flex-1 mt-0'> 
    {/* TOP */}
    <div className='flex items-center justify-between'>
      <h1 className='hidden md:block text-lg font-semibold '>All Teachers</h1>
      <div className='flex flex-col md:flex-row items-center gap-4  w-full md:w-auto'>
        <TableSearch/>
        <div className='flex items-center gap-4 self-end'>
          <button className='w-8 h-8 flex items-center justify-center rounded-full bg-green-300'>
          <Filter size={22} color="black" />
          </button>

          <button className='w-8 h-8 flex items-center justify-center rounded-full bg-green-300'>
          <ArrowDownNarrowWide   size={22} color="black" />
          </button>

          <button className='w-8 h-8 flex items-center justify-center rounded-full bg-green-300'>
          <Plus size={22} color="black" />
          </button>

        </div>
      </div>
    </div>
  {/* LIST */}
  <div className=''></div>
 {/* PAGINATION */}

  <Pagination/>


    
    </div>
  )
}

export default TeacherListPage