/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getParentById } from "@/services/parentService";
import Announcements from "@/components/Announcements";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Mail, Phone, Users, MapPinHouse } from "lucide-react";

const SingleClassPage = () => {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ParentData, setParent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showStudents, setShowStudents] = useState(false);

  const toggleStudents = () => setShowStudents(!showStudents); // Toggle student visibility

  useEffect(() => {
    if (id) {
      getParentById(id as string)
        .then((data) => {
          setParent(data);
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
      <p className="text-center text-gray-700">Loading parent details...</p>
    );

  if (!ParentData)
    return (
      <p className="text-center text-red-500">No parent data available.</p>
    );

  return (
    <div className="p-6 space-y-6">
      {/* CLASS INFO SECTION */}
      <div className="bg-blue-100 shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-semibold text-gray-800">
          Parent Details
          </h1>
          <p className="text-gray-600">
            {ParentData.description || "No description available."}
          </p>

          {/* CLASS INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-3">
              <FaChalkboardTeacher className="text-blue-600 text-lg" />
              <div>
                <p className="text-gray-700">Parent:</p>
                <p className="text-gray-900 font-semibold">
                  {ParentData.name} {ParentData.surname}
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-3">
              <Phone className="text-green-600 text-lg" />
              <div>
                <p className="text-gray-700">Parent Phone:</p>
                <p className="text-gray-900 font-semibold">
                  {ParentData?.phone || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-3">
              <Mail className="text-red-600 text-lg" />
              <div>
                <p className="text-gray-700">Parent Email:</p>
                <p className="text-gray-900 font-semibold">
                  {ParentData?.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-3">
              <MapPinHouse className="text-yellow-600 text-lg" />
              <div>
                <p className="text-gray-700">Parent Address:</p>
                <p className="text-gray-900 font-semibold">
                  {ParentData?.address || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-4 flex items-center gap-3">
              <Users className="text-purple-600 text-lg" />
              <div>
                <p className="text-gray-700">Total Number of Children:</p>
                <p className="text-gray-900 font-semibold">
                  {ParentData.students?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Toggle Button for Showing Students */}
          <button
            onClick={toggleStudents}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {showStudents ? "Hide Students" : "Show Students"}
          </button>

          {/* Conditional Rendering of Students */}
          {showStudents && (
            <div className="mt-4 bg-white shadow-lg rounded-lg p-4">
              <h3 className="text-lg font-semibold">Student List</h3>
              <ul className="list-disc ml-6">
                {ParentData.students?.map((student: any) => (
                  <li key={student.id} className="text-gray-700">
                    {student.name} {student.surname}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ANNOUNCEMENTS SECTION */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <Announcements />
      </div>
    </div>
  );
};

export default SingleClassPage;
