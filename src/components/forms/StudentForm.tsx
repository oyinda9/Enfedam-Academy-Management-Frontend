"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CloudUpload, Search, X, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { getAllclass } from "@/services/classServices"
import { getAllsubject } from "@/services/subjectService"
import { getAllParent } from "@/services/parentService"
import { createStudent } from "@/services/studentService"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaSpinner } from "react-icons/fa";

// Enhanced validation schema
const schema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  name: z.string().min(1),
  surname: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  bloodType: z.string().min(1),
  birthday: z.string().min(1),
  sex: z.enum(["MALE", "FEMALE"]),
  classId: z.number(),
  parentId: z.string(),
  parentRelationships: z
    .array(
      z.object({
        parentId: z.string(),
        relationshipType: z.enum(["mother", "father", "guardian", "other"]),
        isPrimary: z.boolean(),
        notes: z.string().optional(),
      }),
    )
    .min(1, "At least one parent relationship is required")
    .optional(),
  subjectIds: z.array(z.number()).optional(),
  lessonIds: z.array(z.number()).optional(),
  img: z.instanceof(FileList).optional(),
})

const StudentForm = ({ type, data }) => {
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [parents, setParents] = useState([])
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(false)
  const [expandedSection, setExpandedSection] = useState("personal")

  // Add these new state variables after the existing ones
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [selectedClassId, setSelectedClassId] = useState(null)

  // Parent relationship management state
  const [showAdvancedParentSelection, setShowAdvancedParentSelection] = useState(false)
  const [searchParent, setSearchParent] = useState("")
  const [searchField, setSearchField] = useState("name")
  const [selectedParentId, setSelectedParentId] = useState(null)
  const [relationshipType, setRelationshipType] = useState("mother")
  const [isPrimaryContact, setIsPrimaryContact] = useState(false)
  const [relationshipNotes, setRelationshipNotes] = useState("")
  const [parentRelationships, setParentRelationships] = useState([])

  // Setup react-hook-form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  })

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [classesData, subjectsData, parentsData] = await Promise.all([
          getAllclass(),
          getAllsubject(),
          getAllParent(),
        ])
        setClasses(classesData)
        setSubjects(subjectsData)
        setParents(parentsData)
        setLessons([
          { id: 1, name: "Math Lesson" },
          { id: 2, name: "Science Lesson" },
          { id: 3, name: "History Lesson" },
        ])
      } catch (error) {
        console.error("Failed to load data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handle class selection and auto-select subjects
  useEffect(() => {
    const classId = watch("classId")

    if (classId && classes.length > 0) {
      const selectedClass = classes.find((cls) => cls.id === classId)

      if (selectedClass && selectedClass.subjects) {
        // Set available subjects for this class
        setAvailableSubjects(selectedClass.subjects)

        // Auto-select all subjects for this class
        const subjectIds = selectedClass.subjects.map((subject) => subject.id)
        setValue("subjectIds", subjectIds)
        setSelectedClassId(classId)
      }
    } else {
      setAvailableSubjects([])
      setValue("subjectIds", [])
      setSelectedClassId(null)
    }
  }, [watch("classId"), classes, setValue])

  // Handle form submission
  const onSubmit = handleSubmit(async (formData) => {
    try {
      const studentData = {
        ...formData,
        img: formData.img?.[0] || null,
        // Set primary parent as parentId for API compatibility
        parentId:
          parentRelationships.find((rel) => rel.isPrimary)?.parentId ||
          parentRelationships[0]?.parentId ||
          formData.parentId,
        parentRelationships: showAdvancedParentSelection ? parentRelationships : undefined,
      }

      const result = await createStudent(studentData)
      console.log("Student created:", result)
      toast.success("Student created successfully!")
    } catch (error) {
      console.error("Error creating student:", error)
      toast.error("Failed to create student.")
    }
  })

  // Parent relationship management functions
  const addParentRelationship = () => {
    if (!selectedParentId) return

    const existingIndex = parentRelationships.findIndex((rel) => rel.parentId === selectedParentId)

    if (existingIndex >= 0) {
      const updated = parentRelationships.map((rel, index) =>
        index === existingIndex
          ? { ...rel, relationshipType, isPrimary: isPrimaryContact, notes: relationshipNotes }
          : isPrimaryContact
            ? { ...rel, isPrimary: false }
            : rel,
      )
      setParentRelationships(updated)
    } else {
      const updated = isPrimaryContact
        ? parentRelationships.map((rel) => ({ ...rel, isPrimary: false }))
        : [...parentRelationships]

      setParentRelationships([
        ...updated,
        { parentId: selectedParentId, relationshipType, isPrimary: isPrimaryContact, notes: relationshipNotes },
      ])
    }

    // Reset form
    setSelectedParentId(null)
    setRelationshipType("mother")
    setIsPrimaryContact(false)
    setRelationshipNotes("")
    setSearchParent("")
  }

  const removeParentRelationship = (parentId) => {
    setParentRelationships(parentRelationships.filter((rel) => rel.parentId !== parentId))
  }

  const getFilteredParents = () => {
    if (!searchParent.trim()) return []

    return parents.filter((parent) => {
      const searchTerm = searchParent.toLowerCase()
      switch (searchField) {
        case "name":
          return `${parent.name || parent.firstName || ""} ${parent.surname || parent.lastName || ""}`
            .toLowerCase()
            .includes(searchTerm)
        case "email":
          return parent.email?.toLowerCase().includes(searchTerm)
        case "id":
          return parent.uniqueId?.toLowerCase().includes(searchTerm) || parent.id?.toLowerCase().includes(searchTerm)
        case "phone":
          return parent.phone?.toLowerCase().includes(searchTerm)
        default:
          return false
      }
    })
  }

  const getParentById = (id) => parents.find((parent) => parent.id === id)

  const getRelationshipLabel = (type) => {
    const labels = { mother: "Mother", father: "Father", guardian: "Guardian", other: "Other" }
    return labels[type]
  }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <form className="p-6 space-y-6" onSubmit={onSubmit}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {type === "create" ? "Create New Student" : "Update Student"}
          </h1>
          {/* <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 transition-colors"
          >
            {loading ? "Processing..." : type === "create" ? "Create" : "Update"}
          </button> */}

           <button
                    type="submit"
                    className="bg-blue-700 text-white p-3 rounded-md hover:bg-blue-800  flex justify-center items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : type === "create" ? (
                      "Create"
                    ) : (
                      "Update"
                    )}
                  </button>
        </div>

        {/* Collapsible Section: Personal Info */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div
            className={`flex justify-between items-center p-4 cursor-pointer ${
              expandedSection === "personal" ? "bg-blue-50" : "bg-white"
            }`}
            onClick={() => toggleSection("personal")}
          >
            <h2 className="text-lg font-semibold text-gray-700">Personal Information</h2>
            {expandedSection === "personal" ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {expandedSection === "personal" && (
            <div className="p-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField label="Username" name="username" register={register} errors={errors} />
                <InputField label="Email" name="email" type="email" register={register} errors={errors} />
                <InputField label="Phone" name="phone" register={register} errors={errors} />
                <InputField label="First Name" name="name" register={register} errors={errors} />
                <InputField label="Last Name" name="surname" register={register} errors={errors} />
                <InputField label="Address" name="address" register={register} errors={errors} />
                <InputField label="Birthday" name="birthday" type="date" register={register} errors={errors} />
                <SelectField
                  label="Sex"
                  name="sex"
                  options={[
                    { id: "MALE", name: "Male" },
                    { id: "FEMALE", name: "Female" },
                  ]}
                  register={register}
                  errors={errors}
                  isNumber={false}
                />
                <SelectField
                  label="Blood Type"
                  name="bloodType"
                  options={[
                    { id: "A+", name: "A+" },
                    { id: "A-", name: "A-" },
                    { id: "B+", name: "B+" },
                    { id: "B-", name: "B-" },
                    { id: "O+", name: "O+" },
                    { id: "O-", name: "O-" },
                    { id: "AB+", name: "AB+" },
                    { id: "AB-", name: "AB-" },
                  ]}
                  register={register}
                  errors={errors}
                  isNumber={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* Collapsible Section: Academic Info */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div
            className={`flex justify-between items-center p-4 cursor-pointer ${
              expandedSection === "academic" ? "bg-blue-50" : "bg-white"
            }`}
            onClick={() => toggleSection("academic")}
          >
            <h2 className="text-lg font-semibold text-gray-700">Academic Information</h2>
            {expandedSection === "academic" ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {expandedSection === "academic" && (
            <div className="p-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectField
                  label="Class"
                  name="classId"
                  options={classes}
                  register={register}
                  errors={errors}
                  isNumber={true}
                />
                <MultiSelectField
                  label="Subjects"
                  name="subjectIds"
                  options={availableSubjects.length > 0 ? availableSubjects : subjects}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  errors={errors}
                  disabled={!selectedClassId}
                  helperText={
                    selectedClassId
                      ? `${availableSubjects.length} subjects available for selected class`
                      : "Please select a class first"
                  }
                />
                <MultiSelectField
                  label="Lessons"
                  name="lessonIds"
                  options={lessons}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  errors={errors} helperText={undefined}                />
              </div>
            </div>
          )}
        </div>

        {/* Collapsible Section: Parent Info */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div
            className={`flex justify-between items-center p-4 cursor-pointer ${
              expandedSection === "parent" ? "bg-blue-50" : "bg-white"
            }`}
            onClick={() => toggleSection("parent")}
          >
            <h2 className="text-lg font-semibold text-gray-700">Parent Information</h2>
            {expandedSection === "parent" ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {expandedSection === "parent" && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => setShowAdvancedParentSelection(!showAdvancedParentSelection)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  {showAdvancedParentSelection ? "Simple Selection" : "Advanced Selection"}
                </button>
                <span className="text-sm text-gray-500">
                  {showAdvancedParentSelection ? "Multiple parents with relationship types" : "Single parent selection"}
                </span>
              </div>

              {!showAdvancedParentSelection ? (
                // Original simple selection
                <div className="w-full max-w-xs">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Parent</label>
                  <select {...register("parentId")} className="w-full border border-gray-300 rounded-md py-2 px-3">
                    <option value="">Select a parent</option>
                    {Array.isArray(parents) &&
                      parents.map((option, index) => (
                        <option key={`${option.id}-${index}-parent`} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                  </select>
                  <ErrorMessage errors={errors} name="parentId" />
                </div>
              ) : (
                // Advanced parent relationship management
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Parent Relationships</span>
                    <button
                      type="button"
                      onClick={() => {
                        const modal = document.getElementById("parent-modal")
                        modal.style.display = "block"
                      }}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Parent
                    </button>
                  </div>

                  {/* Parent Relationships Display */}
                  {parentRelationships.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Parent
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Relationship
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Primary
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {parentRelationships.map((rel) => {
                            const parent = getParentById(rel.parentId)
                            if (!parent) return null

                            return (
                              <tr key={rel.parentId}>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  <div className="font-medium">{parent.name}</div>
                                  <div className="text-xs text-gray-500">{parent.email || "No email"}</div>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                    {getRelationshipLabel(rel.relationshipType)}
                                  </span>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  {rel.isPrimary && (
                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                                      Primary
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-right">
                                  <button
                                    type="button"
                                    onClick={() => removeParentRelationship(rel.parentId)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="border rounded-md p-6 text-center text-gray-500">
                      <p>No parent relationships added yet</p>
                      <p className="text-sm mt-1">
                        Use the &quot;Add Parent&quot; button to link parents to this student
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Collapsible Section: Image Upload */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div
            className={`flex justify-between items-center p-4 cursor-pointer ${
              expandedSection === "image" ? "bg-blue-50" : "bg-white"
            }`}
            onClick={() => toggleSection("image")}
          >
            <h2 className="text-lg font-semibold text-gray-700">Profile Image</h2>
            {expandedSection === "image" ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {expandedSection === "image" && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  {...register("img")}
                  className="border border-gray-300 py-2 px-3 rounded-md"
                  accept="image/*"
                />
                <CloudUpload className="w-6 h-6 text-gray-600" />
              </div>
              <ErrorMessage errors={errors} name="img" />
            </div>
          )}
        </div>
      </form>

      {/* Parent Selection Modal */}
      <div
        id="parent-modal"
        className="fixed inset-0 bg-black bg-opacity-50 hidden z-50"
        onClick={(e) => {
          if ((e.target as HTMLElement).id === "parent-modal") {
            ;(e.target as HTMLElement).style.display = "none"
          }
        }}
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Parent Relationship</h3>
              <button
                type="button"
                onClick={() => (document.getElementById("parent-modal").style.display = "none")}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Section */}
            <div className="space-y-4">
              <div className="flex space-x-2">
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-1/3"
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="id">ID</option>
                  <option value="phone">Phone</option>
                </select>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search by ${searchField}...`}
                    value={searchParent}
                    onChange={(e) => setSearchParent(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              {/* Search Results */}
              {searchParent && (
                <div className="border rounded-md overflow-hidden">
                  <div className="max-h-48 overflow-y-auto">
                    {getFilteredParents().length > 0 ? (
                      getFilteredParents().map((parent, index) => (
                        <div
                          key={`${parent.id}-${index}-filtered`}
                          className={`p-3 cursor-pointer hover:bg-gray-100 border-b last:border-b-0 ${
                            selectedParentId === parent.id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => setSelectedParentId(parent.id)}
                        >
                          <div className="font-medium">{parent.name}</div>
                          <div className="text-xs text-gray-500 flex justify-between">
                            <span>{parent.email || "No email"}</span>
                            <span>ID: {parent.id}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">No parents found</p>
                    )}
                  </div>
                </div>
              )}

              {/* Relationship Details */}
              {selectedParentId && (
                <div className="space-y-4 pt-4 border-t border-gray-200 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Relationship Type</label>
                    <select
                      value={relationshipType}
                      onChange={(e) => setRelationshipType(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="mother">Mother</option>
                      <option value="father">Father</option>
                      <option value="guardian">Guardian</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="primary-contact"
                      checked={isPrimaryContact}
                      onChange={(e) => setIsPrimaryContact(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="primary-contact" className="text-sm">
                      Primary Contact
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                    <textarea
                      value={relationshipNotes}
                      onChange={(e) => setRelationshipNotes(e.target.value)}
                      placeholder="Additional information about this relationship..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 h-20 resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      addParentRelationship()
                      document.getElementById("parent-modal").style.display = "none"
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Relationship
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Input Field Component - improved styling
const InputField = ({ label, name, type = "text", register, errors }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input type={type} {...register(name)} className="w-full border border-gray-300 rounded-md py-2 px-3" />
    <ErrorMessage errors={errors} name={name} />
  </div>
)

// Select Field Component - improved styling
const SelectField = ({ label, name, options, register, errors, isNumber = false }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      {...register(name, isNumber ? { valueAsNumber: true } : {})}
      className="w-full border border-gray-300 rounded-md py-2 px-3"
    >
      <option value="">Select {label}</option>
      {Array.isArray(options) &&
        options.map((option, index) => (
          <option key={`${option.id}-${index}`} value={option.id}>
            {option.name}
          </option>
        ))}
    </select>
    <ErrorMessage errors={errors} name={name} />
  </div>
)

const MultiSelectField = ({
  label,
  name,
  options,
  register,
  setValue,
  watch,
  errors,
  disabled = false,
  helperText,
}) => {
  const selectedValues = watch(name) || []

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        multiple
        value={selectedValues}
        disabled={disabled}
        onChange={(e) =>
          setValue(
            name,
            Array.from(e.target.selectedOptions, (o) => Number(o.value)),
          )
        }
        className={`w-full border border-gray-300 rounded-md py-2 px-3 min-h-[100px] ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      >
        {Array.isArray(options) &&
          options.map((option, index) => (
            <option key={`${option.id}-${index}-multi`} value={option.id}>
              {option.name}
            </option>
          ))}
      </select>
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
      <ErrorMessage errors={errors} name={name} />
    </div>
  )
}

const ErrorMessage = ({ errors, name }) =>
  errors[name] ? <p className="text-xs text-red-600">{errors[name]?.message}</p> : null

export default StudentForm
