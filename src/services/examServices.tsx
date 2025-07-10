/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const createResult = async (resultData: {
  examScore: number;
  studentId: string;
  subjectId: number;
  assignment?: number;
  classwork?: number;
  midterm?: number;
  attendance?: number;
}) => {
  try {
    const token = localStorage.getItem("token");
    console.log("Using token:", token); // Debugging line

    if (!token) throw new Error("Unauthorized: No token provided");

    const response = await axios.post(`${API_URL}/results`, resultData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "application/json", // Optional: axios sets this by default
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating Result:", error?.response?.data || error);
    throw new Error(
      error?.response?.data?.message || "Failed to create result"
    );
  }
};



export const getAllResultByStudentId = async (studentId: string) => {
  try {
    const response = await axios.get(`${API_URL}/results/studentid/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student results:", error);
    throw error;
  }
};


export const getAllResult= async () => {
  try {
    const response = await axios.get(`${API_URL}/results`);
    return response.data;
  } catch (error) {
    console.error("Error fetching result:", error);
    throw error;
  }
};


export const getAllCummulativeResult= async () => {
  try {
    const response = await axios.get(`${API_URL}/results/results/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching result:", error);
    throw error;
  }
};


export const getAllCummulativeResultForOneStudent = async (studentId: string) => {
  try {
    const response = await axios.get(`${API_URL}/results/results/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student results:", error);
    throw error;
  }
};
