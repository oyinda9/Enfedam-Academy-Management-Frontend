"use client";
import React, { useState, useEffect } from "react";
// import Announcements from "@/components/Announcements";
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
      <div className="w-full lg:w-2/3 flex flex-col gap-12">
        {/* USER CARDS */}
        <div className="flex flex-wrap justify-center sm:justify-between gap-4">
          <UserCard type="student" count={totals.students} />
          <UserCard type="teacher" count={totals.teachers} />
          <UserCard type="parent" count={totals.parents} />

        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>

        {/* BOTTOM CHARTS */}
        <div className="w-full h-[550px] mt-[-20px]">
          <FinanceChart />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8  ">
        <EventCalendar />
        {/* <Announcements /> */}
      </div>
    </div>
  );
};

export default AdminPage;
