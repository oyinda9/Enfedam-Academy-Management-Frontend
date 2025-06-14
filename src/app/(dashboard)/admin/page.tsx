"use client";
import React, { useState, useEffect } from "react";
import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import { getAllParent } from "@/services/parentService";
import { getAllStudents } from "@/services/studentService";
import { getAllTeachers } from "@/services/teacherServices";

const AdminPage = () => {
  const [totals, setTotals] = useState({
    students: 0,
    teachers: 0,
    parents: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchData = async () => {
      try {
        const [students, teachers, parents] = await Promise.all([
          getAllStudents(),
          getAllTeachers(),
          getAllParent(),
        ]);

        setTotals({
          students: students.length || 0,
          teachers: teachers.length || 0,
          parents: parents.length || 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!isClient) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-3 sm:p-4 flex flex-col lg:flex-row gap-4 font-poppins">
      {/* MAIN CONTENT (LEFT) */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        {/* USER CARDS - Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <UserCard type="student" count={totals.students} />
          <UserCard type="teacher" count={totals.teachers} />
          <UserCard type="parent" count={totals.parents} />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/3 h-[250px] sm:h-[300px]">
            <CountChart />
          </div>
          <div className="w-full lg:w-2/3 h-[250px] sm:h-[300px]">
            <AttendanceChart />
          </div>
        </div>

        {/* BOTTOM CHART */}
        <div className="w-full h-[350px] sm:h-[400px]">
          <FinanceChart />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 sm:gap-6">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;