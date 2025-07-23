/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://enfedam-backend.onrender.com";

export const getAllStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/students/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const getStudentById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/students/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

interface StudentFormData {
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  bloodType: string;
  sex: "MALE" | "FEMALE";
  birthday: string;
  subjectIds: number[];
  lessonIds: number[];
  classIds: number[];
  img?: string;
}

export const createStudent = async (studentData: StudentFormData) => {
  try {
    const token = localStorage.getItem("token");
    console.log("Using token:", token); // Debugging line

    if (!token) throw new Error("Unauthorized: No token provided");

    const response = await axios.post(`${API_URL}/students`, studentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating Student:", error?.response?.data || error);
    throw new Error(
      error?.response?.data?.message || "Failed to create student"
    );
  }
};
