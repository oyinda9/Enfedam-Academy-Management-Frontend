import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003/teachers";

export const getAllTeachers = async () => {
  try {
    const response = await axios.get(`${API_URL}/teachers/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const getTeacherById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/teachers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher:", error);
    throw error;
  }
};


// export const createTeacher = async (formData: any) => {

//     try {
//       const response = await axios.post(API_URL, formData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
  
//       return response.data;
//     } catch (error) {
//       console.error("Error creating teacher:", error);
//       throw error;
//     }
//   };

interface TeacherFormData {
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
//   export const createTeacher = async (teacherData: TeacherFormData) => {
//     try {
//       const response = await axios.post(`${API_URL}/teachers`, teacherData);
//       return response.data;
//     } catch (error: any) {
//       console.error("Error creating teacher:", error?.response?.data || error);
//       throw new Error(error?.response?.data?.message || "Failed to create teacher");
//     }
//   };
export const createTeacher = async (teacherData: TeacherFormData) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Using token:", token); // Debugging line
  
      if (!token) throw new Error("Unauthorized: No token provided");
  
      const response = await axios.post(`${API_URL}/teachers`, teacherData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      return response.data;
    } catch (error: any) {
      console.error("Error creating teacher:", error?.response?.data || error);
      throw new Error(error?.response?.data?.message || "Failed to create teacher");
    }
  };
  