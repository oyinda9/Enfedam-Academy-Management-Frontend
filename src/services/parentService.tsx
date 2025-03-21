import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003/teachers";

export const getAllParent = async () => {
  try {
    const response = await axios.get(`${API_URL}/parents/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching parents:", error);
    throw error;
  }
};

export const getParentById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/parents/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching parent:", error);
    throw error;
  }
};
