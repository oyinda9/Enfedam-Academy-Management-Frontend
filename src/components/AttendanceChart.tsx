"use client";
import React, { useEffect, useState } from "react";
import { Ellipsis } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getAllAttendanceByStat } from "@/services/attendanceServices";

const AttendanceChart = () => {
  const [chartData, setChartData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' or 'classes'

  // Fetch attendance data
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await getAllAttendanceByStat();
      const attendanceData = response.data;

      // Transform data for weekly overview chart
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      const transformedData = days.map((day) => {
        const dayData = {
          name: day,
          malePresent: 0,
          maleAbsent: 0,
          femalePresent: 0,
          femaleAbsent: 0,
        };

        attendanceData.forEach((classData) => {
          const stats = classData.statistics[day];
          if (stats) {
            dayData.malePresent += stats.male?.present || 0;
            dayData.maleAbsent += stats.male?.absent || 0;
            dayData.femalePresent += stats.female?.present || 0;
            dayData.femaleAbsent += stats.female?.absent || 0;
          }
        });

        return dayData;
      });

      // Transform data for class-specific view
      const classTransformedData = attendanceData.map((classItem) => {
        const classStats = {
          className: classItem.className,
          malePresent: 0,
          maleAbsent: 0,
          femalePresent: 0,
          femaleAbsent: 0,
        };

        days.forEach((day) => {
          const stats = classItem.statistics[day];
          if (stats) {
            classStats.malePresent += stats.male?.present || 0;
            classStats.maleAbsent += stats.male?.absent || 0;
            classStats.femalePresent += stats.female?.present || 0;
            classStats.femaleAbsent += stats.female?.absent || 0;
          }
        });

        return classStats;
      });

      setChartData(transformedData);
      setClassData(classTransformedData);
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  if (loading)
    return (
      <div className="bg-white rounded-lg p-4 shadow-md">
        Loading attendance data...
      </div>
    );
  if (error)
    return (
      <div className="bg-white rounded-lg p-4 shadow-md text-red-500">
        Error: {error}
      </div>
    );

  const renderChart = (data) => (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barGap={4}
          barCategoryGap={12}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey={activeTab === "overview" ? "name" : "className"}
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "6px",
              borderColor: "#e5e7eb",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              fontSize: "12px",
            }}
            formatter={(value, name) => {
              const labels = {
                malePresent: "Male Present",
                maleAbsent: "Male Absent",
                femalePresent: "Female Present",
                femaleAbsent: "Female Absent",
              };
              return [value, labels[name]];
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", marginTop: "10px" }}
            formatter={(value) => {
              const labels = {
                malePresent: "Male Present",
                maleAbsent: "Male Absent",
                femalePresent: "Female Present",
                femaleAbsent: "Female Absent",
              };
              return labels[value];
            }}
          />
          <Bar
            dataKey="malePresent"
            name="malePresent"
            fill="#3b82d6"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="maleAbsent"
            name="maleAbsent"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="femalePresent"
            name="femalePresent"
            fill="#34D399" // Green color
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="femaleAbsent"
            name="femaleAbsent"
            fill="#F59E0B" // Yellow color
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-4 h-[90%] w-full shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Attendance Overview</h1>
        <div className="flex items-center">
          <div className="flex border rounded-md overflow-hidden">
            <button
              className={`px-3 py-1 text-sm ${
                activeTab === "overview"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Weekly
            </button>
            <button
              className={`px-3 py-1 text-sm ${
                activeTab === "classes"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setActiveTab("classes")}
            >
              By Class
            </button>
          </div>
          <Ellipsis className="cursor-pointer text-gray-500 ml-2" />
        </div>
      </div>

      {activeTab === "overview" ? (
        chartData.length > 0 ? (
          renderChart(chartData)
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No weekly attendance data available
          </div>
        )
      ) : classData.length > 0 ? (
        renderChart(classData)
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No class attendance data available
        </div>
      )}
    </div>
  );
};

export default AttendanceChart;
