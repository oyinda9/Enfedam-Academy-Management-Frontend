"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Announcements = dynamic(() => import("@/components/Announcements"), { ssr: false });
const AttendanceChart = dynamic(() => import("@/components/AttendanceChart"), { ssr: false });
const CountChart = dynamic(() => import("@/components/CountChart"), { ssr: false });
const FinanceChart = dynamic(() => import("@/components/FinanceChart"), { ssr: false });
const EventCalendar = dynamic(() => import("@/components/EventCalendar"), { ssr: false });
const UserCard = dynamic(() => import("@/components/UserCard"), { ssr: false });
import { getAllParent } from "@/services/parentService";
import { getAllStudents } from "@/services/studentService";
import { getAllTeachers } from "@/services/teacherServices";

const AdminPage = () => {
  const [totals, setTotals] = useState({
    students: 0,
    teachers: 0,
    parents: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const students = await getAllStudents();
        const teachers = await getAllTeachers();
        const parents = await getAllParent();

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

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row font-poppins">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        {/* USER CARDS */}
        <div className="flex space-x-4">
          <UserCard type="student" count={totals.students} />
          <UserCard type="teacher" count={totals.teachers} />
          <UserCard type="parent" count={totals.parents} />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 ">
            <CountChart />
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>

        {/* BOTTOM CHARTS */}
        <div className="w-full mt-[-20px]">
          <FinanceChart />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4  ">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
