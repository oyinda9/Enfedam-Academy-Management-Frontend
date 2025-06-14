"use client";
import React, { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Ellipsis } from "lucide-react";
import { FaMale, FaFemale } from "react-icons/fa";
import { getAllStudents } from "@/services/studentService";

const CountChart = () => {
  const [students, setStudents] = useState<{ id: string; sex: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getAllStudents();
        setStudents(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.error("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const maleCount = students.filter((student) => student.sex === "MALE").length;
  const femaleCount = students.filter((student) => student.sex === "FEMALE").length;
  const totalCount = maleCount + femaleCount || 1;

  const data = [
    { name: "Total", count: totalCount, fill: "white" },
    { name: "Girls", count: femaleCount, fill: "red" },
    { name: "Boys", count: maleCount, fill: "#5fa0cb" },
  ];

  return (
    <div className="bg-white rounded-xl w-full p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Students</h1>
        <Ellipsis className="cursor-pointer text-black" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">Loading...</div>
      ) : (
        <>
          {/* --- Desktop Chart View --- */}
          <div className="hidden sm:block">
            <div className="relative w-full h-[220px]">
              <ResponsiveContainer>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="90%"
                  barSize={20}
                  data={data}
                >
                  <RadialBar background dataKey="count" />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2">
                <FaMale className="text-blue-500 text-3xl mx-2" />
                <FaFemale className="text-red-500 text-3xl mx-2" />
              </div>
            </div>

            <div className="flex justify-center gap-16 mt-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                <h1 className="font-bold text-red-500">{femaleCount}</h1>
                <h2 className="text-sm text-center">
                  Girls ({((femaleCount / totalCount) * 100).toFixed(1)}%)
                </h2>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 bg-[#5fa0cb] rounded-full"></div>
                <h1 className="font-bold text-[#5fa0cb]">{maleCount}</h1>
                <h2 className="text-sm text-center">
                  Boys ({((maleCount / totalCount) * 100).toFixed(1)}%)
                </h2>
              </div>
            </div>
          </div>

          {/* --- Mobile Info View --- */}
          <div className="block sm:hidden">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <FaFemale className="text-red-500 text-lg" />
                <div className="text-sm">
                  <p className="font-semibold text-red-500">Girls</p>
                  <p>{femaleCount} ({((femaleCount / totalCount) * 100).toFixed(1)}%)</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FaMale className="text-blue-500 text-lg" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-500">Boys</p>
                  <p>{maleCount} ({((maleCount / totalCount) * 100).toFixed(1)}%)</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CountChart;
