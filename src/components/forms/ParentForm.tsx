"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload } from "lucide-react";
import { createParent } from "@/services/parentService";

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

interface ParentFormProps {
  type?: "create" | "update";
  data?: {
    username: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
  };
}

const ParentForm: React.FC<ParentFormProps> = ({ type = "create", data }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {}, // Use default values if `data` exists
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const fullData = { ...formData };

      if (imageFile) {
        // If your backend expects multipart/form-data
        const form = new FormData();
        for (const key in fullData) {
          form.append(key, fullData[key]);
        }
        form.append("img", imageFile);  // Append image file if it exists

        // Send FormData when an image is attached
        const response = await createParent(form, true); // pass 'true' to indicate FormData
        console.log("Parent created successfully:", response);
        alert("Parent created successfully!");
      } else {
        // Send plain JSON data when no image is attached
        const response = await createParent(fullData);
        console.log("Parent created successfully:", response);
        alert("Parent created successfully!");
      }
    } catch (error) {
      console.error("Error creating parent:", error);
      alert("Failed to create parent!");
    }
  });

  return (
    <form className="p-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold mb-6">
        {type === "create" ? "CREATE NEW PARENT" : "UPDATE PARENT"}
      </h1>

      <p className="text-lg font-medium mb-4">Personal Information</p>
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            {...register("username")}
            className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-red-600">{errors.username?.message}</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register("name")}
            className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-red-600">{errors.name?.message}</p>
        </div>

        {/* Surname */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Surname</label>
          <input
            type="text"
            {...register("surname")}
            className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-red-600">{errors.surname?.message}</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-red-600">{errors.email?.message}</p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            {...register("phone")}
            className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-red-600">{errors.phone?.message}</p>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            {...register("address")}
            className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-red-600">{errors.address?.message}</p>
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Image (Optional)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <CloudUpload className="text-gray-500" />
          </div>
          {imageFile && (
            <p className="text-xs text-green-600 mt-2">Image selected: {imageFile.name}</p>
          )}
        </div>
      </div>

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
