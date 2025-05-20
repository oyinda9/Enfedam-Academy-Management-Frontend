"use client";
import React, { useEffect, useState } from "react";
import { getAllclass, getClassById } from "@/services/classServices"; // Adjust imports based on your service paths
import { createAttendance } from "@/services/attendanceServices"; // Adjust imports based on your service paths
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AttendancePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  // Fetch all classes on load
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getAllclass();
        setClasses(data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };

    fetchClasses();
  }, []);

  // Fetch students when a class is selected
  useEffect(() => {
    const fetchClassStudents = async () => {
      if (selectedClassId) {
        try {
          const classData = await getClassById(selectedClassId);
          const studentList = classData?.students || [];
          setStudents(studentList);

          // Initialize attendance for students
          const defaultAttendance: Record<string, boolean> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          studentList.forEach((student: any) => {
            defaultAttendance[student.id] = false; // Default attendance as false (absent)
          });

          setAttendance(defaultAttendance);
        } catch (err) {
          console.error("Error fetching class students:", err);
        }
      }
    };

    fetchClassStudents();
  }, [selectedClassId]);

  // Toggle attendance for each student (Present/Absent)
  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  // Handle form submission to create attendance records
  const handleSubmit = async () => {
    try {
      // Prepare the attendance data for each student
      const payload = Object.keys(attendance).map((studentId) => ({
        studentId: studentId, // Get the student ID
        present: attendance[studentId], // Check if they are present or not
      }));

      console.log("Sending attendance data:", payload); // Log the data for debugging

      // Go through each student's data one by one
      for (const record of payload) {
        console.log("Sending attendance for student:", record); // Log each student's record

        // Send the attendance data for this student to the server
        await createAttendance(record); // Wait until the server responds

        console.log("Attendance sent for student:", record.studentId); // Log when done
      }
      const loadingToast = toast.loading(
        "Please wait... Recording Attendance",
        {
          position: "top-right",
          autoClose: false, // Set to false to keep it visible until the operation finishes
          closeButton: true,
          draggable: true,
          theme: "colored",
        }
      );
      // After sending all attendance data
      // alert("Attendance submitted successfully!");
      toast.dismiss(loadingToast);

      // Then show a new success toast
      toast.success("Attendance submitted successfully.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
        style: {
          backgroundColor: "#4CAF50",
          color: "white",
          fontWeight: "bold",
        },
      });
    } catch (err) {
      // If there is any error, catch it and show an alert
      console.error("Error submitting attendance:", err);
      alert(
        "Error submitting attendance: " + (err?.message || "Please try again")
      );
    }
  };

  // Get list of students marked as present
  const presentStudents = students.filter((student) => attendance[student.id]);

  return (
    <div className="p-4">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">Mark Attendance</h2>

      {/* Dropdown to select a class */}
      <select
        className="border p-2 w-full mb-4"
        value={selectedClassId}
        onChange={(e) => setSelectedClassId(e.target.value)}
      >
        <option value="">Select a class</option>
        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>

      {/* Render students list if any students are found for the selected class */}
      {students.length > 0 && (
        <div className="space-y-2">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <span>{student.name}</span>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={attendance[student.id]} // Check if the student is marked as present
                  onChange={() => toggleAttendance(student.id)} // Toggle attendance status
                />
                <span>{attendance[student.id] ? "Present" : "Absent"}</span>
              </label>
            </div>
          ))}

          {/* Submit button */}
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            Submit Attendance
          </button>

          {/* Display list of present students */}
          {presentStudents.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold">Selected Present Students:</h3>
              <ul>
                {presentStudents.map((student) => (
                  <li key={student.id} className="p-2">
                    {student.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
