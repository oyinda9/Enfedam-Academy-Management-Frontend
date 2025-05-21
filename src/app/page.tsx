"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import authService from "../services/authServices";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

// Validation Schema
const loginSchema = z
  .object({
    identifier: z.string().min(3, "Enter your email or username"),
    passwordOrSurname: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.identifier.includes("@") && !data.passwordOrSurname) {
        return false;
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
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoginError(null);
      const passwordOrSurname = data.passwordOrSurname ?? "";
      const response = await authService.login(data.identifier, passwordOrSurname);

      toast.success(response.message, { position: "top-right", autoClose: 3000 });

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response));
      }

      const roleRoutes: Record<string, string> = {
        ADMIN: "/admin",
        TEACHER: "/teacher",
        STUDENT: "/student",
        USER: "/parent",
      };

      if (roleRoutes[response.role]) {
        router.push(roleRoutes[response.role]);
      } else {
        setLoginError("Unauthorized role");
      }
    } catch (error: any) {
      setLoginError(error.response?.data?.error || "Invalid credentials. Please try again.");
      toast.error("Login failed. Please try again.", { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/enfedam.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Centered form container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <ToastContainer />

        <div className="bg-white bg-opacity-95 shadow-xl rounded-xl p-10 max-w-md w-full backdrop-blur-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/enfedam-logo.png"
              alt="Login Illustration"
              width={120}
              height={140}
              className="rounded-full shadow-md"
            />
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-6">
            Welcome Back
          </h2>

          {/* Info text */}
          <p className="mb-6 text-center text-sm text-gray-600 italic leading-relaxed">
            Admins should log in with{" "}
            <span className="font-semibold text-gray-800">username and password</span>.
            <br />
            Parents, Teachers, and Students should log in with{" "}
            <span className="font-semibold text-gray-800">email and surname</span>.
          </p>

          {/* Error message example */}
          {/* {loginError && (
            <p className="text-red-600 text-center mb-4 font-medium">{loginError}</p>
          )} */}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Identifier */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-gray-700 font-semibold mb-2"
              >
                Email / Username
              </label>
              <input
                id="identifier"
                type="text"
                {...register("identifier")}
                placeholder="Enter email or username"
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition ${
                  errors.identifier
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
              )}
            </div>

            {/* Password / Surname with eye icon */}
            <div className="relative">
              <label
                htmlFor="passwordOrSurname"
                className="block text-gray-700 font-semibold mb-2"
              >
                Password / Surname
              </label>
              <input
                id="passwordOrSurname"
                type={showPassword ? "text" : "password"}
                {...register("passwordOrSurname")}
                placeholder="Enter your password or surname"
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition ${
                  errors.passwordOrSurname
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 bottom-0  text-gray-500 hover:text-gray-800 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
              </button>
              {errors.passwordOrSurname && (
                <p className="text-red-500 text-sm mt-1">{errors.passwordOrSurname.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg disabled:bg-gray-400 transition"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
