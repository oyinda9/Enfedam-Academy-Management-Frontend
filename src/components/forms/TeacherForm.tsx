"use client";
import { z } from "zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTeacher } from "@/services/teacherServices";

// Validation Schema
const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters!"),
  name: z.string().min(1, "First name is required!"),
  surname: z.string().min(1, "Surname is required!"),
  email: z.string().email("Invalid email address!"),
  phone: z
    .string()
    .regex(
      /^\+234[789][01]\d{8}$|^0[789][01]\d{8}$/,
      "Invalid Nigerian phone number!"
    ),
  address: z.string().min(1, "Address is required!"),
  bloodType: z.string().min(1, "Blood type is required!"),
  sex: z.enum(["MALE", "FEMALE"], { message: "Select a valid gender!" }),
  birthday: z.string().min(1, "Birthday is required!"),
  subjectIds: z.array(z.number()).min(1, "Select at least one subject!"),
  lessonIds: z.array(z.number()).min(1, "Select at least one lesson!"),
  classIds: z.array(z.number()).min(1, "Select at least one class!"),
  img: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const TeacherForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      name: "",
      surname: "",
      email: "",
      phone: "",
      address: "",
      bloodType: "",
      sex: undefined,
      birthday: "",
      subjectIds: [],
      lessonIds: [],
      classIds: [],
      img: "",
    },
  });

  const [preview, setPreview] = useState<string | null>(null);

  // Handle form submission
  const onSubmit = handleSubmit(async (formData) => {
    try {
      const result = await createTeacher(formData);
      alert("Teacher created successfully!");
    } catch (error) {
      alert("Failed to create teacher.");
    }
  });

  // Handle Image Upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setValue("img", imageUrl);
    }
  };

  // Handle Multi-Select Inputs
  const handleMultiSelect = (
    event: React.ChangeEvent<HTMLSelectElement>,
    field: keyof FormData
  ) => {
    const values = Array.from(event.target.selectedOptions).map((opt) =>
      Number(opt.value)
    );
    setValue(field, values);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-[600px] h-[400px] mx-auto p-4 bg-gray-50 shadow-md rounded-lg overflow-y-auto"
    >
      <h1 className="text-xl font-bold mb-4 text-center text-gray-800">
        Register Teacher
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Username", name: "username" },
          { label: "Email", name: "email" },
          { label: "First Name", name: "name" },
          { label: "Surname", name: "surname" },
          { label: "Phone", name: "phone" },
          { label: "Address", name: "address" },
          { label: "Blood Type", name: "bloodType" },
          { label: "Birthday", name: "birthday", type: "date" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="block text-xs font-medium text-gray-600">
              {label}
            </label>
            <input
              type={type}
              {...register(name as keyof FormData)}
              className="border p-2 w-full rounded text-gray-700"
            />
            <p className="text-red-600 text-xs">{errors[name]?.message}</p>
          </div>
        ))}

        <div>
          <label className="block text-xs font-medium text-gray-600">Sex</label>
          <select
            {...register("sex")}
            className="border p-2 w-full rounded text-gray-700"
          >
            <option value="">Select</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <p className="text-red-600 text-xs">{errors.sex?.message}</p>
        </div>
      </div>

      {/* Multi-Select Inputs for Numbers */}
      <div className="grid grid-cols-3 gap-4 mt-4 h-[500px]">
        {[
          { label: "Subjects", name: "subjectIds", options: { 1: "Math" } },
          { label: "Lessons", name: "lessonIds", options: { 1: "Lesson 1" } },
          { label: "Classes", name: "classIds", options: { 1: "Class A" } },
        ].map(({ label, name, options }) => (
          <div key={name}>
            <label className="block text-xs font-medium text-gray-600">
              {label}
            </label>
            <select
              multiple
              className="border p-2 w-full rounded text-gray-700"
              onChange={(e) => handleMultiSelect(e, name as keyof FormData)}
            >
              {Object.entries(options).map(([value, text]) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
            <p className="text-red-600 text-xs">{errors[name]?.message}</p>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">
          Profile Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 w-full rounded text-gray-700"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-14 h-14 mt-2 rounded-full"
          />
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 mt-4"
      >
        Register Teacher
      </button>
    </form>
  );
};

export default TeacherForm;
