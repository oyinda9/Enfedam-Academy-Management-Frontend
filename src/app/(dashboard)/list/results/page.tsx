"use client"
import { useEffect, useState } from "react"
import { createResult, getAllCummulativeResult } from "@/services/examServices"
import { getAllclass, getClassById } from "@/services/classServices"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Link from "next/link"
import { getStudentById } from "@/services/studentService"
import {
  BookOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  Save,
  Eye,
  CheckCircle,
  AlertCircle,
  BarChart3,
  User,
  GraduationCap,
  Plus,
  FileText,
} from "lucide-react"

interface Student {
  id: string
  name: string
  surname: string
  subjects: Subject[]
}

interface Subject {
  id: number
  name: string
  maxScore: number
}

interface ResultData {
  subjectId: number
  subjectName: string
  examScore: number
  assignment: number
  classwork: number
  midterm: number
  attendance: number
  total: number
}

interface CumulativeResult {
  studentId: string
  studentName: string
  studentSurname: string
  subjectCount: number
  totals: {
    exam: number
    assignment: number
    classwork: number
    midterm: number
    attendance: number
  }
  overallTotal: number
}

export default function ResponsiveResultUpload() {
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClassId, setSelectedClassId] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0)
  const [completedStudents, setCompletedStudents] = useState<string[]>([])
  const [scores, setScores] = useState<Record<number, ResultData>>({})
  const [allResults, setAllResults] = useState<CumulativeResult[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"form" | "results">("form")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [selectedResultsClassId, setSelectedResultsClassId] = useState("")

  const [loading, setLoading] = useState({
    classLoading: false,
    studentLoading: false,
    submitting: false,
    resultsLoading: false,
  })

  // Initialize user data with better error handling
  useEffect(() => {
    if (typeof window !== "undefined" && !hasInitialized) {
      try {
        const role = localStorage.getItem("role")
        const userStr = localStorage.getItem("user")
        const userId = localStorage.getItem("userId")
        const childUserId = localStorage.getItem("childUserId")

        let user = null
        if (userStr) {
          try {
            user = JSON.parse(userStr)
          } catch (e) {
            console.warn("Could not parse user data, using defaults")
          }
        }

        setUserRole(role || "")
        setCurrentUser({ ...user, userId, childUserId })

        if (role === "USER" || role === "STUDENT") {
          setViewMode("results")
        } else {
          setViewMode("form")
        }

        setHasInitialized(true)
      } catch (error) {
        console.error("Error initializing user data:", error)
        setHasInitialized(true)
      }
    }
  }, [hasInitialized])

  // Load results only when needed and user is initialized
  useEffect(() => {
    if (hasInitialized && (userRole === "USER" || userRole === "STUDENT")) {
      loadAllResults()
    }
  }, [hasInitialized, userRole])

  // Fetch classes with improved error handling
  useEffect(() => {
    const fetchClasses = async () => {
      if (!hasInitialized) return

      setLoading((prev) => ({ ...prev, classLoading: true }))
      try {
        const data = await getAllclass()

        if (!data || !Array.isArray(data)) {
          console.warn("Invalid classes data received")
          setClasses([])
          return
        }

        const role = localStorage.getItem("role")
        const userId = localStorage.getItem("userId")
        const childUserId = localStorage.getItem("childUserId")

        let filteredClasses = data

        if (role === "STUDENT" && userId) {
          filteredClasses = data.filter((cls) => cls?.studentIds?.includes(userId))
        } else if (role === "USER" && childUserId) {
          filteredClasses = data.filter((cls) => cls?.studentIds?.includes(childUserId))
        }

        setClasses(filteredClasses)
      } catch (error) {
        console.error("Error fetching classes:", error)
        // Only show error if it's a real network/API error, not initialization issues
        if (hasInitialized && userRole) {
          toast.error("Failed to load classes")
        }
        setClasses([])
      } finally {
        setLoading((prev) => ({ ...prev, classLoading: false }))
      }
    }

    if (hasInitialized) {
      fetchClasses()
    }
  }, [hasInitialized, userRole])

  // Load results with better error handling
  const loadAllResults = async (roleFromLocal?: string, classId?: string) => {
    if (!hasInitialized) return

    setLoading((prev) => ({ ...prev, resultsLoading: true }))
    try {
      const results = await getAllCummulativeResult()

      if (!results || !Array.isArray(results)) {
        setAllResults([])
        return
      }

      const role = roleFromLocal || userRole || localStorage.getItem("role")
      const userId = localStorage.getItem("userId")
      const childUserId = localStorage.getItem("childUserId")

      let filteredResults = results

      // Filter by role first
      if (role === "USER" && childUserId) {
        filteredResults = results.filter((result) => result.studentId === childUserId)
      } else if (role === "STUDENT" && userId) {
        filteredResults = results.filter((result) => result.studentId === userId)
      }

      // Then filter by class if classId is provided
      if (classId && students.length > 0) {
        const classStudentIds = students.map((student) => student.id)
        filteredResults = filteredResults.filter((result) => classStudentIds.includes(result.studentId))
      }

      setAllResults(filteredResults)
    } catch (error) {
      console.error("Error loading results:", error)
      // Only show error for actual API failures, not empty results
      if (error?.response?.status && error.response.status !== 404) {
        toast.error("Failed to load results")
      }
      setAllResults([])
    } finally {
      setLoading((prev) => ({ ...prev, resultsLoading: false }))
    }
  }

  // Load students with better error handling and subject loading
  const loadStudents = async (classId: string) => {
    if (!classId) return

    setSelectedClassId(classId)
    setLoading((prev) => ({ ...prev, studentLoading: true }))

    try {
      console.log("Loading class data for classId:", classId)
      const classData = await getClassById(classId)
      console.log("Class data received:", classData)

      if (!classData?.students || !Array.isArray(classData.students)) {
        console.warn("No students found in class data:", classData)
        setStudents([])
        return
      }

      console.log("Found students:", classData.students.length)

      const studentsWithSubjects = await Promise.all(
        classData.students.map(async (student: any) => {
          try {
            console.log(`Loading subjects for student ${student.id} (${student.name})`)
            const studentData = await getStudentById(student.id)
            console.log(`Student data for ${student.name}:`, studentData)

            // Handle the correct API response structure
            let subjects = []

            if (studentData?.Subject && Array.isArray(studentData.Subject)) {
              subjects = studentData.Subject
            } else if (studentData?.subjects && Array.isArray(studentData.subjects)) {
              subjects = studentData.subjects
            } else if (studentData?.subject && Array.isArray(studentData.subject)) {
              subjects = studentData.subject
            } else {
              console.warn(
                `No subjects found for student ${student.name}. Available keys:`,
                Object.keys(studentData || {}),
              )
            }

            const formattedSubjects = subjects.map((subj: any) => ({
              id: subj.id,
              name: subj.name,
              maxScore: 100,
            }))

            console.log(`Formatted subjects for ${student.name}:`, formattedSubjects)

            return {
              ...student,
              subjects: formattedSubjects,
            }
          } catch (error) {
            console.error(`Error loading subjects for student ${student.id} (${student.name}):`, error)
            return {
              ...student,
              subjects: [],
            }
          }
        }),
      )

      console.log("Final students with subjects:", studentsWithSubjects)
      setStudents(studentsWithSubjects)
      setCurrentStudentIndex(0)
      setCompletedStudents([])
      setScores({})

      // Only load results if we're in results view mode
      if (viewMode === "results") {
        loadAllResults()
      }
    } catch (error) {
      console.error("Error loading students:", error)
      toast.error("Failed to load students")
      setStudents([])
    } finally {
      setLoading((prev) => ({ ...prev, studentLoading: false }))
    }
  }

  // Handle score changes
  const handleScoreChange = (subjectId: number, field: keyof ResultData, value: string) => {
    const numericValue = Math.min(100, Math.max(0, Number(value) || 0))

    setScores((prev) => {
      const current = prev[subjectId] || {
        subjectId,
        subjectName: students[currentStudentIndex]?.subjects?.find((s) => s.id === subjectId)?.name || "",
        examScore: 0,
        assignment: 0,
        classwork: 0,
        midterm: 0,
        attendance: 0,
        total: 0,
      }

      const updated = {
        ...current,
        [field]: numericValue,
        total: calculateTotal({ ...current, [field]: numericValue }),
      }

      return {
        ...prev,
        [subjectId]: updated,
      }
    })
  }

  // Calculate total score
  const calculateTotal = (result: Omit<ResultData, "total">) => {
    return result.examScore + result.assignment + result.classwork + result.midterm + result.attendance
  }

  // Submit results
  const submitCurrentStudent = async () => {
    const student = students[currentStudentIndex]
    if (!student) return

    setLoading((prev) => ({ ...prev, submitting: true }))

    try {
      const hasMissingScores = student.subjects?.some((subj) => !scores[subj.id])
      if (hasMissingScores) {
        toast.warning("Please enter scores for all subjects")
        return
      }

      const hasInvalidTotals = student.subjects?.some((subj) => {
        const score = scores[subj.id]
        return !score || score.total !== 100
      })

      if (hasInvalidTotals) {
        toast.error("All subject totals must equal 100")
        return
      }

      const submissions = student.subjects?.map((subj) => {
        const { subjectId, subjectName, total, ...resultData } = scores[subj.id]
        return createResult({
          studentId: student.id,
          subjectId,
          ...resultData,
        })
      })

      await Promise.all(submissions || [])

      setCompletedStudents((prev) => [...prev, student.id])
      setCurrentStudentIndex((prev) => prev + 1)
      setScores({})
      toast.success(`Results saved for ${student.name}`)

      if (viewMode === "results") {
        loadAllResults()
      }
    } catch (error) {
      console.error("Error submitting results:", error)
      toast.error("Failed to save results")
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }))
    }
  }

  // Navigation
  const navigateStudent = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? Math.max(0, currentStudentIndex - 1)
        : Math.min(students.length - 1, currentStudentIndex + 1)
    setCurrentStudentIndex(newIndex)
    setScores({})
  }

  const currentStudent = students[currentStudentIndex]
  const totalStudents = students.length
  const remaining = totalStudents - completedStudents.length
  const progress = totalStudents > 0 ? Math.round((completedStudents.length / totalStudents) * 100) : 0

  const isFormMode = viewMode === "form" && userRole !== "USER" && userRole !== "STUDENT"

  // Don't render until initialized
  if (!hasInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const loadResultsForClass = async (classId: string) => {
    if (!classId) {
      setSelectedResultsClassId("")
      setAllResults([])
      return
    }

    setSelectedResultsClassId(classId)

    // First load students for the class
    try {
      const classData = await getClassById(classId)
      if (classData?.students && Array.isArray(classData.students)) {
        setStudents(classData.students)
        // Then load results for those students
        loadAllResults(userRole, classId)
      }
    } catch (error) {
      console.error("Error loading class for results:", error)
      toast.error("Failed to load class data")
    }
  }

  return (
    <>
      {/* Desktop View - Completely Redesigned */}
      <div className="hidden lg:block min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          {/* Clean Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {userRole === "USER" || userRole === "STUDENT" ? "Academic Results" : "Results Management"}
            </h1>
            <p className="text-gray-600">
              {userRole === "USER"
                ? "View your child's academic performance"
                : userRole === "STUDENT"
                  ? "View your academic performance"
                  : "Manage student academic results"}
            </p>
          </div>

          {/* Mode Toggle for Teachers/Admins */}
          {userRole !== "USER" && userRole !== "STUDENT" && (
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-xl p-1 shadow-sm border">
                <button
                  onClick={() => setViewMode("form")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    viewMode === "form"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Plus size={18} className="inline mr-2" />
                  Enter Results
                </button>
                <button
                  onClick={() => {
                    setViewMode("results")
                    setSelectedResultsClassId("")
                    setAllResults([])
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    viewMode === "results"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <FileText size={18} className="inline mr-2" />
                  View Results
                </button>
              </div>
            </div>
          )}

          {isFormMode ? (
            <div className="max-w-4xl mx-auto">
              {/* Class Selection Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Select Class</h2>
                <select
                  value={selectedClassId}
                  onChange={(e) => loadStudents(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  disabled={loading.classLoading}
                >
                  <option value="">Choose a class to begin...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Progress Card */}
              {students.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Progress Overview</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      {completedStudents.length} of {totalStudents} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{progress}% Complete</span>
                    <span>{remaining} students remaining</span>
                  </div>
                </div>
              )}

              {/* Student Form */}
              {currentStudent ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Student Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <User size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">
                            {currentStudent.name} {currentStudent.surname}
                          </h2>
                          <p className="text-blue-100">
                            Student {currentStudentIndex + 1} of {totalStudents}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigateStudent("prev")}
                          disabled={currentStudentIndex === 0 || loading.submitting}
                          className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 disabled:opacity-50 transition-all"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() => navigateStudent("next")}
                          disabled={currentStudentIndex === students.length - 1 || loading.submitting}
                          className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 disabled:opacity-50 transition-all"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Debug info - remove this after fixing */}
                  {/*{process.env.NODE_ENV === "development" && currentStudent && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Debug Info:</h4>
                      <p className="text-sm text-yellow-700">
                        Student: {currentStudent.name} {currentStudent.surname}
                      </p>
                      <p className="text-sm text-yellow-700">Subjects found: {currentStudent.subjects?.length || 0}</p>
                      {currentStudent.subjects?.length > 0 && (
                        <div className="text-sm text-yellow-700">
                          Subject names: {currentStudent.subjects.map((s) => s.name).join(", ")}
                        </div>
                      )}
                    </div>
                  )}*/}

                  {/* Enhanced subject rendering with better debugging */}
                  {currentStudent?.subjects?.length > 0 ? (
                    <div className="space-y-6">
                      {currentStudent.subjects.map((subject) => {
                        console.log("Rendering subject:", subject)
                        const score = scores[subject.id] || {
                          subjectId: subject.id,
                          subjectName: subject.name,
                          examScore: 0,
                          assignment: 0,
                          classwork: 0,
                          midterm: 0,
                          attendance: 0,
                          total: 0,
                        }
                        const isTotalValid = score.total === 100

                        return (
                          <div key={subject.id} className="border border-gray-200 rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                              <BookOpen size={20} className="text-purple-600 mr-2" />
                              {subject.name}
                            </h3>

                            <div className="grid grid-cols-5 gap-4 mb-4">
                              {["examScore", "assignment", "classwork", "midterm", "attendance"].map((field) => (
                                <div key={field}>
                                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                    {field === "examScore" ? "Exam" : field}
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={score[field as keyof ResultData] || ""}
                                    onChange={(e) =>
                                      handleScoreChange(subject.id, field as keyof ResultData, e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-medium"
                                    placeholder="0"
                                  />
                                </div>
                              ))}
                            </div>

                            <div
                              className={`p-4 rounded-lg border-2 ${
                                isTotalValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  {isTotalValid ? (
                                    <CheckCircle size={20} className="text-green-600 mr-2" />
                                  ) : (
                                    <AlertCircle size={20} className="text-red-600 mr-2" />
                                  )}
                                  <span className="font-medium">Total Score</span>
                                </div>
                                <div className="text-right">
                                  <span
                                    className={`text-2xl font-bold ${isTotalValid ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {score.total}/100
                                  </span>
                                  {!isTotalValid && <div className="text-sm text-red-600">Must equal 100</div>}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}

                      <div className="flex justify-center pt-6">
                        <button
                          onClick={submitCurrentStudent}
                          disabled={loading.submitting}
                          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-lg"
                        >
                          {loading.submitting ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                              <span>Saving Results...</span>
                            </>
                          ) : (
                            <>
                              <Save size={20} />
                              <span>Save Results for {currentStudent.name}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Subjects Found</h3>
                      <p className="text-gray-500">This student has no registered subjects.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  {loading.studentLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading students...</p>
                    </>
                  ) : selectedClassId ? (
                    <>
                      <Users size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
                      <p className="text-gray-500">This class has no registered students.</p>
                    </>
                  ) : (
                    <>
                      <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Class</h3>
                      <p className="text-gray-500">Choose a class from the dropdown above to begin entering results.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Results View */
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold flex items-center">
                  <BarChart3 size={24} className="text-blue-600 mr-2" />
                  {userRole === "USER"
                    ? "Your Child's Academic Results"
                    : userRole === "STUDENT"
                      ? "Your Academic Results"
                      : "All Student Results"}
                </h2>
              </div>
              <div className="p-6">
                {/* Class Selection for Results */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">Select Class to View Results</h2>
                  <select
                    value={selectedResultsClassId}
                    onChange={(e) => loadResultsForClass(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    disabled={loading.classLoading}
                  >
                    <option value="">Choose a class to view results...</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedResultsClassId ? (
                  loading.resultsLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                  ) : allResults.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Student</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Subjects</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Exam</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Assignment</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Classwork</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Midterm</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Attendance</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                            {userRole !== "USER" && userRole !== "STUDENT" && (
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {allResults.map((result) => (
                            <tr key={result.studentId} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-4 font-medium">
                                {result.studentName} {result.studentSurname}
                              </td>
                              <td className="py-4 px-4 text-gray-600">{result.subjectCount}</td>
                              <td className="py-4 px-4">{result.totals.exam}</td>
                              <td className="py-4 px-4">{result.totals.assignment}</td>
                              <td className="py-4 px-4">{result.totals.classwork}</td>
                              <td className="py-4 px-4">{result.totals.midterm}</td>
                              <td className="py-4 px-4">{result.totals.attendance}</td>
                              <td className="py-4 px-4 font-bold text-blue-600 text-lg">{result.overallTotal}</td>
                              {userRole !== "USER" && userRole !== "STUDENT" && (
                                <td className="py-4 px-4">
                                  <Link
                                    href={`/list/results/${result.studentId}`}
                                    className="text-blue-600 hover:text-blue-800 flex items-center font-medium"
                                  >
                                    <Eye size={16} className="mr-1" />
                                    View Details
                                  </Link>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                      <p className="text-gray-500">No results have been recorded for this class yet.</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Class</h3>
                    <p className="text-gray-500">Choose a class from the dropdown above to view results.</p>
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

      {/* Mobile View - Keep existing mobile implementation */}
      <div className="lg:hidden bg-gray-50 min-h-screen">
        <ToastContainer position="top-center" />

        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 size={20} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {userRole === "USER" || userRole === "STUDENT" ? "Results" : "Results Management"}
                </h1>
                <p className="text-sm text-gray-600">
                  {userRole === "USER"
                    ? "Your child's performance"
                    : userRole === "STUDENT"
                      ? "Your academic performance"
                      : "Manage student results"}
                </p>
              </div>
            </div>

            {/* Mobile Toggle */}
            {userRole !== "USER" && userRole !== "STUDENT" && (
              <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                <button
                  onClick={() => setViewMode("form")}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "form" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
                  }`}
                >
                  Entry Form
                </button>
                <button
                  onClick={() => {
                    setViewMode("results")
                    setSelectedResultsClassId("")
                    setAllResults([])
                  }}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "results" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
                  }`}
                >
                  View Results
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          {isFormMode ? (
            <div className="space-y-4">
              {/* Class Selection */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => loadStudents(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  disabled={loading.classLoading}
                >
                  <option value="">Choose a class...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Progress Card */}
              {students.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-900">Progress</h3>
                    <span className="text-sm font-medium text-blue-600">
                      {completedStudents.length}/{totalStudents}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{progress}% complete</p>
                </div>
              )}

              {/* Student Navigation */}
              {currentStudent && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {currentStudent.name} {currentStudent.surname}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Student {currentStudentIndex + 1} of {totalStudents}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigateStudent("prev")}
                      disabled={currentStudentIndex === 0 || loading.submitting}
                      className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition flex items-center justify-center gap-1 text-sm"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>
                    <button
                      onClick={() => navigateStudent("next")}
                      disabled={currentStudentIndex === students.length - 1 || loading.submitting}
                      className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition flex items-center justify-center gap-1 text-sm"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Enhanced subject rendering with better debugging */}
              {currentStudent?.subjects?.map((subject) => {
                console.log("Rendering subject:", subject)
                const score = scores[subject.id] || {
                  subjectId: subject.id,
                  subjectName: subject.name,
                  examScore: 0,
                  assignment: 0,
                  classwork: 0,
                  midterm: 0,
                  attendance: 0,
                  total: 0,
                }
                const isTotalValid = score.total === 100

                return (
                  <div key={subject.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen size={16} className="text-purple-600" />
                      {subject.name}
                    </h3>

                    <div className="space-y-3">
                      {["examScore", "assignment", "classwork", "midterm", "attendance"].map((field) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                            {field === "examScore" ? "Exam" : field}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={score[field as keyof ResultData] || ""}
                            onChange={(e) => handleScoreChange(subject.id, field as keyof ResultData, e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>

                    <div
                      className={`mt-4 p-3 rounded-lg ${
                        isTotalValid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium flex items-center gap-2">
                          {isTotalValid ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <AlertCircle size={16} className="text-red-600" />
                          )}
                          Total Score
                        </span>
                        <div className="text-right">
                          <span className={`font-bold text-lg ${isTotalValid ? "text-green-600" : "text-red-600"}`}>
                            {score.total}/100
                          </span>
                          {!isTotalValid && <div className="text-xs text-red-500">Must equal 100</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Submit Button */}
              {currentStudent?.subjects?.length > 0 && (
                <div className="pb-6">
                  <button
                    onClick={submitCurrentStudent}
                    disabled={loading.submitting}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                  >
                    {loading.submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Results
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Loading/Empty States */}
              {loading.studentLoading && (
                <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading students...</p>
                </div>
              )}

              {!currentStudent && !loading.studentLoading && selectedClassId && (
                <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-500">This class has no registered students.</p>
                </div>
              )}

              {!selectedClassId && (
                <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                  <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a class</h3>
                  <p className="text-gray-500">Choose a class to begin entering results.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Results Header */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 size={18} className="text-blue-600" />
                  {userRole === "USER"
                    ? "Your Child's Results"
                    : userRole === "STUDENT"
                      ? "Your Results"
                      : "All Results"}
                </h2>
              </div>

              {/* Class Selection for Results */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Select Class to View Results</h2>
                <select
                  value={selectedResultsClassId}
                  onChange={(e) => loadResultsForClass(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  disabled={loading.classLoading}
                >
                  <option value="">Choose a class to view results...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results List */}
              {selectedResultsClassId ? (
                loading.resultsLoading ? (
                  <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading results...</p>
                  </div>
                ) : allResults.length > 0 ? (
                  <div className="space-y-3">
                    {allResults.map((result) => (
                      <div key={result.studentId} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {result.studentName} {result.studentSurname}
                            </h3>
                            <p className="text-sm text-gray-600">{result.subjectCount} subjects</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">{result.overallTotal}</div>
                            <div className="text-xs text-gray-500">Total Score</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Exam:</span>
                            <span className="font-medium">{result.totals.exam}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Assignment:</span>
                            <span className="font-medium">{result.totals.assignment}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Classwork:</span>
                            <span className="font-medium">{result.totals.classwork}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Midterm:</span>
                            <span className="font-medium">{result.totals.midterm}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Attendance:</span>
                            <span className="font-medium">{result.totals.attendance}</span>
                          </div>
                        </div>

                        {userRole !== "USER" && userRole !== "STUDENT" && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <Link
                              href={`/list/results/${result.studentId}`}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-1 text-sm"
                            >
                              <Eye size={14} />
                              View Detailed Results
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                    <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500">
                      {userRole === "USER"
                        ? "No results available for your child yet"
                        : userRole === "STUDENT"
                          ? "No results available yet"
                          : "No results have been recorded yet"}
                    </p>
                  </div>
                )
              ) : (
                <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                  <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a class</h3>
                  <p className="text-gray-500">Choose a class to view results.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
