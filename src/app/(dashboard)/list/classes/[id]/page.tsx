/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getClassById } from "@/services/classServices";
import Announcements from "@/components/Announcements";
import { FaChalkboardTeacher } from "react-icons/fa";
import {  Mail, Phone, Users } from "lucide-react";

const SingleClassPage = () => {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showStudents, setShowStudents] = useState(false); // Added state for toggling student list visibility

  const toggleStudents = () => setShowStudents(!showStudents); // Function to toggle student visibility

  useEffect(() => {
    if (id) {
      getClassById(id as string)
        .then((data) => {
          setClassData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch class details:", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading)
    return (
      <p className="text-center text-gray-700">Loading class details...</p>
    );

  if (!classData)
    return <p className="text-center text-red-500">No class data available.</p>;

  return (
    <div className="p-6 space-y-6">
      {/* CLASS INFO SECTION */}
      <div className="bg-blue-100 shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* LEFT: CLASS DETAILS */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {classData.name}
          </h1>
          <p className="text-gray-600">
            {classData.description || "No description available."}
          </p>

          {/* CLASS INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
            {/* Supervisor Info */}
            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-3">
              <FaChalkboardTeacher className="text-blue-600 text-lg" />
              <div>
                <p className="text-gray-700">Teacher In-charge:</p>
                <p className="text-gray-900 font-semibold">
                  {classData.supervisor?.name || "No supervisor"}
                </p>
              </div>
            </div>

            {/* Supervisor Contact */}
            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-3">
              <Phone className="text-green-600 text-lg" />
              <div>
                <p className="text-gray-700">Teacher Phone:</p>
                <p className="text-gray-900 font-semibold">
                  {classData.supervisor?.phone || "N/A"}
                </p>
              </div>
            </div>

            {/* Supervisor Email */}
            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-3">
              <Mail className="text-red-600 text-lg" />
              <div>
                <p className="text-gray-700">Teacher Email:</p>
                <p className="text-gray-900 font-semibold">
                  {classData.supervisor?.email || "N/A"}
                </p>
              </div>
            </div>

            {/* Total Students */}
            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-3">
              <Users className="text-purple-600 text-lg" />
              <div>
                <p className="text-gray-700">Total Students:</p>
                <p className="text-gray-900 font-semibold">
                  {classData.students?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SHORTCUTS SECTION */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800">Shortcuts</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Class Teacher Link */}
          <Link
            className="p-4 rounded-lg bg-pink-200 hover:bg-pink-300 transition flex flex-col justify-between"
            href={`/list/teachers/${classData.supervisor?.id}`}
          >
            <span>Class Teacher</span>
          </Link>

          {/* Show/Hide Students Section */}
          <div className="mb-4 flex flex-col p-4 rounded-lg bg-pink-200 hover:bg-pink-300 transition ">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold">Class Students</h1>
              <button
                onClick={toggleStudents}
                className="text-blue-500 hover:text-blue-700 font-semibold"
              >
                {showStudents ? "− Hide Students" : "+ Show Students"}
              </button>
            </div>

            {showStudents && classData.students.length > 0 ? (
              // eslint-disable-next-line react/jsx-no-comment-textnodes
              <ul className="space-y-2 overflow-y-auto max-h-[130px]">
             
                {classData.students.map((student: any) => (
                  <li key={student.id}>
                    <Link
                      href={`/list/students/${student.id}`}
                      className="block p-2 rounded-lg bg-yellow-200 hover:bg-yellow-300 transition"
                    >
                      {student.name} {student.surname}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              !showStudents && (
                <p className="text-gray-500">
                  {classData.students.length > 0
                    ? `${classData.students.length} students enrolled`
                    : "No students enrolled"}
                </p>
              )
            )}
          </div>

          {/* Class Parent Link */}
          <Link
            className="p-4 rounded-lg bg-purple-200 hover:bg-purple-300 transition flex flex-col justify-between"
            href={`/list/parents/${classData.supervisor?.id}`}
          >
            <span>Class Parent</span>
          </Link>
        </div>
      </div>

      {/* ANNOUNCEMENTS SECTION */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Class Announcements
        </h2>
        <Announcements />
      </div>
    </div>
  );
};

export default SingleClassPage;
