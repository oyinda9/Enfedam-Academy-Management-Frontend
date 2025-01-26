"use client";

import React, { useState } from "react";
import { View, Trash2, Plus, X } from "lucide-react";
import TeacherForm from "./forms/TeacherForm";

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data: unknown;
  id?: number;
}) => {
  const size =
    type === "create" ? "w-8 h-8" : type === "update" ? "w-7 h-7" : "w-6 h-6";
  const bgColor =
    type === "create"
      ? "bg-green-200"
      : type === "update"
      ? "bg-blue-200"
      : "bg-red-200";

  let icon;
  if (type === "create") {
    icon = <Plus className="w-6 h-6" />;
  } else if (type === "update") {
    icon = <View className="w-4 h-4" />;
  } else if (type === "delete") {
    icon = <Trash2 className="w-4 h-4" />;
  }

  const [open, setOpen] = useState(false);

  const Form =()=>{
    return type === "delete" && id ?(
        <form action="" className="p-4 flex flex-col gap-4">
            <span className="text-center font-medium">All Date will be lost , Are you sure you want to delete this item {table} ?</span>
            <button className="bg-red-700 text-white px-4 py-2 rounded-md border-none w-max self-center">Delete</button>
        </form>
    ) : (
        <TeacherForm type="create"/>
    )
  };

  return (
    <div>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        {icon}
      </button>

      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-[rgba(0,0,0,0.6)] z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            {/* Modal content */}
            <div>
            <Form/>
            </div>
            {/* Close button */}
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)} // Close the modal
            >
              <X width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormModal;
