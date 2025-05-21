"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { getPaymentSummary, verifyPayment } from "@/services/paymentServices";
import { getAllStudents } from "@/services/studentService";
import Image from "next/image";
export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("students");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [paymentSummary, setPaymentSummary] = useState({
    totalStudents: 0,
    paid: 0,
    notPaid: 0,
    partiallyPaid: 0,
    verified: 0,
    studentsWithVerifiedPayments: 0,
    totalCollected: 0,
    totalOutstanding: 0,
    fullyPaid: [],
    awaitingVerification: [],
    notPaidStudents: [],
    allStudents: 0,
    expectedTotalIncome: 0,
  });

  const transformSummary = (summaryData, allStudentsList = []) => {
    if (!summaryData) return paymentSummary;
  
    const fullyPaid = summaryData.fullyPaid || [];
    const awaitingVerification = summaryData.awaitingVerification || [];
    const notPaidStudents = summaryData.notPaid || [];
  
    const totalStudents =
      fullyPaid.length + awaitingVerification.length + notPaidStudents.length;
  
    const totalCollected = [...fullyPaid, ...awaitingVerification].reduce(
      (sum, student) => sum + (student.paid || 0),
      0
    );
  
    const totalOutstanding =
      notPaidStudents.reduce((sum, student) => sum + (student.total || 0), 0) +
      awaitingVerification.reduce(
        (sum, student) => sum + ((student.total || 0) - (student.paid || 0)),
        0
      );
  
    // Count verified payments inside summaryData arrays:
    const verifiedPayments = [...fullyPaid, ...awaitingVerification].reduce(
      (count, student) =>
        count +
        (student.payments?.filter(
          (payment) =>
            payment.verified === true || payment.verified === "true"
        ).length || 0),
      0
    );
  
    const studentsWithVerified = [...fullyPaid, ...awaitingVerification].filter(
      (student) =>
        student.payments?.some(
          (payment) =>
            payment.verified === true || payment.verified === "true"
        )
    ).length;
  
    // Estimate total expected income based on class name
    const expectedTotalIncome = allStudentsList.reduce((sum, student) => {
      const className = student.class?.name?.toLowerCase() || "";
      if (className.includes("nursery")) {
        return sum + 35000;
      } else if (className.includes("primary")) {
        return sum + 45000;
      } else if (className.includes("ss") || className.includes("sss")) {
        return sum + 50000;
      }
      return sum;
    }, 0);
  
    return {
      totalStudents,
      paid: fullyPaid.length,
      notPaid: notPaidStudents.length,
      partiallyPaid: awaitingVerification.length,
      verified: verifiedPayments,
      studentsWithVerifiedPayments: studentsWithVerified,
      totalCollected,
      totalOutstanding,
      fullyPaid,
      awaitingVerification,
      notPaidStudents,
      allStudents: allStudentsList.length,
      expectedTotalIncome,
    };
  };
  

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [studentsData, summaryData] = await Promise.all([
          getAllStudents(),
          getPaymentSummary(),
        ]);
        setStudents(studentsData || []);
        setPaymentSummary(transformSummary(summaryData, studentsData || []));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = [
    ...(paymentSummary.fullyPaid || []),
    ...(paymentSummary.awaitingVerification || []),
    ...(paymentSummary.notPaidStudents || []),
  ].filter((student) => {
    if (!student) return false;

    const fullName = `${student.name || student.firstName || ""} ${
      student.surname || student.lastName || ""
    }`
      .trim()
      .toLowerCase();

    const matchesSearch = fullName.includes(searchTerm.toLowerCase());

    let paymentStatus = "none";
    if (paymentSummary.fullyPaid?.some((s) => s.id === student.id)) {
      paymentStatus = "full";
    } else if (
      paymentSummary.awaitingVerification?.some((s) => s.id === student.id)
    ) {
      paymentStatus = "partial";
    } else if (
      paymentSummary.notPaidStudents?.some((s) => s.id === student.id)
    ) {
      paymentStatus = "none";
    }

    const matchesStatus =
      statusFilter === "all" || paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const calculateProgress = (value) => {
    return paymentSummary.totalStudents
      ? (value / paymentSummary.totalStudents) * 100
      : 0;
  };

  const handleVerifyPayment = async (paymentId) => {
    if (!paymentId) return;

    setIsVerifying(true);
    try {
      await verifyPayment(paymentId);
      const [studentsData, summaryData] = await Promise.all([
        getAllStudents(),
        getPaymentSummary(),
      ]);
      setStudents(studentsData || []);
      setPaymentSummary(transformSummary(summaryData, studentsData || []));
      setReceiptDialogOpen(false);
    } catch (err) {
      console.error("Error verifying payment:", err);
      setError("Failed to verify payment. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const viewReceipt = (receipt) => {
    if (!receipt) return;
    setSelectedReceipt({
      ...receipt,
      studentName:
        `${receipt.student?.name || ""} ${
          receipt.student?.surname || ""
        }`.trim() || "Unknown",
    });
    setReceiptDialogOpen(true);
  };

  const exportReport = () => {
    try {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(filteredStudents));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "payment_report.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (err) {
      console.error("Error exporting report:", err);
      setError("Failed to export report. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          {/* Total Students Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 pb-2">
              Total Students
            </h3>
            <div className="text-2xl font-bold text-gray-800">
              {paymentSummary.totalStudents}
            </div>
            <p className="text-xs text-gray-500">Enrolled students</p>
          </div>

          {/* Total Collected Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 pb-2">
              Total Collected
            </h3>
            <div className="text-2xl font-bold text-gray-800">
              <p className="text-xl font-bold text-green-600">
                ₦
                {filteredStudents
                  .reduce((total, student) => {
                    const studentPayments =
                      student.payments?.reduce(
                        (sum, payment) => sum + (payment.amountPaid || 0),
                        0
                      ) || 0;
                    return total + studentPayments;
                  }, 0)
                  .toLocaleString()}
              </p>
            </div>
            <p className="text-xs text-gray-500">School fees collected</p>
          </div>

          {/* Outstanding Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 pb-2">
              Outstanding
            </h3>
            <div className="text-2xl font-bold text-gray-800">
              <p className="text-xl font-semibold">
                 ₦
                {paymentSummary.expectedTotalIncome.toLocaleString()}
              </p>
            </div>
            <p className="text-xs text-gray-500">Pending payments</p>
          </div>

          {/* Verified Payments Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 pb-2">
              Verified Payments
            </h3>
            <div className="text-2xl font-bold text-gray-800">
              {paymentSummary.verified}
            </div>
            <p className="text-xs text-gray-500">
              {paymentSummary.studentsWithVerifiedPayments} students verified
            </p>
          </div>

         
        </div>

        {/* Payment Status Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-sm font-medium text-gray-700 pb-4">
            Payment Status Overview
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Full Payment</span>
                <span className="font-medium text-gray-800">
                  {paymentSummary.paid} students (
                  {Math.round(calculateProgress(paymentSummary.paid))}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${calculateProgress(paymentSummary.paid)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Partial Payment</span>
                <span className="font-medium text-gray-800">
                  {paymentSummary.partiallyPaid} students (
                  {Math.round(calculateProgress(paymentSummary.partiallyPaid))}
                  %)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${calculateProgress(
                      paymentSummary.partiallyPaid
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">No Payment</span>
                <span className="font-medium text-gray-800">
                  {paymentSummary.notPaid} students (
                  {Math.round(calculateProgress(paymentSummary.notPaid))}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${calculateProgress(paymentSummary.notPaid)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("students")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "students"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Student Payments
              </button>
              <button
                onClick={() => setActiveTab("recent")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "recent"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Recent Payments
              </button>
              <button
                onClick={() => setActiveTab("receipts")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "receipts"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Receipt Verification
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === "students" && (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="search"
                      placeholder="Search students..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="block w-full md:w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="full">Full Payment</option>
                    <option value="partial">Partial Payment</option>
                    <option value="none">No Payment</option>
                  </select>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={exportReport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Class
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount Paid
                          </th>
                          
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Verification
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => {
                            const totalPaid =
                              student.payments?.reduce(
                                (sum, payment) =>
                                  sum + (payment.amountPaid || 0),
                                0
                              ) || 0;

                            const paymentStatus =
                              paymentSummary.fullyPaid?.some(
                                (s) => s.id === student.id
                              )
                                ? "full"
                                : paymentSummary.awaitingVerification?.some(
                                    (s) => s.id === student.id
                                  )
                                ? "partial"
                                : "none";

                            const verifiedPayments =
                              student.payments?.filter((p) => p.verified)
                                .length || 0;
                            const totalPayments = student.payments?.length || 0;

                            return (
                              <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {student.name || "N/A"}{" "}
                                  {student.surname || ""}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {student.class?.name || "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₦{totalPaid.toLocaleString()}
                                </td>
                             
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {paymentStatus === "full" ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      Paid
                                    </span>
                                  ) : paymentStatus === "partial" ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                      Partial
                                    </span>
                                  ) : (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                      Unpaid
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {verifiedPayments > 0 ? (
                                    <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                                      <CheckCircle className="h-3 w-3 mr-1" />{" "}
                                      {verifiedPayments}/{totalPayments}{" "}
                                      verified
                                    </span>
                                  ) : paymentStatus !== "none" ? (
                                    <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                                      <Clock className="h-3 w-3 mr-1" /> Pending
                                    </span>
                                  ) : (
                                    <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                                      Not Verified
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              No students match your search criteria
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "recent" && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Recent Payments
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    The most recent fee payments received
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receipt ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Verification
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentSummary.awaitingVerification?.length > 0 ? (
                        paymentSummary.awaitingVerification.flatMap((student) =>
                          student.payments?.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {payment.id?.toString().slice(0, 8) || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {student.name || "N/A"} {student.surname || ""}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {payment.createdAt
                                  ? new Date(
                                      payment.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ₦{(payment.amountPaid || 0).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Partial
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {payment.verified ? (
                                  <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                                    <CheckCircle className="h-3 w-3 mr-1" />{" "}
                                    Verified
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                                    <Clock className="h-3 w-3 mr-1" /> Pending
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            No recent payments found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "receipts" && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Receipt Verification Queue
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Review and verify uploaded payment receipts
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  {paymentSummary.awaitingVerification?.length > 0 ? (
                    paymentSummary.awaitingVerification.flatMap((student) =>
                      student.payments
                        ?.filter((payment) => !payment.verified)
                        .map((payment) => (
                          <div
                            key={payment.id}
                            className="p-4 flex items-center justify-between hover:bg-gray-50"
                          >
                            <div>
                              <h3 className="font-medium text-gray-900">
                                Receipt #
                                {payment.id?.toString().substring(0, 8) ||
                                  "N/A"}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Uploaded for {student.name || "Unknown"}{" "}
                                {student.surname || ""} on{" "}
                                {payment.createdAt
                                  ? new Date(
                                      payment.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Amount: ₦
                                {(payment.amountPaid || 0).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() =>
                                  viewReceipt({
                                    ...payment,
                                    student,
                                  })
                                }
                              >
                                View Receipt
                              </button>
                              <button
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => handleVerifyPayment(payment.id)}
                                disabled={isVerifying}
                              >
                                {isVerifying ? "Verifying..." : "Verify"}
                              </button>
                            </div>
                          </div>
                        ))
                    )
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        No pending verifications
                      </p>
                      <p className="text-sm">All receipts have been verified</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Receipt Verification Modal */}
        {receiptDialogOpen && selectedReceipt && (
          <div
            className="fixed inset-0 z-10 overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
              ></div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Receipt Verification
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Review the payment receipt details before verification.
                      </p>

                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Receipt ID
                            </p>
                            <p className="text-sm text-gray-900">
                              {selectedReceipt.id?.toString().slice(0, 8) ||
                                "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Date
                            </p>
                            <p className="text-sm text-gray-900">
                              {selectedReceipt.createdAt
                                ? new Date(
                                    selectedReceipt.createdAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Student
                            </p>
                            <p className="text-sm text-gray-900">
                              {selectedReceipt.studentName || "Unknown"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Amount
                            </p>
                            <p className="text-sm text-gray-900">
                              ₦
                              {(
                                selectedReceipt.amountPaid || 0
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="border rounded-md p-4">
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            Receipt Image
                          </p>
                          {selectedReceipt.receiptUrl ? (
                          
                            
                            <Image
                              src={selectedReceipt.receiptUrl || ""}
                              alt="Payment Receipt"
                              className="w-full h-auto rounded-md border border-gray-200"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src =
                                  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22150%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20150%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18945b7b8b2%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18945b7b8b2%22%3E%3Crect%20width%3D%22300%22%20height%3D%22150%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22110.5%22%20y%3D%2280.1%22%3EImage%20not%20available%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                              }}
                              width={300}
                              height={150}
                              unoptimized
                            />
                          ) : (
                            <div className="bg-gray-100 rounded-md p-8 text-center text-gray-500">
                              <p>Receipt image not available</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => handleVerifyPayment(selectedReceipt.id)}
                    disabled={isVerifying}
                  >
                    {isVerifying ? "Verifying..." : "Confirm Verification"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setReceiptDialogOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
