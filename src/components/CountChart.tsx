"use client";
import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Ellipsis } from 'lucide-react';
import { FaMale } from "react-icons/fa";
import { FaFemale } from "react-icons/fa";

const data = [
  {
    name: "Total",
    count: 106,
    fill: "white",
  },
  {
    name: "Girls",
    count: 50,
    fill: "red",
  },
  {
    name: "Boys",
    count: 60,

    fill: "#83a6ed",
  },
];

const CountChart = () => {
  return (
    <div className="bg-white  rounded-xl w-full h-full p-4 shadow-md ">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">Students</h1>
        <Ellipsis className="cursor-pointer text-black" />
      </div>
      {/* CHARTS */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={20}
            data={data}
          >
            <RadialBar background  dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 flex justify- -translate-x-1/2 -translate-y-1/2">
          <FaMale
            style={{
              fontSize: "30px",
              color: "blue",
              width: "50px",
              height: "40px",
            }}
          />
          <FaFemale
            style={{
              fontSize: "30px",
              color: "red",
              width: "50px",
              height: "40px",
            }}
          />
        </div>
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        {/* Boys Section */}
        <div className="flex flex-col items-center gap-2">
          {/* Circle for Boys */}
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"></div>
          {/* Number Outside Circle */}
          <h1 className="font-bold text-red-500">1,233</h1>
          <h2 className="text-sm text-center">Girls (55%)</h2>
        </div>

        {/* Girls Section */}
        <div className="flex flex-col items-center gap-2">
          {/* Circle for Girls */}
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"></div>
          {/* Number Outside Circle */}
          <h1 className="font-bold text-blue-500">1,233</h1>
          <h2 className="text-sm text-center">Boys (45%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
