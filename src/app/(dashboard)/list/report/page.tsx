"use client";
import React, { useEffect, useState } from "react";
import { getAllParent } from "@/services/parentService";
import { getAllTeachers } from "@/services/teacherServices";
import { getAllStudents } from "@/services/studentService";
import { getAllCummulativeResult } from "@/services/examServices";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

const ReportPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [reportType, setReportType] = useState<string>("");
  const [parentCount, setParentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataForALL = async () => {
      try {
        const [parents, teachers, students] = await Promise.all([
          getAllParent(),
          getAllTeachers(),
          getAllStudents(),
          getAllCummulativeResult(),
        ]);
        setParentCount(parents.length);
        setTeacherCount(teachers.length);
        setStudentCount(students.length);
      } catch (error) {
        console.error("Error loading report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataForALL();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let fetchedData: any[] = [];
        if (reportType === "parents") {
          fetchedData = await getAllParent();
        } else if (reportType === "teachers") {
          fetchedData = await getAllTeachers();
        } else if (reportType === "students") {
          fetchedData = await getAllStudents();
        } else if (reportType === "results") {
          fetchedData = await getAllCummulativeResult();
        }

        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (reportType) {
      fetchData();
    }
  }, [reportType]);

  const flattenData = (data: any[]) => {
    return data.map((item) => {
      const flattened: Record<string, any> = {};

      for (const key in item) {
        const value = item[key];
        if (Array.isArray(value)) {
          value.forEach((entry, index) => {
            if (typeof entry === "object" && entry !== null) {
              for (const nestedKey in entry) {
                flattened[`${key}_${index}_${nestedKey}`] = entry[nestedKey];
              }
            } else {
              flattened[`${key}_${index}`] = entry;
            }
          });
        } else if (typeof value === "object" && value !== null) {
          for (const nestedKey in value) {
            flattened[`${key}_${nestedKey}`] = value[nestedKey];
          }
        } else {
          flattened[key] = value;
        }
      }

      return flattened;
    });
  };

  const exportToExcel = () => {
    const flattenedData = flattenData(data);
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Enfedam Academy", 20, 20);
    doc.text(
      `Report for ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`,
      20,
      30
    );

    let y = 40;
    const flattenedData = flattenData(data);
    flattenedData.forEach((row) => {
      const rowText = Object.values(row)
        .map((val) =>
          typeof val === "object" ? JSON.stringify(val) : String(val)
        )
        .join(" | ");
      doc.text(rowText, 20, y);
      y += 10;
    });

    doc.save("report.pdf");
  };

  const tableHeaders = data.length > 0 ? Object.keys(flattenData(data)[0]) : [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">School Report Summary</h1>

      <div className="mb-4">
        <select
          onChange={(e) => setReportType(e.target.value)}
          value={reportType}
          className="p-2 border rounded"
        >
          <option value="">Select Report Type</option>
          <option value="parents">Parents</option>
          <option value="teachers">Teachers</option>
          <option value="students">Students</option>
          <option value="results">Results</option>
        </select>
      </div>

      {data.length > 0 && (
        <div className="overflow-auto border rounded">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {tableHeaders.map((key) => (
                  <th
                    key={key}
                    className="border px-4 py-2 text-left bg-gray-100"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flattenData(data).map((item, index) => (
                <tr key={index}>
                  {tableHeaders.map((key, i) => (
                    <td key={i} className="border px-4 py-2">
                      {typeof item[key] === "object"
                        ? JSON.stringify(item[key])
                        : item[key] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <button
              onClick={exportToExcel}
              className="bg-blue-600 text-white px-4 py-2 mr-2 rounded"
            >
              Export to Excel
            </button>
            <button
              onClick={exportToPDF}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Export to PDF
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Parents</h2>
          <p className="text-3xl text-blue-700">{parentCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Teachers</h2>
          <p className="text-3xl text-green-700">{teacherCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Students</h2>
          <p className="text-3xl text-purple-700">{studentCount}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
