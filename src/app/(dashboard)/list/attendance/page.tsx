/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react"
import { getAllclass, getClassById } from "@/services/classServices"
import { createAttendance } from "@/services/attendanceServices"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { CheckCircle, XCircle, Calendar, UserCheck, ChevronDown, Send } from "lucide-react"

const ResponsiveAttendancePage = () => {
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClassId, setSelectedClassId] = useState("")
  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch all classes on load
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true)
      try {
        const data = await getAllclass()
        setClasses(data)
      } catch (err) {
        console.error("Error fetching classes:", err)
        toast.error("Failed to load classes")
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  // Fetch students when a class is selected
  useEffect(() => {
    const fetchClassStudents = async () => {
      if (selectedClassId) {
        setLoading(true)
        try {
          const classData = await getClassById(selectedClassId)
          const studentList = classData?.students || []
          setStudents(studentList)

          // Initialize attendance for students
          const defaultAttendance: Record<string, boolean> = {}
          studentList.forEach((student: any) => {
            defaultAttendance[student.id] = false // Default attendance as false (absent)
          })

          setAttendance(defaultAttendance)
        } catch (err) {
          console.error("Error fetching class students:", err)
          toast.error("Failed to load students")
        } finally {
          setLoading(false)
        }
      }
    }

    fetchClassStudents()
  }, [selectedClassId])

  // Toggle attendance for each student (Present/Absent)
  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }))
  }

  // Handle form submission to create attendance records
  const handleSubmit = async () => {
    setSubmitting(true)
    const loadingToast = toast.loading("Please wait... Recording Attendance", {
      position: "top-right",
      autoClose: false,
      closeButton: true,
      draggable: true,
      theme: "colored",
    })

    try {
      // Prepare the attendance data for each student
      const payload = Object.keys(attendance).map((studentId) => ({
        studentId: studentId,
        present: attendance[studentId],
      }))

      console.log("Sending attendance data:", payload)

      // Go through each student's data one by one
      for (const record of payload) {
        console.log("Sending attendance for student:", record)
        await createAttendance(record)
        console.log("Attendance sent for student:", record.studentId)
      }

      toast.dismiss(loadingToast)

      toast.success("Attendance submitted successfully.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
        style: {
          backgroundColor: "#4CAF50",
          color: "white",
          fontWeight: "bold",
        },
      })
    } catch (err: any) {
      console.error("Error submitting attendance:", err)
      toast.dismiss(loadingToast)
      toast.error("Error submitting attendance: " + (err?.message || "Please try again"))
    } finally {
      setSubmitting(false)
    }
  }

  // Get list of students marked as present
  const presentStudents = students.filter((student) => attendance[student.id])
  const absentStudents = students.filter((student) => !attendance[student.id])

  // Quick actions
  const markAllPresent = () => {
    const allPresent: Record<string, boolean> = {}
    students.forEach((student) => {
      allPresent[student.id] = true
    })
    setAttendance(allPresent)
  }

  const markAllAbsent = () => {
    const allAbsent: Record<string, boolean> = {}
    students.forEach((student) => {
      allAbsent[student.id] = false
    })
    setAttendance(allAbsent)
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block bg-white p-6 rounded-lg shadow-sm">
        <ToastContainer />

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Mark Attendance</h2>
            <p className="text-gray-600">Select a class and mark student attendance</p>
          </div>
        </div>

        {/* Class Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
          <div className="relative">
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={loading}
            >
              <option value="">Choose a class...</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={20}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {/* Students List */}
        {students.length > 0 && !loading && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quick Actions:</span>
                <button
                  onClick={markAllPresent}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                >
                  Mark All Present
                </button>
                <button
                  onClick={markAllAbsent}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                >
                  Mark All Absent
                </button>
              </div>
              <div className="text-sm text-gray-600">Total Students: {students.length}</div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-2 gap-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    attendance[student.id] ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                  }`}
                  onClick={() => toggleAttendance(student.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          attendance[student.id] ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {attendance[student.id] ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <XCircle size={16} className="text-red-600" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                    <span
                      className={`text-sm font-medium ${attendance[student.id] ? "text-green-600" : "text-red-600"}`}
                    >
                      {attendance[student.id] ? "Present" : "Absent"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck size={20} className="text-green-600" />
                  <h3 className="font-semibold text-green-800">Present ({presentStudents.length})</h3>
                </div>
                <div className="space-y-1">
                  {presentStudents.map((student) => (
                    <div key={student.id} className="text-sm text-green-700">
                      {student.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={20} className="text-red-600" />
                  <h3 className="font-semibold text-red-800">Absent ({absentStudents.length})</h3>
                </div>
                <div className="space-y-1">
                  {absentStudents.map((student) => (
                    <div key={student.id} className="text-sm text-red-700">
                      {student.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Attendance
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden bg-gray-50 min-h-screen">
        <ToastContainer position="top-center" />

        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Attendance</h1>
                <p className="text-sm text-gray-600">Mark student attendance</p>
              </div>
            </div>

            {/* Class Selection */}
            <div className="relative">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-base"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                disabled={loading}
              >
                <option value="">Choose a class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}

          {/* Students List */}
          {students.length > 0 && !loading && (
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">Quick Actions</span>
                  <span className="text-sm text-gray-600">{students.length} students</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={markAllPresent}
                    className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                  >
                    All Present
                  </button>
                  <button
                    onClick={markAllAbsent}
                    className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    All Absent
                  </button>
                </div>
              </div>

              {/* Students Cards */}
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${
                      attendance[student.id] ? "border-l-green-500" : "border-l-red-500"
                    }`}
                    onClick={() => toggleAttendance(student.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            attendance[student.id] ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          {attendance[student.id] ? (
                            <CheckCircle size={20} className="text-green-600" />
                          ) : (
                            <XCircle size={20} className="text-red-600" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          attendance[student.id] ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {attendance[student.id] ? "Present" : "Absent"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{presentStudents.length}</div>
                    <div className="text-sm text-gray-600">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{absentStudents.length}</div>
                    <div className="text-sm text-gray-600">Absent</div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pb-6">
                <button
                  className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 text-base"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Attendance
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ResponsiveAttendancePage
