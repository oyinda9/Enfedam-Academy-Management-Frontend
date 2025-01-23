"use client";
import React from "react";
import { Ellipsis } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", income: 400, expense: 240 },
  { name: "Feb", income: 3000, expense: 1398 },
  { name: "Mar", income: 2000, expense: 9800 },
  { name: "Apr", income: 2780, expense: 3908 },
  { name: "May", income: 1890, expense: 4800 },
  { name: "July", income: 2390, expense: 3800 },
  { name: "Aug", income: 3490, expense: 4300 },
  { name: "Sept", income: 3490, expense: 4300 },
  { name: "Oct", income: 3490, expense: 4300 },
  { name: "Nov", income: 3490, expense: 4300 },
  { name: "Dec", income: 3490, expense: 4300 },
];

const FinanceChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 shadow-lg">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">Finance</h1>
        <Ellipsis className="cursor-pointer text-black" />
      </div>
      <div>
        <ResponsiveContainer width="100%" height={490}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tickMargin={10} />
            <YAxis  tickMargin={10}/>
            <Tooltip />
            <Legend />
            
            <Line
              type="monotone"
              dataKey="income"
              stroke="#60a5fa"
              strokeWidth={5}
             
            />
            <Line type="monotone" dataKey="expense" stroke="#f87171"  strokeWidth={5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinanceChart;
