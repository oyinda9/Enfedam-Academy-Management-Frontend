"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Droplet,
  CalendarFold,
  Mail,
  Phone,
  School,
  Plus,
  Minus,
  BookOpen,
} from "lucide-react";
import BigCalendar from "@/components/BigCalendar";
import Announcements from "@/components/Announcements";
import FormModal from "@/components/FormModal";
import TeacherPerfomance from "@/components/TeacherPerfomance";
import { getTeacherById } from "@/services/teacherServices";

const SingleTeacherPage = () => {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const imageLoader = ({ src }: { src: string }) => {
    return src.startsWith("http") ? src : "/enfedam-logo.png";
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A"; // Handle invalid dates
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (id) {
      getTeacherById(id as string)
        .then((data) => {
          console.log("Fetched teacher data:", data); // Debugging output
          setTeacher(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch teacher details:", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!teacher) return <p>Teacher not found.</p>;

  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* LEFT SECTION */}
      <div className="w-full xl:w-2/3">
        {/* TOP ROW: User Info and Performance */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-blue-100 py-4 px-4 rounded-md flex gap-4 flex-1">
            {/* PROFILE IMAGE */}
            <div className="w-1/3">
              <Image
                loader={imageLoader}
                src={teacher.img || "/enfedam-logo.png"}
                alt="Teacher profile"
                width={144}
                height={144}
                className="w-20 h-20 rounded-full object-cover border-black border-2"
              />
            </div>

            {/* USER DETAILS */}
            <div className="w-[100%] flex flex-col justify-between gap-4">
              <div className="flex">
                <h1 className="text-xl font-semibold">
                  {teacher.name} {teacher.surname}
                </h1>
                <div className="flex items-center font-semibold gap-4 ml-auto">
                  <FormModal table="teacher" type="update" data={teacher} />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {teacher.bio || "No biography available."}
              </p>

              {/* SMALL INFO GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                <div className="flex flex-col space-y-3">
                  {/* Blood Type */}
                  <div className="flex items-center gap-3">
                    <Droplet width={16} height={16} />
                    <span>{teacher.bloodtype || "N/A"}</span>
                  </div>

                  {/* Birthday */}
                  <div className="flex items-center gap-3">
                    <CalendarFold width={16} height={16} />
                    <span>{formatDate(teacher.birthday) || "N/A"}</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <Phone width={16} height={16} />
                    <span>{teacher.phone || "N/A"}</span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <Mail width={16} height={16} />
                    <span>{teacher.email || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PERFORMANCE CARD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 text-xs font-medium">
            {/* Attendance */}
            {/* <div className="flex items-center justify-between bg-white p-2 rounded-md">
              <div className="flex items-center gap-3">
                <div className="bg-blue-200 p-2 rounded-full">
                  <CheckCircle className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Attendance
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {teacher.attendance || "N/A"}%
                </span>
              </div>
            </div> */}

            {/* Lessons */}
            {/* <div className="flex items-center justify-between bg-white p-2 rounded-md">
              <div className="flex items-center gap-3">
                <div className="bg-green-200 p-2 rounded-full">
                  <BookOpen className="text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Lessons
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {teacher.lessons || "N/A"}
              </span>
            </div> */}
          </div>
        </div>

        {/* SCHEDULE SECTION */}
        <div className="p-4 rounded-md h-[800px]">
          <h2 className="text-lg font-semibold mb-2">
            Teacher&apos;s Schedule
          </h2>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full xl:w-1/3 rounded-md mb-6">
        {/* Classes (Fixed) */}

        <div className="flex flex-col bg-white border-gray-400 border-2 mb-4 p-4 rounded-md h-auto">
          <div className="flex items-center justify-between">
            {/* Icon and Title */}
            <div className="flex items-center gap-3">
              <div className="bg-yellow-200 p-2 rounded-full">
                <School className="text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Classes</span>
            </div>

            {/* Class Count & Toggle Button */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">
                {Array.isArray(teacher.classes) ? teacher.classes.length : 0}{" "}
                Classes
              </span>
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-gray-700"
              >
                {showAll ? <Minus size={18} /> : <Plus size={18} />}
              </button>
            </div>
          </div>
          {/* Class List */}
          <div className="mt-2 text-sm font-semibold text-gray-900">
            {Array.isArray(teacher.classes) && teacher.classes.length > 0 ? (
              showAll ? (
                <ul className="list-disc pl-4">
                  {teacher.classes.map((cls) => (
                    <li key={cls.id}>{cls.name}</li>
                  ))}
                </ul>
              ) : (
                teacher.classes
                  .slice(0, 0)
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .map((cls: { name: any }) => cls.name)
                  .join(", ")
              )
            ) : (
              "N/A"
            )}
          </div>
        </div>
        {/* Lessons */}
        <div className="flex items-center justify-between bg-white  border-gray-400 border-2 p-2 py-4 rounded-md mb-4 ">
          <div className="flex items-center gap-3">
            <div className="bg-green-200 p-2 rounded-full">
              <BookOpen className="text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Lessons</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {teacher.lessons || "N/A"}
          </span>
        </div>

        <TeacherPerfomance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
