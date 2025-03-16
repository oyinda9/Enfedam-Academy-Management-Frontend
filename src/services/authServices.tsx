import api from "./api";

const authService = {
  // Register a new user
  register: async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/register", { username, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Log in a user
  login: async (identifier: string, passwordOrSurname: string) => {
    try {
      const payload: any = { identifier }; // Send `identifier` for both cases

      if (identifier.includes("@")) {
        // Email login (Parent, Student, Teacher)
        payload.surname = passwordOrSurname;
      } else {
        // Admin login
        payload.password = passwordOrSurname;
      }

      // Send login request
      const response = await api.post("/auth/login", payload);
      const { token, role } = response.data;

      // Save token & role to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data?.error || "Login failed. Please try again.";
    }
  },

  // Log out the user
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  },

  // Get the current user's token
  getToken: () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null,

  // Check if the user is authenticated
  isAuthenticated: () => !!authService.getToken(),
};

export default authService;
