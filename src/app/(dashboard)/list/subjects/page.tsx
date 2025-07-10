"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { View, Trash2, Filter, ArrowDownNarrowWide, BookOpen, User, Users, AlertTriangle } from "lucide-react"
import TableSearch from "@/components/TableSearch"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import FormModal from "@/components/FormModal"
import { getAllsubject } from "@/services/subjectService"

interface SubjectList {
  type?: "create" | "update"
  id: number
  name: string
  teachers?: { name: string; surname?: string }[]
}

const ITEMS_PER_PAGE = 5

// Table Columns
const columns = [
  { headers: "Subject Name", accessor: "name" },
  { headers: "Teachers Name", accessor: "teacher", className: "hidden md:table-cell" },
  { headers: "Actions", accessor: "action" },
]

const ResponsiveSubjectListPage = () => {
  const [subjects, setSubjects] = useState<SubjectList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getAllsubject()

        // Handle different possible response structures and ensure it's an array
        let subjectsData: SubjectList[] = []

        if (Array.isArray(data)) {
          subjectsData = data
        } else if (data?.data && Array.isArray(data.data)) {
          subjectsData = data.data
        } else if (data?.subjects && Array.isArray(data.subjects)) {
          subjectsData = data.subjects
        } else {
          console.warn("Unexpected subjects response structure:", data)
          subjectsData = []
        }

        setSubjects(subjectsData)
      } catch (error) {
        console.error("Failed to load subjects", error)
        setError("Failed to load subjects. Please try again.")
        setSubjects([]) // Ensure subjects is always an array
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()

    const storedRole = localStorage.getItem("role")
    if (storedRole) {
      setUserRole(storedRole)
    }
  }, [])

  // Safe pagination calculation
  const totalPages = Math.ceil((subjects?.length || 0) / ITEMS_PER_PAGE)
  const paginatedSubjects = subjects?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) || []

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  // Helper function to format teacher names
  const getTeachersText = (teachers?: { name: string; surname?: string }[]) => {
    if (!teachers || !Array.isArray(teachers) || teachers.length === 0) {
      return "No teacher assigned"
    }

    return teachers
      .map((teacher) => {
        if (teacher.surname) {
          return `${teacher.name} ${teacher.surname}`
        }
        return teacher.name
      })
      .join(", ")
  }

  // Desktop table row renderer
  const renderRow = (item: SubjectList) => (
    <tr key={item.id} className="border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50">
      <td className="p-4 font-semibold">{item.name}</td>
      <td className="hidden md:table-cell">{getTeachersText(item.teachers)}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/subjects/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200 hover:bg-blue-300 transition-colors">
              <View width={16} />
            </button>
          </Link>
          {userRole === "ADMIN" && (
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-200 hover:bg-red-300 transition-colors">
              <Trash2 width={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  )

  // Mobile card component
  const SubjectCard = ({ subject }: { subject: SubjectList }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header with subject name and actions */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <BookOpen size={20} className="text-purple-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg text-gray-900 truncate">{subject.name}</h3>
            <div className="flex items-center gap-1 text-gray-600 mt-1">
              <Users size={14} className="flex-shrink-0" />
              <span className="text-sm">
                {subject.teachers?.length || 0} teacher{(subject.teachers?.length || 0) !== 1 ? "s" : ""} assigned
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Link href={`/list/subjects/${subject.id}`}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors">
              <View size={16} className="text-blue-600" />
            </button>
          </Link>
          {userRole === "ADMIN" && (
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors">
              <Trash2 size={16} className="text-red-600" />
            </button>
          )}
        </div>
      </div>

      {/* Teachers Information */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-start gap-2 text-sm">
          <User size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="font-medium text-gray-700">Teachers: </span>
            <span className="text-gray-600">{getTeachersText(subject.teachers)}</span>
          </div>
        </div>
      </div>

      {/* Admin indicator */}
      {userRole === "ADMIN" && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full w-fit">
            <AlertTriangle size={12} />
            <span>Admin Actions Available</span>
          </div>
        </div>
      )}
    </div>
  )

  // Loading state
  if (loading) {
    return (
      <div className="bg-white lg:bg-gray-50 p-4 rounded-md flex-1 mt-0 lg:min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading subjects...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white lg:bg-gray-50 p-4 rounded-md flex-1 mt-0 lg:min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block bg-white p-4 rounded-md flex-1 mt-0">
        {/* TOP SECTION */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">All Subjects</h1>
            <p className="text-sm text-gray-600 mt-1">Manage school subjects and their assigned teachers</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300 hover:bg-green-400 transition-colors">
                <Filter size={22} color="black" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300 hover:bg-green-400 transition-colors">
                <ArrowDownNarrowWide size={22} color="black" />
              </button>
              {userRole === "ADMIN" && <FormModal table="subject" type="create" />}
            </div>
          </div>
        </div>

        {/* SUBJECTS TABLE */}
        <div className="mt-4">
          <Table columns={columns} renderRow={renderRow} data={paginatedSubjects} />
        </div>

        {/* PAGINATION */}
        <Pagination page={currentPage} count={subjects.length} onPageChange={handlePageChange} />
      </div>

      {/* Mobile View */}
      <div className="lg:hidden bg-gray-50 min-h-screen">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Subjects</h1>
                <p className="text-sm text-gray-600">School subject management</p>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{subjects.length} total</span>
            </div>

            {/* Mobile Search and Actions */}
            <div className="space-y-3">
              <TableSearch />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                    <Filter size={16} />
                    Filter
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                    <ArrowDownNarrowWide size={16} />
                    Sort
                  </button>
                </div>
                {userRole === "ADMIN" && <FormModal table="subject" type="create" />}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          {subjects.length === 0 ? (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first subject.</p>
                {userRole === "ADMIN" && <FormModal table="subject" type="create" />}
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              {/* Subject Cards */}
              <div className="space-y-4 mb-6">
                {paginatedSubjects.map((subject) => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
              </div>

              {/* Mobile Pagination */}
              <div className="bg-white rounded-lg p-4">
                <Pagination page={currentPage} count={subjects.length} onPageChange={handlePageChange} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ResponsiveSubjectListPage
