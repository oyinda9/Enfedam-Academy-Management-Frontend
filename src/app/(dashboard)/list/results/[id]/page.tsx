"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAllCummulativeResultForOneStudent, getAllCummulativeResult } from "@/services/examServices"; // Make sure this service fetches all students' results
import { ArrowLeft } from "lucide-react";

const StudentResultDetailsPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const [resultData, setResultData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studentPosition, setStudentPosition] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch the student's cumulative results
      getAllCummulativeResultForOneStudent(id)
        .then((data) => {
          setResultData(data);
        })
        .catch((err) => {
          console.error("Failed to load result:", err);
        })
        .finally(() => setLoading(false));

      // Fetch all students' results to calculate position
      getAllCummulativeResult() // Ensure this function fetches all student results
        .then((students) => {
          // Sort the students by their average score in descending order
          const sortedStudents = students.sort((a: any, b: any) => b.averageScore - a.averageScore);
          
          // Find the position of the current student
          const position = sortedStudents.findIndex((student: any) => student.studentId === id);
          
          if (position !== -1) {
            setStudentPosition(position + 1); // Rank starts from 1
          }
        })
        .catch((err) => {
          console.error("Failed to fetch all students' results:", err);
        });
    }
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!resultData) return <p className="p-6">No result data found.</p>;

  return (
    <div className="p-6">
      <Link href="/list/results">
        <button className="flex items-center rounded bg-blue-300 px-4 py-2 text-white p-4 mb-6 hover:bg-blue-500 transition-colors duration-300">
          <ArrowLeft className="mr-2" /> {/* Icon with margin to the right */}
          Back
        </button>
      </Link>
      <h2 className="text-2xl font-bold mb-4">
        {resultData.studentName + "'s Results"}
      </h2>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <p>
          <strong>Total Assignment:</strong> {resultData.totalAssignment}
        </p>
        <p>
          <strong>Total Classwork:</strong> {resultData.totalClasswork}
        </p>
        <p>
          <strong>Total Midterm:</strong> {resultData.totalMidterm}
        </p>
        <p>
          <strong>Total Attendance:</strong> {resultData.totalAttendance}
        </p>
        <p>
          <strong>Total Exam:</strong> {resultData.totalExam}
        </p>
        <p>
          <strong>Total Subjects:</strong> {resultData.totalSubjects}
        </p>
        <p>
          <strong>Overall Total:</strong> {resultData.overallTotal}
        </p>
        <p>
          <strong>Average Score:</strong> {resultData.averageScore}
        </p>
        {studentPosition !== null && (
          <p>
            <strong>Position:</strong> {studentPosition +"th"}
          </p>
        )}
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">Subject Breakdown</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Subject</th>
              <th className="px-4 py-2 text-left">Assignment</th>
              <th className="px-4 py-2 text-left">Classwork</th>
              <th className="px-4 py-2 text-left">Midterm</th>
              <th className="px-4 py-2 text-left">Attendance</th>
              <th className="px-4 py-2 text-left">Exam</th>
              <th className="px-4 py-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {resultData.subjectDetails.map((subject: any, index: number) => (
              <tr
                key={`${subject.subjectId || "fallback"}-${index}`}
                className="border-t"
              >
                <td className="px-4 py-2">{subject.subjectName}</td>
                <td className="px-4 py-2">{subject.assignment}</td>
                <td className="px-4 py-2">{subject.classwork}</td>
                <td className="px-4 py-2">{subject.midterm}</td>
                <td className="px-4 py-2">{subject.attendance}</td>
                <td className="px-4 py-2">{subject.examScore}</td>
                <td className="px-4 py-2 font-medium">{subject.total}/100</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentResultDetailsPage;
