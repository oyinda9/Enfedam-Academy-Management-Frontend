import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003/teachers";

interface ParentFormData {
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
}

export const createParent = async ( parentData: ParentFormData) => {
  try {
    const token = localStorage.getItem("token");
    console.log("Using token:", token); // Debugging line

    if (!token) throw new Error("Unauthorized: No token provided");

    const response = await axios.post(`${API_URL}/parents`, parentData, {
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
