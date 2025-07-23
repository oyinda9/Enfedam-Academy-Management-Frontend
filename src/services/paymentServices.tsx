/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://enfedam-backend.onrender.com";

export const uploadReceipt = async (
  file: File,
  studentId: string,
  parentId: string
): Promise<any> => {
  if (!file) throw new Error("File is required");
  if (!studentId) throw new Error("Student ID is required");
  if (!parentId) throw new Error("Parent ID is required");

  const formData = new FormData();
  formData.append("receipt", file);
  formData.append("studentId", studentId);
  formData.append("parentId", parentId);

  try {
    const response = await axios.post(
      `${API_URL}/payment/upload-receipt`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    // Better error message parsing
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to upload receipt");
    }
  }
};

export const verifyPayment = async (paymentId: string): Promise<any> => {
  try {
    const response = await axios.patch(`${API_URL}/payment/verify/${paymentId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to verify payment");
  }
};

export const getPaymentSummary = async (): Promise<{
  fullyPaid: any[];
  awaitingVerification: any[];
  notPaid: any[];
}> => {
  try {
    const response = await axios.get(`${API_URL}/payment/summary`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch payment summary"
    );
  }
};

export const ParentHistory = async (parentId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/payment/history/${parentId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to verify payment");
  }
};
