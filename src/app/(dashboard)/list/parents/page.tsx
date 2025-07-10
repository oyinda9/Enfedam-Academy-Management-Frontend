"use client"

import { useEffect, useState } from "react"
import TableSearch from "@/components/TableSearch"
import {
  Filter,
  ArrowDownNarrowWide,
  View,
  Phone,
  Mail,
  MapPin,
  Users,
  User,
  GraduationCap,
  ChevronDown,
} from "lucide-react"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import Link from "next/link"
import { role } from "../../../../lib/data"
import FormModal from "@/components/FormModal"
import { getAllParent } from "@/services/parentService"
import PulseLoader from "@/components/loader"
import { getTeacherById } from "@/services/teacherServices"

interface ParentList {
  id: number
  name: string
  email: string
  phone: string
  address: string
  students: { id: number; name: string; classId?: number; className?: string }[]
}

interface ClassOption {
  id: number
  name: string
}

const columns = [
  { headers: "Info", accessor: "info" },
  {
    headers: "Student Name",
    accessor: "students",
    className: "hidden md:table-cell",
  },
  { headers: "Email", accessor: "email" },
  { headers: "Phone", accessor: "phone" },
  { headers: "Address", accessor: "address" },
  { headers: "Action", accessor: "action" },
]

const ITEMS_PER_PAGE = 5

const ResponsiveParentListPage = () => {
  const [parents, setParents] = useState<ParentList[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole] = useState<string | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const [availableClasses, setAvailableClasses] = useState<ClassOption[]>([])
  const [filteredParents, setFilteredParents] = useState<ParentList[]>([])

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(loggedInUser)

    const fetchParents = async () => {
      try {
        const data = await getAllParent()
        let parentsToShow: ParentList[] = []
        let classesToShow: ClassOption[] = []

        if (loggedInUser?.role === "TEACHER") {
          // Fetch the full teacher profile using the user ID to get classId
          const teacherProfile = await getTeacherById(loggedInUser.user.id)
          const teacherClassId = teacherProfile?.classes?.[0]?.id

          console.log("teacher profile", teacherProfile)
          console.log("teacher class id", teacherClassId)

          // Filter parents whose students belong to the teacher's class
          parentsToShow = data.filter((parent) =>
            parent.students?.some((student) => student.classId === teacherClassId),
          )

          // For teachers, only show their class in the dropdown
          if (teacherProfile?.classes?.[0]) {
            classesToShow = [{ id: teacherProfile.classes[0].id, name: teacherProfile.classes[0].name }]
          }
        } else if (loggedInUser?.role === "ADMIN" || loggedInUser?.role === "EXECUTIVE") {
          // Admin/Executive sees all parents
          parentsToShow = data

          // Extract all unique classes from all students
          const allClasses = new Map<number, string>()
          data.forEach((parent) => {
            parent.students?.forEach((student) => {
              if (student.classId && student.className) {
                allClasses.set(student.classId, student.className)
              }
            })
          })
          classesToShow = Array.from(allClasses.entries()).map(([id, name]) => ({ id, name }))
        }

        setParents(parentsToShow)
        setFilteredParents(parentsToShow)
        setAvailableClasses(classesToShow)
      } catch (error) {
        console.error("Failed to load parents", error)
      } finally {
        setLoading(false)
      }
    }

    fetchParents()
  }, [])

  useEffect(() => {
    if (selectedClass === null) {
      setFilteredParents(parents)
    } else {
      const filtered = parents.filter((parent) => parent.students?.some((student) => student.classId === selectedClass))
      setFilteredParents(filtered)
    }
    setCurrentPage(1) // Reset to first page when filtering
  }, [selectedClass, parents])

  const totalPages = Math.ceil(filteredParents.length / ITEMS_PER_PAGE)
  const paginatedParents = filteredParents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  // Desktop table row renderer (your original logic)
  const renderRow = (item: ParentList) => {
    const isTeacher = user?.role === "TEACHER"
    const isAdmin = user?.role === "ADMIN"
    const isExecutive = user?.role === "EXECUTIVE"

    return (
      <tr
        key={item.id}
        className={`border-b border-blue-100 even:bg-slate-100 text-sm hover:bg-red-50 ${isTeacher ? "" : ""}`}
      >
        {isTeacher ? (
          // Teacher view as a table row style
          <>
            <td className="flex items-center gap-4 p-4">
              <div className="flex flex-col">
                <h3 className="font-semibold">{item.name}</h3>
              </div>
            </td>
            <td className="hidden md:table-cell">
              {item.students.length ? item.students.map((student) => student.name).join(", ") : "No students"}
            </td>
            <td className="hidden md:table-cell">{item.email}</td>
            <td className="hidden md:table-cell">{item.phone}</td>
            <td className="hidden md:table-cell">{item.address}</td>
            <td className="px-4 py-2">
              <div className="flex items-center gap-4">
                <Link href={`/list/parents/${item.id}`}>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200">
                    <View width={18} />
                  </button>
                </Link>
                {userRole === "ADMIN" && <FormModal table="student" type="delete" id={item.id} />}
              </div>
            </td>
          </>
        ) : isAdmin ? (
          // Admin view as a table row
          <>
            <td className="flex items-center gap-4 p-4">
              <div className="flex flex-col">
                <h3 className="font-semibold">{item.name}</h3>
              </div>
            </td>
            <td className="hidden md:table-cell">
              {item.students.length ? item.students.map((student) => student.name).join(", ") : "No students"}
            </td>
            <td className="hidden md:table-cell">{item.email}</td>
            <td className="hidden md:table-cell">{item.phone}</td>
            <td className="hidden md:table-cell">{item.address}</td>
            <td className="px-4 py-2">
              <div className="flex items-center gap-4">
                <Link href={`/list/parents/${item.id}`}>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200">
                    <View width={18} />
                  </button>
                </Link>
                {userRole === "ADMIN" && <FormModal table="student" type="delete" id={item.id} />}
              </div>
            </td>
          </>
        ) : isExecutive ? (
          // Executive view as a table row
          <>
            <td className="flex items-center gap-4 p-4">
              <div className="flex flex-col">
                <h3 className="font-semibold">{item.name}</h3>
              </div>
            </td>
            <td className="hidden md:table-cell">
              {item.students.length ? item.students.map((student) => student.name).join(", ") : "No students"}
            </td>
            <td className="hidden md:table-cell">{item.email}</td>
            <td className="hidden md:table-cell">{item.phone}</td>
            <td className="hidden md:table-cell">{item.address}</td>
            <td className="px-4 py-2">
              <div className="flex items-center gap-4">
                <Link href={`/list/parents/${item.id}`}>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200">
                    <View width={18} />
                  </button>
                </Link>
                {userRole === "EXECUTIVE" && <FormModal table="student" type="delete" id={item.id} />}
              </div>
            </td>
          </>
        ) : null}
      </tr>
    )
  }

  // Mobile card component
  const ParentCard = ({ parent }: { parent: ParentList }) => {
    const isTeacher = user?.role === "TEACHER"
    const isAdmin = user?.role === "ADMIN"
    const isExecutive = user?.role === "EXECUTIVE"

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
        {/* Header with name and actions */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-gray-900 truncate">{parent.name}</h3>
              <div className="flex items-center gap-1 text-gray-600 mt-1">
                <Mail size={14} className="flex-shrink-0" />
                <span className="text-sm truncate">{parent.email}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Link href={`/list/parents/${parent.id}`}>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors">
                <View size={16} className="text-blue-600" />
              </button>
            </Link>
            {(isAdmin || isExecutive) && userRole === "ADMIN" && (
              <FormModal table="student" type="delete" id={parent.id} />
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} className="flex-shrink-0" />
            <span>{parent.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="truncate">{parent.address}</span>
          </div>
        </div>

        {/* Students Information */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-start gap-2 text-sm">
            <GraduationCap size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="font-medium text-gray-700">Students: </span>
              <span className="text-gray-600">
                {parent.students.length ? parent.students.map((student) => student.name).join(", ") : "No students"}
              </span>
            </div>
          </div>
        </div>

        {/* Role-based indicator for teachers */}
        {isTeacher && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
              <Users size={12} />
              <span>Your Class Parents</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  const ClassDropdown = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="relative">
      <select
        value={selectedClass || ""}
        onChange={(e) => setSelectedClass(e.target.value ? Number(e.target.value) : null)}
        className={`
          ${isMobile ? "w-full px-3 py-2 text-sm" : "px-4 py-2 text-sm"}
          bg-white border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          appearance-none cursor-pointer
        `}
      >
        <option value="">All Classes</option>
        {availableClasses.map((classOption) => (
          <option key={classOption.id} value={classOption.id}>
            {classOption.name}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  )

  // Loading state
  if (loading) {
    return (
      <div className="bg-white lg:bg-gray-50 p-4 rounded-md flex-1 mt-0 lg:min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <PulseLoader />
            <p className="text-gray-600 mt-4">Loading parents...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block bg-white p-4 rounded-md flex-1 mt-0">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">All Parents</h1>
            {user?.role === "TEACHER" && <p className="text-sm text-gray-600 mt-1">Parents from your class</p>}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <ClassDropdown />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300 hover:bg-green-400 transition-colors">
                <Filter size={22} color="black" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-300 hover:bg-green-400 transition-colors">
                <ArrowDownNarrowWide size={22} color="black" />
              </button>
              {role === "admin" && <FormModal table="parent" type="create" data={undefined} />}
            </div>
          </div>
        </div>

        {user?.role === "ADMIN" || user?.role === "TEACHER" || user?.role === "EXECUTIVE" ? (
          <Table columns={columns} renderRow={renderRow} data={paginatedParents} />
        ) : (
          <div className="mt-4">{paginatedParents.map((parent) => renderRow(parent))}</div>
        )}

        <Pagination page={currentPage} count={filteredParents.length} onPageChange={handlePageChange} />
      </div>

      {/* Mobile View */}
      <div className="lg:hidden bg-gray-50 min-h-screen">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Parents</h1>
                {user?.role === "TEACHER" && <p className="text-sm text-gray-600">Your class parents</p>}
                {selectedClass && (
                  <p className="text-sm text-blue-600">{availableClasses.find((c) => c.id === selectedClass)?.name}</p>
                )}
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {filteredParents.length} total
              </span>
            </div>

            {/* Mobile Search and Actions */}
            <div className="space-y-3">
              <TableSearch />
              <ClassDropdown isMobile={true} />
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
                {role === "admin" && <FormModal table="parent" type="create" data={undefined} />}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          {parents.length === 0 ? (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No parents found</h3>
                <p className="text-gray-500 mb-4">
                  {user?.role === "TEACHER"
                    ? "No parents found for your class students."
                    : "Get started by adding your first parent."}
                </p>
                {role === "admin" && <FormModal table="parent" type="create" data={undefined} />}
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              {/* Parent Cards */}
              <div className="space-y-4 mb-6">
                {paginatedParents.map((parent) => (
                  <ParentCard key={parent.id} parent={parent} />
                ))}
              </div>

              {/* Mobile Pagination */}
              <div className="bg-white rounded-lg p-4">
                <Pagination page={currentPage} count={filteredParents.length} onPageChange={handlePageChange} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ResponsiveParentListPage
