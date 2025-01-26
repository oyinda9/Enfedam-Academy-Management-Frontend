"use client"
import React from 'react'
import { PieChart, Pie,  ResponsiveContainer } from 'recharts';
import { Ellipsis } from "lucide-react";

const data = [
  { name: 'Group A', value: 92  , fill:"#93C5FD"},
  { name: 'Group B', value: 12 ,fill:"#f87171" },
  
];


const TeacherPerfomance = () => {
  return (
    <div className='bg-white p-4 rounded-md h-80 relative'>
        <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>Peformance</h1>
            <Ellipsis className="cursor-pointer text-black" />
        </div>
        <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            fill="#8884d8"
            label
          />
        </PieChart>
      </ResponsiveContainer>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'>
      <h1 className='text-3xl font-bold'>9.2</h1>
      <p className=' text-xs  text-gray-600'>of 10 max</p>
      </div>
      <h2 className='absolute font-medium bottom-16 left-0 right-0 m-auto text-center'>1st Term - 3rd Term</h2>
    </div>
  )
}

export default TeacherPerfomance