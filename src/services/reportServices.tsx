import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://enfedam-backend.onrender.com";
export const getFullReport = async () => {
  try {
    const response = await axios.get(`${API_URL}/report/full`);
    return response.data;
  } catch (error) {
    console.error("Error fetching full report:", error);
    throw error;
  }
};