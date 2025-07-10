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
import { getAllclass } from "@/services/classServices";
import { getAllsubject } from "@/services/subjectService";
import { assign_classes_subjects_Teacher } from "@/services/teacherServices";

interface Class {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

interface Teacher {
  id: string;
  name: string;
  surname: string;
  img?: string;
  bio?: string;
  bloodtype?: string;
  birthday?: string;
  phone?: string;
  email?: string;
  lessons?: number;
  classes?: Class[];
  subjects?: Subject[];
}

const SingleTeacherPage = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  const imageLoader = ({ src }: { src: string }) => {
    return src.startsWith("http") ? src : "/enfedam-logo.png";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (id) {
      getTeacherById(id as string)
        .then((data) => {
          setTeacher(data);
          setSelectedClasses(data.classes?.map((cls: Class) => cls.id) || []);
          setSelectedSubjects(
            data.subjects?.map((subject: Subject) => subject.id) || []
          );
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch teacher details:", error);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    const fetchClassesAndSubjects = async () => {
      try {
        const [classesData, subjectsData] = await Promise.all([
          getAllclass(),
          getAllsubject(),
        ]);
        setClasses(classesData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };
    fetchClassesAndSubjects();
  }, []);

  const handleAssignClassesSubjects = async () => {
    setIsAssigning(true);
    try {
      const response = await assign_classes_subjects_Teacher({
        teacherId: id as string,
        classes: selectedClasses.map(Number),
        subjectIds: selectedSubjects.map(Number),
      });

      if (response.success) {
        const updatedTeacher = await getTeacherById(id as string);
        setTeacher(updatedTeacher);
        setSelectedClasses(
          updatedTeacher.classes?.map((cls: Class) => cls.id) || []
        );
        setSelectedSubjects(
          updatedTeacher.subjects?.map((subject: Subject) => subject.id) || []
        );
        alert("Classes and subjects assigned successfully!");
      } else {
        alert(`Assignment failed: ${response.message}`);
      }
    } catch (error) {
      console.error("Failed to assign classes/subjects:", error);
      alert("Failed to assign classes and subjects. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

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
                  <div className="flex items-center gap-3">
                    <Droplet width={16} height={16} />
                    <span>{teacher.bloodtype || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarFold width={16} height={16} />
                    <span>{formatDate(teacher.birthday) || "N/A"}</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone width={16} height={16} />
                    <span>{teacher.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail width={16} height={16} />
                    <span>{teacher.email || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

  
        
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full xl:w-1/3 rounded-md mb-6">
        {/* Classes (Fixed) */}
        <div className="flex flex-col bg-white border-gray-400 border-2 mb-4 p-4 rounded-md h-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-200 p-2 rounded-full">
                <School className="text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Classes</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">
                {teacher.classes?.length || 0} Classes
              </span>
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-gray-700"
              >
                {showAll ? <Minus size={18} /> : <Plus size={18} />}
              </button>
            </div>
          </div>
          <div className="mt-2 text-sm font-semibold text-gray-900">
            {teacher.classes && teacher.classes.length > 0 ? (
              showAll ? (
                <ul className="list-disc pl-4">
                  {teacher.classes.map((cls) => (
                    <li key={cls.id}>{cls.name}</li>
                  ))}
                </ul>
              ) : (
                teacher.classes
                  .slice(0, 3)
                  .map((cls) => cls.name)
                  .join(", ")
              )
            ) : (
              "N/A"
            )}
          </div>
        </div>

        {/* Classes and Subjects Assignment */}
        <div className="bg-white border-gray-400 border-2 p-4 rounded-md mb-4">
          <h2 className="text-lg font-semibold mb-4">
            Assign Classes and Subjects
          </h2>

          {/* Class Selection */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700">Classes</h3>
            <div className="mt-2 space-y-2">
              {classes.map((cls) => (
                <label
                  key={cls.id}
                  className="flex items-center gap-3 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={cls.id}
                    checked={selectedClasses.includes(cls.id)}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setSelectedClasses((prev) =>
                        e.target.checked
                          ? [...prev, value]
                          : prev.filter((id) => id !== value)
                      );
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span>{cls.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subject Selection */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700">Subjects</h3>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700">Subjects</h3>
              <div className="mt-2 space-y-2">
                {Array.isArray(subjects) &&
                  subjects.map((subject) => (
                    <label
                      key={subject.id}
                      className="flex items-center gap-3 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={subject.id}
                        checked={selectedSubjects.includes(subject.id)}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setSelectedSubjects((prev) =>
                            e.target.checked
                              ? [...prev, value]
                              : prev.filter((id) => id !== value)
                          );
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span>{subject.name}</span>
                    </label>
                  ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleAssignClassesSubjects}
              className="bg-blue-500 text-white p-2 rounded-md"
              disabled={isAssigning}
            >
              {isAssigning ? "Assigning..." : "Assign"}
            </button>
          </div>
        </div>

        {/* Lessons */}
        <div className="flex items-center justify-between bg-white border-gray-400 border-2 p-2 py-4 rounded-md mb-4">
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
