"use client";
import { z } from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username cannot exceed 20 characters!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  birthday: z.string().min(1, { message: "Birthday is required!" }),
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  img: z.instanceof(File, { message: "Image is required!" }),
});

const TeacherForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data); // Handle form submission logic
  });

  return (
    <form className="p-6" onSubmit={onSubmit}>
    {/* Title */}
    <h1 className="text-xl font-semibold mb-6">
      CREATE NEW TEACHER
    </h1>
  
    {/* Section: Authentication Information */}
    <p className="text-lg font-medium mb-4">Authentication Information</p>
    <div className="grid grid-cols-3 gap-6 mb-6">
      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          {...register("username")}
          className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-red-600">
          {errors.username?.message?.toString()}
        </p>
      </div>
  
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-red-600">
          {errors.email?.message?.toString()}
        </p>
      </div>
  
      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          {...register("password")}
          className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-red-600">
          {errors.password?.message?.toString()}
        </p>
      </div>
    </div>
  
    {/* Section: Personal Information */}
    <p className="text-lg font-medium mb-4">Personal Information</p>
    <div className="grid grid-cols-3 gap-6 mb-6">
      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">First Name</label>
        <input
          type="text"
          {...register("firstName")}
          className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-red-600">
          {errors.firstName?.message?.toString()}
        </p>
      </div>
  
      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Last Name</label>
        <input
          type="text"
          {...register("lastName")}
          className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-red-600">
          {errors.lastName?.message?.toString()}
        </p>
      </div>
  
      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          {...register("phone")}
          className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-red-600">
          {errors.phone?.message?.toString()}
        </p>
      </div>
  
      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          {...register("address")}
          className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-red-600">
          {errors.address?.message?.toString()}
        </p>
      </div>
  
      {/* Birthday */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Birthday</label>
        <input
          type="date"
          {...register("birthday")}
          className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-red-600">
          {errors.birthday?.message?.toString()}
        </p>
      </div>
  
      {/* Sex */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Sex</label>
        <select
          {...register("sex")}
          className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <p className="text-xs text-red-600">
          {errors.sex?.message?.toString()}
        </p>
      </div>
    </div>
  
    {/* Profile Image */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700">Profile Image</label>
      <input
        type="file"
        {...register("img")}
        className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-red-600">
        {errors.img?.message?.toString()}
      </p>
    </div>
  
    {/* Submit Button */}
    <div>
      <button
        type="submit"
        className="bg-blue-700 text-white p-3 rounded-md hover:bg-blue-800 w-full"
      >
        {type === "create" ? "Create" : "Update"}
      </button>
    </div>
  </form>
  
  );
};

export default TeacherForm;
