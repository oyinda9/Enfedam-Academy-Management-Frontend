"use client";
import { z } from "zod";
import React from "react";
import { CloudUpload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {createParent} from "@/services/parentService";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username cannot exceed 20 characters!" }),
  name: z.string().min(1, { message: "Name is required!" }),
  surname: z.string().min(1, { message: "Surname is required!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  phone: z.string().min(1, { message: "Phone number is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
 
});

const ParentForm = ({type= "create" ,data}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const response = await createParent(formData);
      console.log("Parent created successfully:", response);
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., show an error message)
    }
  });
  

  return (
    <form className="p-6" onSubmit={onSubmit}>
      {/* Title */}
      <h1 className="text-xl font-semibold mb-6">
        {type === "create" ? "CREATE NEW PARENT" : "UPDATE PARENT"}
      </h1>

      {/* Section: Personal Information */}
      <p className="text-lg font-medium mb-4">Personal Information</p>
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            {...register("username")}
            className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-red-600">{errors.username?.message?.toString()}</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register("name")}
            className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-red-600">{errors.name?.message?.toString()}</p>
        </div>

        {/* Surname */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Surname</label>
          <input
            type="text"
            {...register("surname")}
            className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-red-600">{errors.surname?.message?.toString()}</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-red-600">{errors.email?.message?.toString()}</p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            {...register("phone")}
            className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-red-600">{errors.phone?.message?.toString()}</p>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            {...register("address")}
            className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-red-600">{errors.address?.message?.toString()}</p>
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Image (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="file"
              {...register("img")}
              className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <CloudUpload className="rounded-md" />
          </div>
          <p className="text-xs text-red-600">{errors.img?.message?.toString()}</p>
        </div>
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

export default ParentForm;
