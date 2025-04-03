/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003/";

interface ClassFormData {
  name: string;
  capacity: number;
  supervisorId: string;
}

export const createClass = async (classData: ClassFormData) => {
  try {
    const token = localStorage.getItem("token");
    console.log("Using token:", token); // Debugging line

    if (!token) throw new Error("Unauthorized: No token provided");

    const response = await axios.post(`${API_URL}/class/classes/`, classData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating teacher:", error?.response?.data || error);
    throw new Error(
      error?.response?.data?.message || "Failed to create teacher"
    );
  }
};

export const getAllclass = async () => {
    try {
      const response = await axios.get(`${API_URL}/class/classes/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching class:", error);
      throw error;
    }
  };

  export const getClassById = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/class/classes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching parent:", error);
      throw error;
    }
  }