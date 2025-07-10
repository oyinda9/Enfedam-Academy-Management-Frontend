import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const getFullReport = async () => {
  try {
    const response = await axios.get(`${API_URL}/report/full`);
    return response.data;
  } catch (error) {
    console.error("Error fetching full report:", error);
    throw error;
  }
};