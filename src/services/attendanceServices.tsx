import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003/";

interface AttendanceData {
  studentId: string;
  present: boolean;
}

interface AttendanceResponse {
  message: string;
  data: any;
}

export const createAttendance = async (attendanceData: AttendanceData) => {
  try {
    // Retrieve the token from local storage
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    // Send the data directly without modifications
    const response = await axios.post<AttendanceResponse>(`${API_URL}/attendance`, attendanceData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating attendance:", error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Failed to create attendance");
  }
};
export const getAllAttendance = async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance`);
      return response.data;
    } catch (error) {
      console.error("Error fetching attendance:", error);
      throw error;
    }
  };


  export const getAllAttendanceByClass = async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance/class`);
      return response.data;
    } catch (error) {
      console.error("Error fetching attendance:", error);
      throw error;
    }
  };



  export const getAllAttendanceByStat = async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance/stat`);
      return response.data;
    } catch (error) {
      console.error("Error fetching attendance:", error);
      throw error;
    }
  };