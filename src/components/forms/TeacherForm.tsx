"use client";
import { z } from "zod";
import React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "username must be at least 3 characters long!!" })
    .max(20, { message: "username must be at least 20 characters long!!" }),
  email: z.string().email({message:"Invalid email address!"}),
  password:z.string().min(8, { message: "Password must be at least 8 characters long!!" }),
  firstName:z.string().min(1, { message: "First name is required " }),
  lastName:z.string().min(1, { message: "last name is required " }),
  phone:z.string().min(1, { message: "phone is required " }),
  address:z.string().min(1, { message: "address  is required " }),
  birthday:z.string().min(1, { message: "bithday is required " }),
  sex:z.enum(["male", "female"], { message: "sex  is required " }),
  img:z.instanceof(File ,{ message: "Image  is required " })
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
    const onSubmit= handleSubmit(data=>{})
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
     <h1 className="text-xl font-semibold">CREATE NEW TEACHER</h1>
     <span className="text-xs text-gray-700 font-medium">Authentication Information</span>
     <label > Username</label>
     <input type="text" {...register("username")}  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm "/>
    <p className="text-xs text-red-600"> {errors.username?.message && <p>{errors.username?.message.toString()}</p>}</p>
     <span className="text-xs text-gray-700 font-medium">Personal Information</span>
     <button className="bg-blue-700 text-white p-2 rounded-md">{type==="create"? "Create":"Update"}</button>
    </form>
  );
};

export default TeacherForm;
