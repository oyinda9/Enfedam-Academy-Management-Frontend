/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Upload, FileText, User, Calendar, DollarSign, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { getAllStudents } from "@/services/studentService"
import { uploadReceipt, ParentHistory } from "@/services/paymentServices"

export default function ResponsiveParentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [student, setStudent] = useState<string>("")
  const [students, setStudents] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [payment, setPayment] = useState<any>(null)
  const [currency, setCurrency] = useState<any>(null)
  const [paymentsHistory, setPaymentsHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [paginatedData, setPaginatedData] = useState([])
  const itemsPerPage = 5
  const totalPages = Math.ceil(paymentsHistory.length / itemsPerPage)

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const slicedData = paymentsHistory.slice(startIndex, endIndex)
    setPaginatedData(slicedData)
  }, [paymentsHistory, currentPage])

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "null")
    setUser(loggedInUser)
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchStudents = async () => {
      try {
        const data = await getAllStudents()
        if (user?.role === "USER") {
          const filteredStudents = data.filter((s: any) => s.parent?.id === user?.user?.id)
          setStudents(filteredStudents)
        }
      } catch (error) {
        console.error("Error fetching students:", error)
      }
    }

    fetchStudents()
  }, [user])

  useEffect(() => {
    if (!user) return

    async function fetchPayments() {
      setLoading(true)
      try {
        const response = await ParentHistory(user.user.id)
        console.log("API Response:", response)

        const paymentsData = response.payments || response || []
        setPaymentsHistory(paymentsData)
      } catch (error) {
        console.error("Failed to fetch payments:", error)
        setPaymentsHistory([])
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [user, uploadSuccess])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const isImageOrPdf = selectedFile.type.startsWith("image/") || selectedFile.type === "application/pdf"
      if (!isImageOrPdf) {
        alert("Only image or PDF files are allowed.")
        return
      }
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file || !student || !user?.user?.id) {
      alert("Please ensure all fields are selected.")
      return
    }

    setUploading(true)
    try {
      const response = await uploadReceipt(file, student, user.user.id.toString())

      setPayment(response.payment)
      setCurrency(response.currency)
      setUploadSuccess(true)
      // Refresh payments after successful upload
      const data = await ParentHistory(user.user.id)
      setPaymentsHistory(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const PaymentCard = ({ payment, index }: { payment: any; index: number }) => {
    const studentData = students.find((s) => s.id === payment.studentId) || payment.student || {}

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
        {/* Header with student name and status */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {studentData.name || "Unknown"} {studentData.surname || ""}
              </h3>
              <div className="flex items-center gap-1 text-gray-600 mt-1">
                <Calendar size={14} className="flex-shrink-0" />
                <span className="text-sm">{payment.date ? new Date(payment.date).toLocaleDateString() : "N/A"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                payment.verified || payment.status === "VERIFIED"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {payment.verified || payment.status === "VERIFIED" ? "Verified" : "Pending"}
            </span>
          </div>
        </div>

        {/* Payment details */}
        <div className="grid grid-cols-1 gap-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign size={14} className="text-green-600 flex-shrink-0" />
            <span className="font-medium text-gray-700">Amount: </span>
            <span className="text-gray-900 font-semibold">
              ₦{payment.amount?.toLocaleString() || payment.amountPaid?.toLocaleString() || "0"}
            </span>
          </div>

          {payment.receiptUrl && (
            <div className="flex items-center gap-2 text-sm">
              <FileText size={14} className="text-purple-600 flex-shrink-0" />
              <span className="font-medium text-gray-700">Receipt: </span>
              <a
                href={payment.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
              >
                <Eye size={12} />
                View Receipt
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block min-h-screen bg-gray-50">
        <main className="container mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-lg mb-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🧾 Upload and Track Your Ward's School Fee Payment
              </h1>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Make a Payment:</strong> First, complete your ward's school fee payment through your preferred
                  bank or mobile platform.
                </li>
                <li>
                  <strong>Upload the Payment Receipt:</strong> Return to this platform and go to the{" "}
                  <span className="font-semibold">Upload Receipt</span> section. Select the student you're making the
                  payment for, upload a clear image of your receipt, and click{" "}
                  <span className="text-blue-600 font-semibold">Upload Receipt</span>.
                </li>
                <li>
                  <strong>Automatic Processing:</strong> Once uploaded, the system will detect the exact amount paid and
                  log it under your <span className="font-semibold">Payment History</span>.
                </li>
                <li>
                  <strong>Track Your Payment:</strong> Your transaction will appear below. Please allow a short time for
                  the school to verify your payment — the status will change to{" "}
                  <span className="text-green-600 font-semibold">Verified</span> once confirmed.
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Receipt Section */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Upload Payment Receipt</h2>
                <p className="text-sm text-gray-500">Upload a receipt for school fee payment</p>
              </div>
              <div className="p-6 space-y-4">
                {!uploadSuccess ? (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="student" className="block text-sm font-medium text-gray-700">
                        Select Student
                      </label>
                      <select
                        id="student"
                        value={student}
                        onChange={(e) => setStudent(e.target.value)}
                        className="block w-full py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Select a student</option>
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} {s.surname}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Upload Receipt</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Drag and drop your receipt here or click to browse</p>
                        <input
                          id="receipt"
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <button
                          onClick={() => document.querySelector<HTMLInputElement>("#receipt")?.click()}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Select File
                        </button>
                        {file && <p className="text-sm mt-2 text-gray-600">Selected: {file.name}</p>}
                      </div>
                    </div>

                    <button
                      onClick={handleUpload}
                      disabled={!file || !student || uploading}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <>
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
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Upload Receipt"
                      )}
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
                      <p className="font-medium">Receipt successfully processed!</p>
                      <p>
                        Amount detected: {currency ?? "N/A"}
                        {payment?.amountPaid?.toFixed(2) ?? "N/A"}
                      </p>
                      <p>
                        Payment has been recorded for{" "}
                        {students.find((s) => s.id === student)?.name +
                          " " +
                          students.find((s) => s.id === student)?.surname}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null)
                        setStudent("")
                        setUploadSuccess(false)
                        setPayment(null)
                      }}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Upload Another Receipt
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Payment History Section */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <h2 className="text-2xl font-bold text-gray-800">Payment History</h2>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <svg
                      className="animate-spin mx-auto h-8 w-8 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <p className="mt-2 text-gray-600">Loading payment history...</p>
                  </div>
                ) : paymentsHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No payment history found</div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {["Student", "Date", "Amount", "Receipt", "Status"].map((heading, idx) => (
                              <th
                                key={idx}
                                className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide"
                              >
                                {heading}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {paginatedData.map((payment, index) => {
                            const studentData =
                              students.find((s) => s.id === payment.studentId) || payment.student || {}

                            return (
                              <tr key={index} className="hover:bg-blue-50 transition duration-150 ease-in-out">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                  {studentData.name || "Unknown"} {studentData.surname || ""}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {payment.date ? new Date(payment.date).toLocaleDateString() : "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  ₦{payment.amount?.toLocaleString() || payment.amountPaid?.toLocaleString() || "0"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {payment.receiptUrl ? (
                                    <a
                                      href={payment.receiptUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      View
                                    </a>
                                  ) : (
                                    <span className="text-gray-400">N/A</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-3 py-1 inline-flex text-xs font-semibold leading-5 rounded-full ${
                                      payment.verified || payment.status === "VERIFIED"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {payment.verified || payment.status === "VERIFIED" ? "Verified" : "Pending"}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-6 px-4">
                      <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>
                      <span className="text-sm text-gray-600 font-medium">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden bg-gray-50 min-h-screen">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign size={20} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Payment Dashboard</h1>
                <p className="text-sm text-gray-600">Upload receipts & track payments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 space-y-6">
          {/* Instructions Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg">
              <h2 className="text-lg font-bold text-gray-800 mb-2">📱 Quick Guide</h2>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <strong>1.</strong> Make payment via bank/mobile app
                </p>
                <p>
                  <strong>2.</strong> Upload receipt below
                </p>
                <p>
                  <strong>3.</strong> Track verification status
                </p>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-blue-50">
              <h2 className="text-lg font-semibold text-gray-900">Upload Receipt</h2>
              <p className="text-sm text-gray-600">Upload payment receipt for verification</p>
            </div>

            <div className="p-4 space-y-4">
              {!uploadSuccess ? (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Select Student</label>
                    <select
                      value={student}
                      onChange={(e) => setStudent(e.target.value)}
                      className="block w-full py-3 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                    >
                      <option value="">Choose a student</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} {s.surname}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Upload Receipt</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-3 text-center">Tap to select receipt file</p>
                      <input
                        id="receipt-mobile"
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <button
                        onClick={() => document.querySelector<HTMLInputElement>("#receipt-mobile")?.click()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Select File
                      </button>
                      {file && <p className="text-sm mt-2 text-gray-600 text-center">Selected: {file.name}</p>}
                    </div>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={!file || !student || uploading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                  >
                    {uploading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Upload Receipt
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                    <p className="font-medium mb-2">✅ Receipt successfully processed!</p>
                    <p className="text-sm">
                      Amount: {currency ?? "N/A"}
                      {payment?.amountPaid?.toFixed(2) ?? "N/A"}
                    </p>
                    <p className="text-sm">
                      Student: {students.find((s) => s.id === student)?.name}{" "}
                      {students.find((s) => s.id === student)?.surname}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null)
                      setStudent("")
                      setUploadSuccess(false)
                      setPayment(null)
                    }}
                    className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                  >
                    Upload Another Receipt
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Payment History Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-blue-50">
              <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
              <p className="text-sm text-gray-600">{paymentsHistory.length} total payments</p>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="text-center py-8">
                  <svg
                    className="animate-spin mx-auto h-8 w-8 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <p className="mt-2 text-gray-600">Loading payments...</p>
                </div>
              ) : paymentsHistory.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                  <p className="text-gray-500">Upload your first receipt to get started</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {paginatedData.map((payment, index) => (
                      <PaymentCard key={index} payment={payment} index={index} />
                    ))}
                  </div>

                  {/* Mobile Pagination */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handlePrev}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} />
                      Prev
                    </button>
                    <span className="text-sm text-gray-600 font-medium">
                      {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
