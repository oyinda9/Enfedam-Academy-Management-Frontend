/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003/";
interface EventsFormData {
    title: string;
    description: string;
  }
  
  export const createEvents = async (eventsData: EventsFormData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token provided");
  
      const response = await axios.post(`${API_URL}/events`, eventsData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      return response.data;
    } catch (error: any) {
      console.error("Error creating event:", error?.response?.data || error);
      throw new Error(error?.response?.data?.message || "Failed to create event");
    }
  };
  export const getAllEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  };
  