"use client"
import { useEffect, useState } from "react"
import { Ellipsis } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { getAllAttendanceByStat } from "@/services/attendanceServices"

const AttendanceChart = () => {
  const [chartData, setChartData] = useState([])
  const [classData, setClassData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  const fetchAttendanceData = async () => {
    try {
      setLoading(true)
      const response = await getAllAttendanceByStat()
      const attendanceData = response.data

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
      const transformedData = days.map((day) => {
        const dayData = {
          name: day,
          malePresent: 0,
          maleAbsent: 0,
          femalePresent: 0,
          femaleAbsent: 0,
        }

        attendanceData.forEach((classData) => {
          const stats = classData.statistics[day]
          if (stats) {
            dayData.malePresent += stats.male?.present || 0
            dayData.maleAbsent += stats.male?.absent || 0
            dayData.femalePresent += stats.female?.present || 0
            dayData.femaleAbsent += stats.female?.absent || 0
          }
        })

        return dayData
      })

      const classTransformedData = attendanceData.map((classItem) => {
        const classStats = {
          className: classItem.className,
          malePresent: 0,
          maleAbsent: 0,
          femalePresent: 0,
          femaleAbsent: 0,
        }

        days.forEach((day) => {
          const stats = classItem.statistics[day]
          if (stats) {
            classStats.malePresent += stats.male?.present || 0
            classStats.maleAbsent += stats.male?.absent || 0
            classStats.femalePresent += stats.female?.present || 0
            classStats.femaleAbsent += stats.female?.absent || 0
          }
        })

        return classStats
      })

      setChartData(transformedData)
      setClassData(classTransformedData)
    } catch (err) {
      setError(err.message || "Failed to load attendance data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendanceData()
  }, [])

  if (loading) return (
    <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
      <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
      <div className="h-40 bg-gray-100 rounded"></div>
    </div>
  )
  
  if (error) return (
    <div className="bg-white rounded-lg p-4 shadow-sm text-red-500 text-sm">
      Error: {error}
    </div>
  )

  const renderMobileData = (data, isClassView = false) => (
    <div className="sm:hidden space-y-3 max-h-[300px] overflow-y-auto">
      {data.map((item, index) => (
        <div key={index} className="border-b border-gray-100 pb-3">
          <h3 className="font-medium text-sm mb-2">
            {isClassView ? item.className : item.name}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-blue-500">Male Present: {item.malePresent}</div>
            <div className="text-red-500">Male Absent: {item.maleAbsent}</div>
            <div className="text-green-500">Female Present: {item.femalePresent}</div>
            <div className="text-yellow-500">Female Absent: {item.femaleAbsent}</div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderChart = (data) => (
    <div className="sm:h-[250px] md:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 10, right: 5, left: 0, bottom: 5 }}
          barSize={activeTab === "classes" ? 12 : 16}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis
            dataKey={activeTab === "overview" ? "name" : "className"}
            tick={{ fill: "#6b7280", fontSize: 10 }}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 10 }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
              padding: "8px",
            }}
            formatter={(value, name) => {
              const labels = {
                malePresent: "Male Present",
                maleAbsent: "Male Absent",
                femalePresent: "Female Present",
                femaleAbsent: "Female Absent",
              }
              return [value, labels[name]]
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }}
            formatter={(value) => {
              const labels = {
                malePresent: "Male Present",
                maleAbsent: "Male Absent",
                femalePresent: "Female Present",
                femaleAbsent: "Female Absent",
              }
              return labels[value]
            }}
          />
          <Bar 
            dataKey="malePresent" 
            name="malePresent" 
            fill="#3b82f6" 
            radius={[2, 2, 0, 0]} 
          />
          <Bar 
            dataKey="maleAbsent" 
            name="maleAbsent" 
            fill="#ef4444" 
            radius={[2, 2, 0, 0]} 
          />
          <Bar 
            dataKey="femalePresent" 
            name="femalePresent" 
            fill="#10b981" 
            radius={[2, 2, 0, 0]} 
          />
          <Bar 
            dataKey="femaleAbsent" 
            name="femaleAbsent" 
            fill="#f59e0b" 
            radius={[2, 2, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )

  return (
    <div className="bg-white rounded-lg p-2 shadow-md w-full">
      {/* Header */}
      <div className="flex flex-col gap-3 mt-3 ">
        <div className="flex justify-between items-start">
          <h1 className="text-sm font-semibold">Attendance Overview</h1>
          <Ellipsis className="text-gray-500 w-4 h-4" />
        </div>
        
        <div className="flex border rounded-md overflow-hidden">
          <button
            className={`flex-1 px-2 py-1 text-xs ${
              activeTab === "overview" 
                ? "bg-blue-500 text-white" 
                : "bg-white text-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Weekly
          </button>
          <button
            className={`flex-1 px-2 py-1 text-xs ${
              activeTab === "classes" 
                ? "bg-blue-500 text-white" 
                : "bg-white text-gray-700"
            }`}
            onClick={() => setActiveTab("classes")}
          >
            By Class
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "overview" ? (
        chartData.length > 0 ? (
          <>
            <div className="hidden sm:block">{renderChart(chartData)}</div>
            {renderMobileData(chartData)}
          </>
        ) : (
          <div className="text-gray-500 text-sm text-center py-8">
            No weekly data available
          </div>
        )
      ) : classData.length > 0 ? (
        <>
          <div className="hidden sm:block">{renderChart(classData)}</div>
          {renderMobileData(classData, true)}
        </>
      ) : (
        <div className="text-gray-500 text-sm text-center py-8">
          No class data available
        </div>
      )}
    </div>
  )
}

export default AttendanceChart