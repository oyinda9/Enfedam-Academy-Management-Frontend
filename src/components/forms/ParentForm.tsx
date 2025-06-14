"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload } from "lucide-react";
import { createParent } from "@/services/parentService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";

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

type FormData = z.infer<typeof schema>;

interface ParentFormProps {
  type?: "create" | "update";
  data?: FormData;
  onClose?: () => void;
}

const ParentForm: React.FC<ParentFormProps> = ({ type = "create", data, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data || {
      username: "",
      name: "",
      surname: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      if (imageFile) {
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          form.append(key, value);
        });
        form.append("img", imageFile);

        const response = await createParent(form, true);
        console.log("Parent created successfully:", response);
        toast.success("Parent created successfully!");
      } else {
        const response = await createParent(formData);
        console.log("Parent created successfully:", response);
        toast.success("Parent created successfully!");
      }

      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating parent:", error);
      toast.error("Failed to create Parent");
    } finally {
      setLoading(false);
    }
  });

  return (
    <form className="p-6" onSubmit={onSubmit}>
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-xl font-semibold mb-6">
        {type === "create" ? "CREATE NEW PARENT" : "UPDATE PARENT"}
      </h1>

      <p className="text-lg font-medium mb-4">Personal Information</p>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {["username", "name", "surname", "email", "phone", "address"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              {...register(field as keyof FormData)}
              className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-red-600">{errors?.[field as keyof FormData]?.message}</p>
          </div>
        ))}

        {/* Profile Image Upload */}
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
            <p className="text-xs text-green-600 mt-2">
              Image selected: {imageFile.name}
            </p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="bg-blue-700 text-white p-3 rounded-md hover:bg-blue-800 w-full flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : type === "create" ? (
            "Create"
          ) : (
            "Update"
          )}
        </button>
      </div>
    </form>
  );
};

export default ParentForm;
