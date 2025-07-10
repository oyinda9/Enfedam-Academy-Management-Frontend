"use client"

import { useState, useEffect } from "react"
import { getAllStudents } from "@/services/studentService"
import PulseLoader from "@/components/loader"
import {
  Calendar,
  Award,
  MessageCircle,
  ChevronRight,
  TrendingUp,
  Clock,
  Bell,
  BookOpen,
  Target,
  Star,
  Users,
  FileText,
  Phone,
  Mail,
  MapPin,
  Heart,
  User,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"

interface Student {
  id: number
  name: string
  surname: string
  email?: string
  phone?: string
  address?: string
  bloodType?: string
  sex?: string
  birthday?: string
  class?: {
    id: number
    name: string
    supervisorId?: number
  }
  parent?: {
    id: number
    name: string
    surname: string
    email?: string
    phone?: string
  }
  // Mock additional data for dashboard
  attendance?: number
  grade?: string
  behavior?: "excellent" | "good" | "needs_attention"
  recentTests?: Array<{
    subject: string
    score: number
    date: string
  }>
  upcomingEvents?: Array<{
    title: string
    date: string
    type: "exam" | "assignment" | "event"
  }>
}

interface Announcement {
  id: string
  title: string
  message: string
  date: string
  type: "info" | "warning" | "success"
  urgent: boolean
}

const ParentDashboard = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedChild, setSelectedChild] = useState<string>("all")

  // Mock announcements data
  const [announcements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Parent-Teacher Conference",
      message: "Schedule your meeting for next week. Please book your slot online.",
      date: "2 days ago",
      type: "info",
      urgent: true,
    },
    {
      id: "2",
      title: "School Fee Reminder",
      message: "Second term fees are due by January 30th",
      date: "1 week ago",
      type: "warning",
      urgent: false,
    },
    {
      id: "3",
      title: "School Sports Day",
      message: "Join us for an exciting day of activities on January 28th",
      date: "1 week ago",
      type: "success",
      urgent: false,
    },
  ])

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(loggedInUser)

    const fetchStudents = async () => {
      try {
        const data = await getAllStudents()
        let studentsToShow: Student[] = []

        if (loggedInUser?.role === "USER") {
          // Parent sees only their children
          studentsToShow = data.filter((student) => student.parent?.id === loggedInUser?.user?.id)
        } else if (loggedInUser?.role === "TEACHER") {
          // Teacher sees students from their supervised classes
          studentsToShow = data.filter((student) => student.class?.supervisorId === loggedInUser?.user?.id)
        } else if (loggedInUser?.role === "EXECUTIVE") {
          // Executive sees students from their supervised classes
          studentsToShow = data.filter((student) => student.class?.supervisorId === loggedInUser?.user?.id)
        } else if (loggedInUser?.role === "ADMIN") {
          // Admin sees all students
          studentsToShow = data
        }

        // Add mock data for dashboard functionality
        const enhancedStudents = studentsToShow.map((student) => ({
          ...student,
          attendance: Math.floor(Math.random() * 20) + 80, // 80-100%
          grade: ["A+", "A", "A-", "B+", "B", "B-"][Math.floor(Math.random() * 6)],
          behavior: ["excellent", "good", "needs_attention"][Math.floor(Math.random() * 3)] as
            | "excellent"
            | "good"
            | "needs_attention",
          recentTests: [
            { subject: "Mathematics", score: Math.floor(Math.random() * 30) + 70, date: "2024-01-15" },
            { subject: "English", score: Math.floor(Math.random() * 30) + 70, date: "2024-01-12" },
            { subject: "Science", score: Math.floor(Math.random() * 30) + 70, date: "2024-01-10" },
          ],
          upcomingEvents: [
            { title: "Math Quiz", date: "2024-01-20", type: "exam" as const },
            { title: "Science Project Due", date: "2024-01-22", type: "assignment" as const },
          ],
        }))

        setStudents(enhancedStudents)
      } catch (error) {
        console.error("Error fetching students:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const getBehaviorColor = (behavior: string) => {
    switch (behavior) {
      case "excellent":
        return "text-green-600 bg-green-100"
      case "good":
        return "text-blue-600 bg-blue-100"
      case "needs_attention":
        return "text-orange-600 bg-orange-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "exam":
        return <FileText size={14} className="text-red-500" />
      case "assignment":
        return <BookOpen size={14} className="text-blue-500" />
      case "event":
        return <Calendar size={14} className="text-green-500" />
      default:
        return <Calendar size={14} className="text-gray-500" />
    }
  }

  const StudentCard = ({ student }: { student: Student }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {student.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {student.name} {student.surname}
            </h3>
            <p className="text-gray-600">{student.class?.name || "No Class"}</p>
          </div>
        </div>
        <Link href={`/list/students/${student.id}`}>
          <button className="w-8 h-8 bg-blue-50 hover:bg-blue-100 rounded-full flex items-center justify-center">
            <ChevronRight size={16} className="text-blue-600" />
          </button>
        </Link>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-gray-500" />
            <span className="text-gray-700">{student.email || "No Email"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} className="text-gray-500" />
            <span className="text-gray-700">{student.phone || "No Phone"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-gray-500" />
            <span className="text-gray-700">{student.address || "No Address"}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Heart size={14} className="text-red-500" />
            <span className="text-gray-700">Blood: {student.bloodType || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User size={14} className="text-gray-500" />
            <span className="text-gray-700">Gender: {student.sex || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-gray-700">
              DOB: {student.birthday ? new Date(student.birthday).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Academic Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <Award size={16} className="text-green-600 mx-auto mb-1" />
          <p className="text-xs text-green-700 font-medium">Overall Grade</p>
          <p className="text-lg font-bold text-green-800">{student.grade}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <Target size={16} className="text-blue-600 mx-auto mb-1" />
          <p className="text-xs text-blue-700 font-medium">Attendance</p>
          <p className="text-lg font-bold text-blue-800">{student.attendance}%</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <Star size={16} className="text-purple-600 mx-auto mb-1" />
          <p className="text-xs text-purple-700 font-medium">Behavior</p>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getBehaviorColor(student.behavior!)}`}>
            {student.behavior?.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Recent Tests */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <BookOpen size={16} className="text-gray-600" />
          Recent Test Scores
        </h4>
        <div className="space-y-2">
          {student.recentTests?.slice(0, 3).map((test, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-700">{test.subject}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{new Date(test.date).toLocaleDateString()}</span>
                <span
                  className={`text-sm font-semibold ${
                    test.score >= 90 ? "text-green-600" : test.score >= 80 ? "text-blue-600" : "text-orange-600"
                  }`}
                >
                  {test.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <Clock size={16} className="text-gray-600" />
          Upcoming Events
        </h4>
        <div className="space-y-2">
          {student.upcomingEvents?.slice(0, 2).map((event, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
              {getEventTypeIcon(event.type)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                <p className="text-xs text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => (
    <div
      className={`bg-white rounded-lg p-4 border-l-4 ${
        announcement.type === "info"
          ? "border-l-blue-500"
          : announcement.type === "warning"
            ? "border-l-yellow-500"
            : "border-l-green-500"
      } ${announcement.urgent ? "ring-2 ring-red-200" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">{announcement.title}</h4>
            {announcement.urgent && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">Urgent</span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-2">{announcement.message}</p>
          <p className="text-gray-400 text-xs">{announcement.date}</p>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <PulseLoader />
      </div>
    )
  }

  const parentName = user?.user?.name || "Parent"
  const roleTitle =
    user?.role === "USER"
      ? "Parent Dashboard"
      : user?.role === "TEACHER"
        ? "Teacher Dashboard"
        : user?.role === "EXECUTIVE"
          ? "Executive Dashboard"
          : "Admin Dashboard"

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Welcome Header */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {getGreeting()}, {parentName}! 👋
                </h1>
                <p className="text-gray-600 text-lg">{roleTitle} - Comprehensive overview of student progress</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-2">
                    <GraduationCap size={28} className="text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{students.length} Students</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                </div>
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avg Attendance</p>
                  <p className="text-2xl font-bold text-green-600">
                    {students.length > 0
                      ? Math.round(
                          students.reduce((acc, student) => acc + (student.attendance || 0), 0) / students.length,
                        )
                      : 0}
                    %
                  </p>
                </div>
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Upcoming Events</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {students.reduce((acc, student) => acc + (student.upcomingEvents?.length || 0), 0)}
                  </p>
                </div>
                <Calendar size={24} className="text-orange-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">New Messages</p>
                  <p className="text-2xl font-bold text-purple-600">3</p>
                </div>
                <MessageCircle size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Students Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.role === "USER" ? "Your Children" : "Students"}
                </h2>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedChild}
                    onChange={(e) => setSelectedChild(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Students</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id.toString()}>
                        {student.name} {student.surname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {students
                  .filter((student) => selectedChild === "all" || student.id.toString() === selectedChild)
                  .map((student) => (
                    <StudentCard key={student.id} student={student} />
                  ))}
              </div>

              {students.length === 0 && (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                  <GraduationCap size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
                  <p className="text-gray-600">
                    {user?.role === "USER"
                      ? "No children are associated with your account."
                      : "No students are assigned to your supervision."}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Announcements */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Bell size={20} className="text-blue-600" />
                    Announcements
                  </h3>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                    {announcements.filter((a) => a.urgent).length} Urgent
                  </span>
                </div>
                <div className="space-y-4">
                  {announcements.slice(0, 3).map((announcement) => (
                    <AnnouncementCard key={announcement.id} announcement={announcement} />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/attendance">
                    <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <Calendar size={20} className="text-blue-600" />
                      <span className="text-gray-700">View Attendance Records</span>
                      <ChevronRight size={16} className="text-gray-400 ml-auto" />
                    </button>
                  </Link>
                  <Link href="/grades">
                    <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <Award size={20} className="text-green-600" />
                      <span className="text-gray-700">Check Report Cards</span>
                      <ChevronRight size={16} className="text-gray-400 ml-auto" />
                    </button>
                  </Link>
                  <Link href="/messages">
                    <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <MessageCircle size={20} className="text-purple-600" />
                      <span className="text-gray-700">Contact Teachers</span>
                      <ChevronRight size={16} className="text-gray-400 ml-auto" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {getGreeting()}, {parentName.split(" ")[0]}! 👋
                </h1>
                <p className="text-sm text-gray-600">{roleTitle}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-blue-600" />
                  <span className="text-xs text-blue-700 font-medium">Students</span>
                </div>
                <p className="text-lg font-bold text-blue-800">{students.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-xs text-green-700 font-medium">Avg Attendance</span>
                </div>
                <p className="text-lg font-bold text-green-800">
                  {students.length > 0
                    ? Math.round(
                        students.reduce((acc, student) => acc + (student.attendance || 0), 0) / students.length,
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Student Filter */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Students</option>
              {students.map((student) => (
                <option key={student.id} value={student.id.toString()}>
                  {student.name} {student.surname}
                </option>
              ))}
            </select>
          </div>

          {/* Student Cards */}
          <div className="space-y-4">
            {students
              .filter((student) => selectedChild === "all" || student.id.toString() === selectedChild)
              .map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
          </div>

          {students.length === 0 && (
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <GraduationCap size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-600">
                {user?.role === "USER"
                  ? "No children are associated with your account."
                  : "No students are assigned to your supervision."}
              </p>
            </div>
          )}

          {/* Announcements Mobile */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Bell size={18} className="text-blue-600" />
                Announcements
              </h3>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                {announcements.filter((a) => a.urgent).length} Urgent
              </span>
            </div>
            <div className="space-y-3">
              {announcements.slice(0, 2).map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          </div>

          {/* Quick Actions Mobile */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/attendance">
                <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg">
                  <Calendar size={20} className="text-blue-600" />
                  <span className="text-xs text-gray-700">Attendance</span>
                </button>
              </Link>
              <Link href="/grades">
                <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg">
                  <Award size={20} className="text-green-600" />
                  <span className="text-xs text-gray-700">Grades</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ParentDashboard
