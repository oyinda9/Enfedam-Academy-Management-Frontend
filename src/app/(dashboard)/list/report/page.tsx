"use client";

import React, { useEffect, useState } from "react";
import { getFullReport } from "@/services/reportServices";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FiChevronDown, FiChevronUp, FiDownload, FiPrinter, FiUser, FiUsers, FiBook, FiHome } from "react-icons/fi";

const ReportPage = () => {
  const [report, setReport] = useState<any>(null);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [reportType, setReportType] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    parents: 0,
    classes: 0
  });

  useEffect(() => {
    const fetchFullReport = async () => {
      try {
        const data = await getFullReport();
        setReport(data.data);
        setCounts({
          students: data.data.students?.length || 0,
          teachers: data.data.teachers?.length || 0,
          parents: data.data.parents?.length || 0,
          classes: data.data.classes?.length || 0
        });
      } catch (error) {
        console.error("Error loading full report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFullReport();
  }, []);

  useEffect(() => {
    if (!reportType || !report) {
      setDisplayData([]);
      return;
    }

    switch (reportType) {
      case "students":
        setDisplayData(report.students || []);
        break;
      case "teachers":
        setDisplayData(report.teachers || []);
        break;
      case "parents":
        setDisplayData(report.parents || []);
        break;
      case "classes":
        setDisplayData(report.classes || []);
        break;
      default:
        setDisplayData([]);
    }
  }, [reportType, report]);

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    newExpandedRows.has(id) ? newExpandedRows.delete(id) : newExpandedRows.add(id);
    setExpandedRows(newExpandedRows);
  };

  const flattenForDisplay = (data: any) => {
    const result: any = {};
    
    for (const key in data) {
      if (key === "parent" || key === "class" || key === "supervisor" || key === "students") continue;
      if (typeof data[key] !== "object" || data[key] === null) {
        result[key] = data[key];
      } else if (Array.isArray(data[key])) {
        result[key] = data[key].length;
      }
    }
    
    if (data.parent) {
      result.parent = `${data.parent?.name || ''} ${data.parent?.surname || ''}`;
      result.parentEmail = data.parent?.email || '';
    }
    
    if (data.class) {
      result.className = data.class?.name || '';
      result.classSupervisor = data.class?.supervisor 
        ? `${data.class.supervisor.name} ${data.class.supervisor.surname}`
        : '';
    }
    
    if (data.students) {
      result.studentCount = data.students.length;
    }
    
    return result;
  };

  const exportToExcel = () => {
    const flattenedData = displayData.map(item => flattenForExport(item));
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${reportType}_report.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`${reportType.toUpperCase()} REPORT`, 14, 16);
    
    const flattenedData = displayData.map(item => flattenForExport(item));
    const headers = flattenedData.length > 0 ? Object.keys(flattenedData[0]) : [];
    const data = flattenedData.map(row => headers.map(header => row[header]));
    
    (doc as any).autoTable({
      head: [headers],
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      columnStyles: { 0: { cellWidth: 'auto' } }
    });
    
    doc.save(`${reportType}_report.pdf`);
  };

  const flattenForExport = (obj: any, prefix = ""): any => {
    let result: any = {};
    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}_${key}` : key;
      
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        Object.assign(result, flattenForExport(value, newKey));
      } else if (Array.isArray(value)) {
        result[newKey] = value.map((item: any) => 
          typeof item === "object" ? JSON.stringify(item) : item
        ).join("; ");
      } else {
        result[newKey] = value;
      }
    }
    return result;
  };

  const renderDetailedView = (item: any) => {
    switch (reportType) {
      case "students":
        return <StudentDetailView item={item} />;
      case "parents":
        return <ParentDetailView item={item} />;
      case "teachers":
        return <TeacherDetailView item={item} />;
      case "classes":
        return <ClassDetailView item={item} />;
      default:
        return (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <pre className="text-sm text-gray-600 overflow-x-auto">
              {JSON.stringify(item, null, 2)}
            </pre>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load report data. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            <FiBook className="inline mr-2" />
            School Management Report
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={exportToExcel}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <FiDownload className="mr-2" />
              Excel
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <FiPrinter className="mr-2" />
              PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard 
            title="Students" 
            value={counts.students} 
            icon={<FiUser className="text-2xl" />}
            color="bg-blue-100 text-blue-800"
          />
          <SummaryCard 
            title="Teachers" 
            value={counts.teachers} 
            icon={<FiUser className="text-2xl" />}
            color="bg-green-100 text-green-800"
          />
          <SummaryCard 
            title="Parents" 
            value={counts.parents} 
            icon={<FiUsers className="text-2xl" />}
            color="bg-purple-100 text-purple-800"
          />
          <SummaryCard 
            title="Classes" 
            value={counts.classes} 
            icon={<FiHome className="text-2xl" />}
            color="bg-yellow-100 text-yellow-800"
          />
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Report Data</h2>
            <div className="mt-4">
              <select
                onChange={(e) => setReportType(e.target.value)}
                value={reportType}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Report Type</option>
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
                <option value="parents">Parents</option>
                <option value="classes">Classes</option>
              </select>
            </div>
          </div>

          {displayData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Contact</TableHeader>
                    {reportType === "students" && (
                      <>
                        <TableHeader>Parent</TableHeader>
                        <TableHeader>Class</TableHeader>
                      </>
                    )}
                    {reportType === "classes" && <TableHeader>Students</TableHeader>}
                    <TableHeader>Details</TableHeader>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayData.map((item) => {
                    const flattened = flattenForDisplay(item);
                    const isExpanded = expandedRows.has(item.id);
                    
                    return (
                      <React.Fragment key={item.id}>
                        <tr 
                          className="hover:bg-gray-50 cursor-pointer transition"
                          onClick={() => toggleRow(item.id)}
                        >
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {flattened.name} {flattened.surname}
                            </div>
                            {reportType === "teachers" && (
                              <div className="text-xs text-gray-500">
                                {flattened.classes?.length || 0} classes
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900">{flattened.email}</div>
                            <div className="text-sm text-gray-500">{flattened.phone}</div>
                          </TableCell>
                          {reportType === "students" && (
                            <>
                              <TableCell>
                                <div className="text-gray-900">{flattened.parent}</div>
                                <div className="text-sm text-gray-500">{flattened.parentEmail}</div>
                              </TableCell>
                              <TableCell>
                                <div className="text-gray-900">{flattened.className}</div>
                                <div className="text-sm text-gray-500">{flattened.classSupervisor}</div>
                              </TableCell>
                            </>
                          )}
                          {reportType === "classes" && (
                            <TableCell>
                              <div className="text-gray-900">
                                {flattened.studentCount} students
                              </div>
                            </TableCell>
                          )}
                          <TableCell>
                            <button 
                              className="flex items-center text-blue-600 hover:text-blue-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRow(item.id);
                              }}
                            >
                              {isExpanded ? (
                                <>
                                  <FiChevronUp className="mr-1" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <FiChevronDown className="mr-1" />
                                  Show
                                </>
                              )}
                            </button>
                          </TableCell>
                        </tr>
                        
                        {isExpanded && (
                          <tr>
                            <td colSpan={reportType === "students" ? 5 : reportType === "classes" ? 4 : 3} className="p-0">
                              {renderDetailedView(item)}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              {reportType ? "No data available for selected report type" : "Please select a report type"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const SummaryCard = ({ title, value, icon, color }: any) => (
  <div className={`p-6 rounded-xl shadow-sm ${color} flex items-center justify-between`}>
    <div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
    <div className="p-3 rounded-full bg-white bg-opacity-30">
      {icon}
    </div>
  </div>
);

const TableHeader = ({ children }: any) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TableCell = ({ children }: any) => (
  <td className="px-6 py-4 whitespace-nowrap">
    {children}
  </td>
);

const DetailRow = ({ label, value }: { label: string; value: any }) => (
  <div className="flex py-2">
    <span className="w-1/3 font-medium text-gray-500">{label}</span>
    <span className="flex-1 text-gray-800">{value || 'N/A'}</span>
  </div>
);

// Detail View Components
const StudentDetailView = ({ item }: any) => (
  <div className="bg-gray-50 p-6 border-t">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h4 className="font-semibold text-lg text-gray-700 mb-4 border-b pb-2">
          Student Information
        </h4>
        <DetailRow label="Full Name" value={`${item.name} ${item.surname}`} />
        <DetailRow label="Email" value={item.email} />
        <DetailRow label="Phone" value={item.phone} />
        <DetailRow label="Address" value={item.address} />
        <DetailRow label="Birth Date" value={new Date(item.birthday).toLocaleDateString()} />
        <DetailRow label="Blood Type" value={item.bloodType} />
        <DetailRow label="Gender" value={item.sex} />
      </div>

      <div className="space-y-6">
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg text-gray-700 mb-4 border-b pb-2">
            Academic Information
          </h4>
          <DetailRow label="Class" value={item.class?.name} />
          <DetailRow 
            label="Class Teacher" 
            value={item.class?.supervisor ? 
              `${item.class.supervisor.name} ${item.class.supervisor.surname}` : 
              'N/A'} 
          />
          <DetailRow 
            label="Subjects" 
            value={item.Subject?.map((s: any) => s.name).join(", ") || 'None'} 
          />
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg text-gray-700 mb-4 border-b pb-2">
            Parent Information
          </h4>
          <DetailRow label="Parent Name" value={`${item.parent?.name} ${item.parent?.surname}`} />
          <DetailRow label="Parent Email" value={item.parent?.email} />
          <DetailRow label="Parent Phone" value={item.parent?.phone} />
          <DetailRow label="Parent Address" value={item.parent?.address} />
        </div>
      </div>
    </div>

    <div className="mt-6 bg-white p-5 rounded-lg shadow-sm">
      <h4 className="font-semibold text-lg text-gray-700 mb-4 border-b pb-2">
        Attendance Records
      </h4>
      {item.attendances?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {item.attendances.map((att: any) => (
                <tr key={att.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {new Date(att.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      att.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {att.present ? 'Present' : 'Absent'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No attendance records found</p>
      )}
    </div>
  </div>
);

const ParentDetailView = ({ item }: any) => (
  <div className="bg-gray-50 p-6 border-t">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h4 className="font-semibold text-lg text-gray-700 mb-4 border-b pb-2">
          Parent Information
        </h4>
        <DetailRow label="Full Name" value={`${item.name} ${item.surname}`} />
        <DetailRow label="Email" value={item.email} />
        <DetailRow label="Phone" value={item.phone} />
        <DetailRow label="Address" value={item.address} />
        <DetailRow label="Registration Date" value={new Date(item.createdAt).toLocaleDateString()} />
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h4 className="font-semibold text-lg text-gray-700 mb-4 border-b pb-2">
          Children Information
        </h4>
        {item.students?.length > 0 ? (
          <div className="space-y-4">
            {item.students.map((student: any) => (
              <div key={student.id} className="border rounded-lg p-3">
                <DetailRow label="Name" value={`${student.name} ${student.surname}`} />
                <DetailRow label="Class" value={student.class?.name || 'N/A'} />
                <DetailRow label="Email" value={student.email} />
                <DetailRow label="Phone" value={student.phone} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No children registered</p>
        )}
      </div>
    </div>
  </div>
);

const TeacherDetailView = ({ item }: any) => (
  <div className="bg-gray-50 p-6 border-t">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h4 className="font-semibold text-lg text-gray-700 mb-4 border-b pb-2">
          Teacher Information
        </h4>
        <DetailRow label="Full Name" value={`${item.name} ${item.surname}`} />
        <DetailRow label="Email" value={item.email} />
        <DetailRow label="Phone" value={item.phone} />
        <DetailRow label="Address" value={item.address} />
        <DetailRow label="Birth Date" value={new Date(item.birthday).toLocaleDateString()} />
        <DetailRow label="Blood Type" value={item.bloodType} />
        <DetailRow label="Gender" value={item.sex} />
      </div>

      <div className="space-y-6">
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg text-gray-700 mb-4 border-b pb-2">
            Classes Supervised
          </h4>
          {item.classes?.length > 0 ? (
            <div className="space-y-2">
              {item.classes.map((cls: any) => (
                <div key={cls.id} className="border rounded p-2">
                  <DetailRow label="Class Name" value={cls.name} />
                  <DetailRow label="Capacity" value={cls.capacity} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No classes assigned</p>
          )}
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg text-gray-700 mb-4 border-b pb-2">
            Subjects Taught
          </h4>
          {item.subjects?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {item.subjects.map((subject: any) => (
                <span key={subject.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {subject.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No subjects assigned</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ClassDetailView = ({ item }: any) => (
  <div className="bg-gray-50 p-6 border-t">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h4 className="font-semibold text-lg text-gray-700 mb-4 border-b pb-2">
          Class Information
        </h4>
        <DetailRow label="Class Name" value={item.name} />
        <DetailRow label="Capacity" value={item.capacity} />
        <DetailRow 
          label="Supervisor" 
          value={item.supervisor ? 
            `${item.supervisor.name} ${item.supervisor.surname}` : 
            'Not assigned'} 
        />
        <DetailRow label="Student Count" value={item.students?.length || 0} />
      </div>

      <div className="space-y-6">
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg text-gray-700 mb-4 border-b pb-2">
            Subjects
          </h4>
          {item.subjects?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {item.subjects.map((subject: any) => (
                <span key={subject.id} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {subject.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No subjects assigned</p>
          )}
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg text-gray-700 mb-4 border-b pb-2">
            Students
          </h4>
          {item.students?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Parent</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {item.students.map((student: any) => (
                    <tr key={student.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {student.name} {student.surname}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {student.parent?.name || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No students enrolled</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ReportPage;