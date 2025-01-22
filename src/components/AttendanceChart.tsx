"use client";
import React from 'react';
import { Expand } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip ,ResponsiveContainer  } from 'recharts';

const data = [
  {
    name: 'Mon',
    present: 400,
    absent: 60,
  },
  {
    name: 'Tue',
    present: 300,
    absent: 20,
  },
  {
    name: 'Wed',
    present: 90,
    absent: 70,
  },
  {
    name: 'Thurs',
    present: 60,
    absent: 70,
  },
  {
    name: 'Fri',
    present: 80,
    absent: 70,
  },
];

const AttendanceChart = () => {
  return (
    <div className='bg-white rounded-lg p-4 h-[450px] shadow-md'>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">Attendance</h1>
        <Expand className="cursor-pointer text-black" />
      </div>
      <ResponsiveContainer width="100%" height="100%" >
        <BarChart
          width={500}
          height={300}
          data={data}
          barSize={20}
          margin={{ top: 30, right: 30, left: 20, bottom: 5 }} 
         
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd' />
          <XAxis dataKey="name" axisLine={false} tick={{fill: "#6b7280"}} tickLine={false}/>
          <YAxis axisLine={false}  tick={{fill: "#6b7280"}} tickLine={false}/>
          <Tooltip contentStyle={{borderRadius:"10px" , borderColor:"lightgray"}} />
          <Bar dataKey="present" fill="#60a5fa"  legendType='circle' radius={[10,10,0,0]} />
          <Bar dataKey="absent" fill="#f87171"   legendType='circle' radius={[10,10,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AttendanceChart;  // default export
