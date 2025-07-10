"use client"
import { z } from "zod"
import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTeacher, updateTeacher } from "@/services/teacherServices"
import { getAllclass } from "@/services/classServices"
import { getAllsubject } from "@/services/subjectService"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { User, Mail, Phone, MapPin, Calendar, Droplets, Users, BookOpen, AlertCircle } from "lucide-react"

interface TeacherData {
  id?: number
  username?: string
  name?: string
  surname?: string
  email?: string
  phone?: string
  address?: string
  bloodType?: string
  sex?: "MALE" | "FEMALE"
  birthday?: string
  classIds?: number[]
  subjectIds?: number[]
  img?: File
}

// Dynamic Validation Schema
const createSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters!"),
  name: z.string().min(1, "First name is required!"),
  surname: z.string().min(1, "Surname is required!"),
  email: z.string().email("Invalid email address!"),
  phone: z.string().regex(/^\+234[789][01]\d{8}$|^0[789][01]\d{8}$/, "Invalid Nigerian phone number!"),
  address: z.string().min(1, "Address is required!"),
  bloodType: z.string().min(1, "Blood type is required!"),
  sex: z.enum(["MALE", "FEMALE"], { message: "Select a valid gender!" }),
  birthday: z.string().min(1, "Birthday is required!"),
  classIds: z.array(z.number()).min(1, "Select at least one class!"),
  subjectIds: z.array(z.number()).min(1, "Select at least one subject!"),
  img: z.instanceof(File).optional(),
})

const updateSchema = z.object({
  username: z.string().optional(),
  name: z.string().optional(),
  surname: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  bloodType: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"]).optional(),
  birthday: z.string().optional(),
  classIds: z.array(z.number()).optional(),
  subjectIds: z.array(z.number()).optional(),
  img: z.instanceof(File).optional(),
})

type FormData = z.infer<typeof createSchema>

const ResponsiveTeacherForm = ({
  type,
  data,
}: {
  type: "create" | "update"
  data?: TeacherData
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    trigger,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(type === "create" ? createSchema : updateSchema),
    defaultValues: {
      username: "",
      name: "",
      surname: "",
      email: "",
      phone: "",
      address: "",
      bloodType: "",
      sex: undefined,
      birthday: "",
      classIds: [],
      subjectIds: [],
      img: undefined,
    },
  })

  const [classes, setClasses] = useState<{ id: number; name: string }[]>([])
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize form with data when in update mode
  useEffect(() => {
    if (data && type === "update") {
      reset({
        username: data.username || "",
        name: data.name || "",
        surname: data.surname || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        bloodType: data.bloodType || "",
        sex: data.sex || undefined,
        birthday: data.birthday || "",
        classIds: data.classIds || [],
        subjectIds: data.subjectIds || [],
      })
    }
  }, [data, type, reset])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log("Starting to fetch classes and subjects...")

        const [classesResponse, subjectsResponse] = await Promise.all([getAllclass(), getAllsubject()])

        // Debug logging
        console.log("Classes API Response:", classesResponse)
        console.log("Subjects API Response:", subjectsResponse)

        // Handle different possible response structures
        let classesData = []
        let subjectsData = []

        // For classes - try different possible structures
        if (Array.isArray(classesResponse)) {
          classesData = classesResponse
        } else if (classesResponse?.data && Array.isArray(classesResponse.data)) {
          classesData = classesResponse.data
        } else if (classesResponse?.classes && Array.isArray(classesResponse.classes)) {
          classesData = classesResponse.classes
        } else {
          console.warn("Unexpected classes response structure:", classesResponse)
        }

        // For subjects - try different possible structures
        if (Array.isArray(subjectsResponse)) {
          subjectsData = subjectsResponse
        } else if (subjectsResponse?.data && Array.isArray(subjectsResponse.data)) {
          subjectsData = subjectsResponse.data
        } else if (subjectsResponse?.subjects && Array.isArray(subjectsResponse.subjects)) {
          subjectsData = subjectsResponse.subjects
        } else {
          console.warn("Unexpected subjects response structure:", subjectsResponse)
        }

        console.log("Processed classes data:", classesData)
        console.log("Processed subjects data:", subjectsData)

        setClasses(classesData)
        setSubjects(subjectsData)

        if (classesData.length === 0) {
          console.warn("No classes found - API might have returned empty array or wrong structure")
        }
        if (subjectsData.length === 0) {
          console.warn("No subjects found - API might have returned empty array or wrong structure")
        }
      } catch (error) {
        console.error("Failed to load data", error)
        setError("Failed to load classes and subjects. Please try again.")
        setClasses([])
        setSubjects([])
        toast.error("Failed to load form data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleMultiSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(event.target.selectedOptions, (option) => Number(option.value))
    setValue("classIds", values)
    trigger("classIds")
  }

  const handleMultiSelectForSubject = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(event.target.selectedOptions, (option) => Number(option.value))
    setValue("subjectIds", values)
    trigger("subjectIds")
  }

  const onSubmit = async (formData: FormData) => {
    try {
      if (type === "create") {
        await createTeacher(formData)
        toast.success("Teacher created successfully!")
        reset() // Reset form after successful creation
      } else if (type === "update" && data?.id) {
        const updateData = new FormData()
        let hasChanges = false

        Object.keys(formData).forEach((key) => {
          const formValue = formData[key as keyof FormData]
          const dataValue = data[key as keyof TeacherData]

          if (formValue !== undefined && formValue !== dataValue) {
            hasChanges = true
            if (key === "img" && formValue instanceof File) {
              updateData.append(key, formValue)
            } else if (Array.isArray(formValue)) {
              updateData.append(key, JSON.stringify(formValue))
            } else {
              updateData.append(key, String(formValue))
            }
          }
        })

        if (hasChanges) {
          await updateTeacher(data.id, updateData)
          toast.success("Teacher updated successfully!")
        } else {
          toast.info("No changes detected!")
        }
      }
    } catch (error) {
      const action = type === "create" ? "create" : "update"
      toast.error(`Failed to ${action} teacher. Please try again.`)
      console.error(error)
    }
  }

  // Form field component for consistency
  const FormField = ({
    label,
    icon: Icon,
    children,
    error,
  }: {
    label: string
    icon?: React.ElementType
    children: React.ReactNode
    error?: string
  }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {Icon && <Icon size={16} className="text-gray-500" />}
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-600 text-xs flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  )

  if (error) {
    return (
      <div className="min-h-[400px] lg:h-[600px] mx-auto p-4 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Form */}
      <div className="hidden lg:block">
        <form onSubmit={handleSubmit(onSubmit)} className="h-[600px] mx-auto p-6 rounded-lg overflow-y-auto bg-white">
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

          <div className="text-center mb-6">
            <h1 className="font-bold text-2xl text-blue-900">
              {type === "create" ? "Create Teacher" : "Update Teacher"}
            </h1>
            <p className="text-gray-600 mt-2">
              {type === "create" ? "Add a new teacher to the system" : "Update teacher information"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Username */}
            <FormField label="Username" icon={User} error={errors.username?.message}>
              <input
                type="text"
                {...register("username")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter username"
              />
            </FormField>

            {/* Email */}
            <FormField label="Email" icon={Mail} error={errors.email?.message}>
              <input
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
              />
            </FormField>

            {/* Name */}
            <FormField label="First Name" icon={User} error={errors.name?.message}>
              <input
                type="text"
                {...register("name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter first name"
              />
            </FormField>

            {/* Surname */}
            <FormField label="Surname" error={errors.surname?.message}>
              <input
                type="text"
                {...register("surname")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter surname"
              />
            </FormField>

            {/* Phone */}
            <FormField label="Phone" icon={Phone} error={errors.phone?.message}>
              <input
                type="text"
                {...register("phone")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </FormField>

            {/* Address */}
            <FormField label="Address" icon={MapPin} error={errors.address?.message}>
              <input
                type="text"
                {...register("address")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter address"
              />
            </FormField>

            {/* Blood Type */}
            <FormField label="Blood Type" icon={Droplets} error={errors.bloodType?.message}>
              <input
                type="text"
                {...register("bloodType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter blood type"
              />
            </FormField>

            {/* Birthday */}
            <FormField label="Birthday" icon={Calendar} error={errors.birthday?.message}>
              <input
                type="date"
                {...register("birthday")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </FormField>

            {/* Sex */}
            <FormField label="Gender" icon={User} error={errors.sex?.message}>
              <select
                {...register("sex")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Classes */}
            <FormField label="Classes" icon={Users} error={errors.classIds?.message}>
              <select
                multiple
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                onChange={handleMultiSelect}
                value={watch("classIds") || []}
                disabled={loading}
              >
                {loading ? (
                  <option>Loading classes...</option>
                ) : classes.length === 0 ? (
                  <option>No classes available</option>
                ) : (
                  classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))
                )}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple classes</p>
            </FormField>

            {/* Subjects */}
            <FormField label="Subjects" icon={BookOpen} error={errors.subjectIds?.message}>
              <select
                multiple
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                onChange={handleMultiSelectForSubject}
                value={watch("subjectIds") || []}
                disabled={loading}
              >
                {loading ? (
                  <option>Loading subjects...</option>
                ) : subjects.length === 0 ? (
                  <option>No subjects available</option>
                ) : (
                  subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))
                )}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple subjects</p>
            </FormField>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Loading..." : type === "create" ? "Register Teacher" : "Update Teacher"}
          </button>
        </form>
      </div>

      {/* Mobile Form */}
      <div className="lg:hidden bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 p-4">
          <h1 className="font-bold text-xl text-blue-900 text-center">
            {type === "create" ? "Create Teacher" : "Update Teacher"}
          </h1>
          <p className="text-gray-600 text-center text-sm mt-1">
            {type === "create" ? "Add a new teacher" : "Update teacher info"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          {/* Personal Information Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-600" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <FormField label="Username" error={errors.username?.message}>
                <input
                  type="text"
                  {...register("username")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="Enter username"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="First Name" error={errors.name?.message}>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="First name"
                  />
                </FormField>

                <FormField label="Surname" error={errors.surname?.message}>
                  <input
                    type="text"
                    {...register("surname")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="Surname"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Gender" error={errors.sex?.message}>
                  <select
                    {...register("sex")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  >
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </FormField>

                <FormField label="Birthday" error={errors.birthday?.message}>
                  <input
                    type="date"
                    {...register("birthday")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  />
                </FormField>
              </div>

              <FormField label="Blood Type" error={errors.bloodType?.message}>
                <input
                  type="text"
                  {...register("bloodType")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="Enter blood type"
                />
              </FormField>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone size={18} className="text-green-600" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <FormField label="Email" error={errors.email?.message}>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="Enter email address"
                />
              </FormField>

              <FormField label="Phone" error={errors.phone?.message}>
                <input
                  type="text"
                  {...register("phone")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="Enter phone number"
                />
              </FormField>

              <FormField label="Address" error={errors.address?.message}>
                <textarea
                  {...register("address")}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                  placeholder="Enter full address"
                />
              </FormField>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-purple-600" />
              Academic Information
            </h2>
            <div className="space-y-4">
              <FormField label="Classes" error={errors.classIds?.message}>
                <select
                  multiple
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] text-base"
                  onChange={handleMultiSelect}
                  value={watch("classIds") || []}
                  disabled={loading}
                >
                  {loading ? (
                    <option>Loading classes...</option>
                  ) : classes.length === 0 ? (
                    <option>No classes available</option>
                  ) : (
                    classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">Tap and hold to select multiple classes</p>
              </FormField>

              <FormField label="Subjects" error={errors.subjectIds?.message}>
                <select
                  multiple
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] text-base"
                  onChange={handleMultiSelectForSubject}
                  value={watch("subjectIds") || []}
                  disabled={loading}
                >
                  {loading ? (
                    <option>Loading subjects...</option>
                  ) : subjects.length === 0 ? (
                    <option>No subjects available</option>
                  ) : (
                    subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">Tap and hold to select multiple subjects</p>
              </FormField>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pb-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-base"
            >
              {loading ? "Loading..." : type === "create" ? "Register Teacher" : "Update Teacher"}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default ResponsiveTeacherForm
