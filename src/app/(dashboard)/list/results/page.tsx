"use client";
import React, { useEffect, useState } from "react";
import { createResult, getAllCummulativeResult } from "@/services/examServices";
import { getAllclass, getClassById } from "@/services/classServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { getStudentById } from "@/services/studentService";

interface Student {
  id: string;
  name: string;
  surname: string;
  subjects: Subject[];
}

interface Subject {
  id: number;
  name: string;
  maxScore: number;
}

interface ResultData {
  subjectId: number;
  subjectName: string;
  examScore: number;
  assignment: number;
  classwork: number;
  midterm: number;
  attendance: number;
  total: number;
}

interface CumulativeResult {
  studentId: string;
  studentName: string;
  studentSurname: string;
  subjectCount: number;
  totals: {
    exam: number;
    assignment: number;
    classwork: number;
    midterm: number;
    attendance: number;
  };
  overallTotal: number;
}

export default function ModernResultUpload() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [completedStudents, setCompletedStudents] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<number, ResultData>>({});
  const [allResults, setAllResults] = useState<CumulativeResult[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<
    "form" | "results" | "studentResults"
  >("form");

  const [loading, setLoading] = useState({
    classLoading: false,
    studentLoading: false,
    submitting: false,
    resultsLoading: false,
  });

  // Set user role and view mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      setUserRole(role || "");
      if (role === "USER") {
        setViewMode("results");
        loadAllResults(role); // load results for USER
      } else {
        setViewMode("form");
      }
    }
  }, []);

  // Fetch all classes depending on user role
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading((prev) => ({ ...prev, classLoading: true }));
      try {
        const data = await getAllclass();

        if (typeof window !== "undefined") {
          const role = localStorage.getItem("role");
          const userId = localStorage.getItem("userId");
          const childUserId = localStorage.getItem("childUserId");

          if (role === "STUDENT") {
            setClasses(
              data.filter((cls) => cls?.studentIds?.includes(userId ?? ""))
            );
          } else if (role === "USER") {
            setClasses(
              data.filter((cls) => cls?.studentIds?.includes(childUserId ?? ""))
            );
          } else {
            setClasses(data);
          }
        }
      } catch (error) {
        toast.error("Failed to load classes");
        console.error("Class load error:", error);
      } finally {
        setLoading((prev) => ({ ...prev, classLoading: false }));
      }
    };

    if (typeof window !== "undefined") {
      fetchClasses();
    }
  }, []);

  // Load all results, filtered by role
  const loadAllResults = async (roleFromLocal?: string) => {
    setLoading((prev) => ({ ...prev, resultsLoading: true }));
    try {
      const results = await getAllCummulativeResult();

      if (typeof window !== "undefined") {
        const role = roleFromLocal || localStorage.getItem("role");
        const childUserId = localStorage.getItem("childUserId");

        if (role === "USER") {
          setAllResults(
            results.filter((result) => result.studentId === childUserId)
          );
        } else {
          setAllResults(results);
        }
      }
    } catch (error) {
      toast.error("Failed to load results");
      console.error("Result load error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, resultsLoading: false }));
    }
  };

  // Load students when a class is selected
  const loadStudents = async (classId: string) => {
    setSelectedClassId(classId);
    setLoading((prev) => ({ ...prev, studentLoading: true }));

    try {
      const classData = await getClassById(classId);
      const studentsWithSubjects = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        classData?.students?.map(async (student: any) => {
          try {
            const studentData = await getStudentById(student.id);
            return {
              ...student,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              subjects:
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                studentData?.subject?.map((subj: any) => ({
                  id: subj.id,
                  name: subj.name,
                  maxScore: 100,
                })) || [],
            };
          } catch (error) {
            console.error(`Error loading student ${student.id}:`, error);
            return {
              ...student,
              subjects: [],
            };
          }
        }) || []
      );

      setStudents(studentsWithSubjects);
      setCurrentStudentIndex(0);
      setCompletedStudents([]);
      setScores({});
      loadAllResults();
    } catch (error) {
      toast.error("Failed to load students");
      console.error("Error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, studentLoading: false }));
    }
  };

  // Handle score changes with validation
  const handleScoreChange = (
    subjectId: number,
    field: keyof ResultData,
    value: number
  ) => {
    const numericValue = Math.min(100, Math.max(0, Number(value) || 0));

    setScores((prev) => {
      const current = prev[subjectId] || {
        subjectId,
        subjectName:
          students[currentStudentIndex]?.subjects?.find(
            (s) => s.id === subjectId
          )?.name || "",
        examScore: 0,
        assignment: 0,
        classwork: 0,
        midterm: 0,
        attendance: 0,
        total: 0,
      };

      const updated = {
        ...current,
        [field]: numericValue,
        total: calculateTotal({ ...current, [field]: numericValue }),
      };

      return {
        ...prev,
        [subjectId]: updated,
      };
    });
  };

  // Calculate total score
  const calculateTotal = (result: Omit<ResultData, "total">) => {
    return (
      result.examScore +
      result.assignment +
      result.classwork +
      result.midterm +
      result.attendance
    );
  };

  // Submit current student's results
  const submitCurrentStudent = async () => {
    const student = students[currentStudentIndex];
    if (!student) return;

    setLoading((prev) => ({ ...prev, submitting: true }));

    try {
      const hasMissingScores = student.subjects?.some(
        (subj) => !scores[subj.id]
      );
      if (hasMissingScores) {
        toast.warning("Please enter scores for all subjects");
        return;
      }

      await Promise.all(
        student.subjects?.map((subj) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { subjectId, subjectName, total, ...resultData } =
            scores[subj.id];
          return createResult({
            studentId: student.id,
            subjectId,
            ...resultData,
          });
        }) || []
      );

      setCompletedStudents((prev) => [...prev, student.id]);
      setCurrentStudentIndex((prev) => prev + 1);
      setScores({});
      toast.success(`Results saved for ${student.name}`);
      loadAllResults();
    } catch (error) {
      toast.error("Failed to save results");
      console.error("Error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Navigation between students
  const navigateStudent = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? Math.max(0, currentStudentIndex - 1)
        : Math.min(students.length - 1, currentStudentIndex + 1);
    setCurrentStudentIndex(newIndex);
    setScores({});
  };

  const currentStudent = students[currentStudentIndex];
  const totalStudents = students.length;
  const remaining = totalStudents - completedStudents.length;
  const progress =
    totalStudents > 0
      ? Math.round((completedStudents.length / totalStudents) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {userRole === "USER"
              ? "Student Results Portal"
              : "Student Results Portal"}
          </h1>
          <p className="text-gray-600 mt-2">
            {userRole === "USER"
              ? "View your child's academic performance"
              : "Efficient and accurate result management"}
          </p>
        </div>

        {/* Toggle between form and results view - hidden for USER role */}
        {userRole !== "USER" && (
          <div className="flex mb-4">
            <button
              onClick={() => setViewMode("form")}
              className={`px-4 py-2 rounded-l-lg ${
                viewMode === "form" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Entry Form
            </button>
            <button
              onClick={() => {
                setViewMode("results");
                loadAllResults();
              }}
              className={`px-4 py-2 rounded-r-lg ${
                viewMode === "results"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              View Results
            </button>
          </div>
        )}

        {viewMode === "form" && userRole !== "USER" ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Class Selection</h2>
              <select
                value={selectedClassId}
                onChange={(e) => loadStudents(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                disabled={loading.classLoading}
              >
                <option value="">Select a class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>

              {students.length > 0 && (
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">Progress</h3>
                    <span className="text-sm font-medium text-blue-600">
                      {completedStudents.length}/{totalStudents}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {progress}% complete
                  </p>

                  <div className="flex space-x-2 mt-6">
                    <button
                      onClick={() => navigateStudent("prev")}
                      disabled={currentStudentIndex === 0 || loading.submitting}
                      className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => navigateStudent("next")}
                      disabled={
                        currentStudentIndex === students.length - 1 ||
                        loading.submitting
                      }
                      className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {currentStudent ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Student Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {currentStudent.name} {currentStudent.surname}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Student {currentStudentIndex + 1} of {totalStudents}
                        </p>
                      </div>
                      <span className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-xs">
                        {remaining} remaining
                      </span>
                    </div>
                  </div>

                  {/* Subjects List */}
                  <div className="p-6">
                    {currentStudent.subjects?.length > 0 ? (
                      <div className="space-y-6">
                        {currentStudent.subjects.map((subject) => {
                          const score = scores[subject.id] || {
                            subjectId: subject.id,
                            subjectName: subject.name,
                            examScore: 0,
                            assignment: 0,
                            classwork: 0,
                            midterm: 0,
                            attendance: 0,
                            total: 0,
                          };
                          const isTotalValid = score.total === 100;

                          return (
                            <div
                              key={subject.id}
                              className="border border-gray-100 rounded-lg p-4 hover:shadow-xs transition"
                            >
                              <h3 className="font-medium text-gray-900 mb-3">
                                {subject.name}
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Exam
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={score.examScore || ""}
                                    onChange={(e) =>
                                      handleScoreChange(
                                        subject.id,
                                        "examScore",
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Assignment
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={score.assignment || ""}
                                    onChange={(e) =>
                                      handleScoreChange(
                                        subject.id,
                                        "assignment",
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Classwork
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={score.classwork || ""}
                                    onChange={(e) =>
                                      handleScoreChange(
                                        subject.id,
                                        "classwork",
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Midterm
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={score.midterm || ""}
                                    onChange={(e) =>
                                      handleScoreChange(
                                        subject.id,
                                        "midterm",
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Attendance
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={score.attendance || ""}
                                    onChange={(e) =>
                                      handleScoreChange(
                                        subject.id,
                                        "attendance",
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>

                              <div
                                className={`mt-3 flex justify-between items-center p-2 rounded-md ${
                                  isTotalValid ? "bg-green-50" : "bg-red-50"
                                }`}
                              >
                                <span className="text-sm font-medium">
                                  Total Score
                                </span>
                                <span
                                  className={`font-bold ${
                                    isTotalValid
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {score.total}/100
                                  {!isTotalValid && (
                                    <span className="text-xs block text-red-500">
                                      Must equal 100
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No subjects registered for this student
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={submitCurrentStudent}
                        disabled={
                          loading.submitting ||
                          currentStudent.subjects?.length === 0
                        }
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading.submitting ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          `Save ${currentStudent.name}'s Results`
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  {loading.studentLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                      <p className="text-gray-600">Loading student data...</p>
                    </div>
                  ) : selectedClassId ? (
                    <div className="py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">
                        No students found
                      </h3>
                      <p className="mt-1 text-gray-500">
                        This class has no registered students.
                      </p>
                    </div>
                  ) : (
                    <div className="py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                        />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">
                        Select a class
                      </h3>
                      <p className="mt-1 text-gray-500">
                        Choose a class to begin entering results.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {userRole === "USER"
                  ? "Your Child's Results"
                  : "All Recorded Results"}
              </h2>
            </div>
            <div className="p-6">
              {loading.resultsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : allResults.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subjects
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exam
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assignment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Classwork
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Midterm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        {userRole !== "USER" && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allResults.map((result) => (
                        <tr key={result.studentId}>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold">
                            {result.studentName} {result.studentSurname}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {result.subjectCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {result.totals.exam}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {result.totals.assignment}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {result.totals.classwork}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {result.totals.midterm}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {result.totals.attendance}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {result.overallTotal}
                          </td>
                          {userRole !== "USER" && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link
                                href={`/list/results/${result.studentId}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View All
                              </Link>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {userRole === "USER"
                    ? "No results available for your child"
                    : "No results recorded yet"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
