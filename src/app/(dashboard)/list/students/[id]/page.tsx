"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Droplet, CalendarFold, Mail, Phone, School } from "lucide-react";
import { FaChalkboardTeacher } from "react-icons/fa";
import BigCalendar from "@/components/BigCalendar";
import Announcements from "@/components/Announcements";
import Link from "next/link";
import { getStudentById } from "@/services/studentService";

const SingleStudentPage = () => {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const imageLoader = ({ src }: { src: string }) => {
    return src.startsWith("http") ? src : "/enfedam-logo.png";
  };
  useEffect(() => {
    if (id) {
      getStudentById(id as string)
        .then((data) => {
          setStudent(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch student details:", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <p>Loading student details...</p>;
  if (!student) return <p>No student data available.</p>;

  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* LEFT SECTION */}
      <div className="w-full xl:w-2/3">
        {/* TOP ROW: User Info and Performance */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-blue-100 py-6 px-4 rounded-md flex gap-4 flex-1">
            {/* PROFILE IMAGE */}
            <div className="w-1/3">
              <Image
                loader={imageLoader}
                src={student.img || "/enfedam-logo.png"}
                alt={student.name}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full border-black border-2 object-cover"
              />
            </div>

            {/* USER DETAILS */}
            <div className="w-[90%] flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">
                {student.username} {student.name} {student.surname}
              </h1>
              <p className="text-sm text-gray-500">
                {" "}
                Address: {student.address}
              </p>

              {/* SMALL INFO GRID */}
              <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <Droplet width={16} height={16} />
                  <span> Bloodtype :{student.bloodType || "N/A"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarFold width={16} height={16} />
                  <span>
                    {" "}
                    Birthday:
                    {new Date(student.birthday).toLocaleDateString("en-GB")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone width={16} height={16} />
                  <span> Phone: {student.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail width={16} height={16} />
                  <span> Email:{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarFold width={16} height={16} />
                  <span className=" text-gray-900">
                    {" "}
                    Date Joined :
                    {new Date(student.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <School width={16} height={16} />
                  <span className=" text-gray-900">
                    {" "}
                    Class:
                    {student.class?.name || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SCHEDULE SECTION */}
        <div className="p-4 rounded-md h-[800px]">
          <h2 className="text-lg font-semibold mb-2">
            Student&apos;s Schedule
          </h2>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full xl:w-1/3 rounded-md mb-6">
        <div className="bg-white p-4 rounded-md">
          <h1>Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-sm text-gray-800">
            <Link
              className="p-3 rounded-md bg-pink-200"
              href={`/list/teachers/${student.class.supervisorId}`}
            >
              Student&apos;s Teachers
            </Link>
            <Link
              className="p-3 rounded-md bg-yellow-200"
              href={`/list/classes/${student.class.id}`}
            >
              Student&apos;s class
            </Link>
            <Link
              className="p-3 rounded-md bg-purple-200"
              href={`/list/exams?classId=${student.classId}`}
            >
              Student&apos;s Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-green-200"
              href={`/list/assignments?classId=${student.classId}`}
            >
              Student&apos;s Assignments
            </Link>
            <Link
              className="p-3 rounded-md bg-blue-200"
              href={`/list/results?studentId=${student.id}`}
            >
              Student&apos;s Results
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow-md">
          <h1 className="text-lg font-semibold text-gray-700 mb-4">
            Parent Details
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-black">
            <div className="flex items-center gap-2 bg-pink-100 px-4 py-2 rounded-md">
              <span className="font-medium">Name:</span>
              <span className="font-semibold">{student.parent.name}</span>
            </div>

            <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-md">
              <span className="font-medium">Surname:</span>
              <span className="font-semibold">{student.parent.surname}</span>
            </div>

            <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-md">
              <span className="font-medium">Email:</span>
              <span className="font-semibold">{student.parent.email}</span>
            </div>

            <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-md">
              <span className="font-medium">Phone:</span>
              <span className="font-semibold">{student.parent.phone}</span>
            </div>

            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-md col-span-1 sm:col-span-2">
              <span className="font-medium">Address:</span>
              <span className="font-semibold">{student.parent.address}</span>
            </div>
          </div>
        </div>

        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
