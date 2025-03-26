"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import authService from "../services/authServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Validation Schema (Handles Admin vs. Other Users)
const loginSchema = z
  .object({
    identifier: z.string().min(3, "Enter your email or username"),
    passwordOrSurname: z.string().optional(), // Optional for non-admins
  })
  .refine(
    (data) => {
      if (!data.identifier.includes("@") && !data.passwordOrSurname) {
        return false; // If not an email and password is missing → Invalid
      }
      return true;
    },
    {
      message: "Password is required for Admin login",
      path: ["passwordOrSurname"],
    }
  );

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    console.log("onSubmit function started", data);
    try {
      setLoginError(null);
      const passwordOrSurname = data.passwordOrSurname ?? "";

      console.log("Before API Call");
      const response = await authService.login(
        data.identifier,
        passwordOrSurname
      );
      console.log("API Response:", response);

      // ✅ Toast Success Notification
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.log("After Toast:", response.message);

      if (typeof window !== "undefined") {
        console.log("Saving to localStorage:", JSON.stringify(response));
        localStorage.setItem("user", JSON.stringify(response));
        console.log("Stored user data:", localStorage.getItem("user"));
      } else {
        console.warn("localStorage is not available");
      }

      const { role } = response;
      console.log("User role:", role);

      const roleRoutes: Record<string, string> = {
        ADMIN: "/admin",
        TEACHER: "/teacher",
        STUDENT: "/student",
        USER: "/parent",
      };

      if (roleRoutes[role]) {
        console.log("Redirecting to:", roleRoutes[role]);
        router.push(roleRoutes[role]);
      } else {
        setLoginError("Unauthorized role");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginError(
        error.response?.data?.error || "Invalid credentials. Please try again."
      );

      toast.error("Login failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer /> {/* Ensure ToastContainer is present */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Login
        </h2>

        {loginError && (
          <p className="text-red-500 text-sm text-center mt-2">{loginError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          {/* Identifier Field (Email or Username) */}
          <div className="mb-4">
            <label className="block text-gray-700">Email or Username</label>
            <input
              type="text"
              {...register("identifier")}
              className="w-full p-2 border rounded-md mt-1"
              placeholder="Enter email or username"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password/Surname Field (Required for Admins, Optional for Others) */}
          <div className="mb-4">
            <label className="block text-gray-700">Password / Surname</label>
            <input
              type="password"
              {...register("passwordOrSurname")}
              className="w-full p-2 border rounded-md mt-1"
              placeholder="Enter your password or surname"
            />
            {errors.passwordOrSurname && (
              <p className="text-red-500 text-sm">
                {errors.passwordOrSurname.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
