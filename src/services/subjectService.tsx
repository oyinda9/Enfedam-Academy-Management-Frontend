/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003/";

interface SubjectFormData {
    name: string;
  }

  export const createSubject = async (SubjectData: SubjectFormData) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Using token:", token); // Debugging line
  
      if (!token) throw new Error("Unauthorized: No token provided");
  
      const response = await axios.post(`${API_URL}/subject`, SubjectData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      return response.data;
    } catch (error: any) {
      console.error("Error creating teacher:", error?.response?.data || error);
      throw new Error(
        error?.response?.data?.message || "Failed to create subject"
      );
    }
  };
  
export const getAllsubject = async () => {
    try {
      const response = await axios.get(`${API_URL}/subject`);
      return response.data;
    } catch (error) {
      console.error("Error fetching subject:", error);
      throw error;
    }
  };
  