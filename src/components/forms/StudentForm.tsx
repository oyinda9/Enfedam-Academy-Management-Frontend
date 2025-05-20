import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CloudUpload } from "lucide-react";
import { getAllclass } from "@/services/classServices";
import { getAllsubject } from "@/services/subjectService";
import { getAllParent } from "@/services/parentService";
import { createStudent } from "@/services/studentService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Define validation schema with Zod
const schema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  name: z.string().min(1),
  surname: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  bloodType: z.string().min(1),
  birthday: z.string().min(1),
  sex: z.enum(["MALE", "FEMALE"]),
  classId: z.number(),
  parentId: z.string(),
  subjectIds: z.array(z.number()).optional(),
  lessonIds: z.array(z.number()).optional(),
  img: z.instanceof(FileList).optional(),
});

const StudentForm = ({ type, data }) => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [parents, setParents] = useState([]);
  const [lessons, setLessons] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  // Setup react-hook-form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  // Fetch classes, subjects, and parents data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [classesData, subjectsData, parentsData] = await Promise.all([
          getAllclass(),
          getAllsubject(),
          getAllParent(),
        ]);
        setClasses(classesData);
        setSubjects(subjectsData);
        setParents(parentsData);
        setLessons([
          { id: 1, name: "Math Lesson" },
          { id: 2, name: "Science Lesson" },
          { id: 3, name: "History Lesson" },
        ]); // Dummy lesson data
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle form submission
  const onSubmit = handleSubmit(async (formData) => {
    try {
      const studentData = {
        ...formData,
        img: formData.img?.[0] || null,
      };

      const result = await createStudent(studentData);
      console.log("Student created:", result);
      toast.success("Student created successfully!");
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error("Failed to create student.");
    }
  });

  return (
    <form className="p-6  h-[600px]  space-y-6" onSubmit={onSubmit}>
       <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
      <h1 className="text-2xl font-bold text-gray-800 sticky top-0 bg-white z-10 pb-4">
        {type === "create" ? "Create New Student" : "Update Student"}
      </h1>

      {/* Section: Personal Info */}
      <div className="space-y-4 border border-gray-200 p-4 rounded-md">
        <h2 className="text-lg font-semibold text-gray-700">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputField
            label="Username"
            name="username"
            register={register}
            errors={errors}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            register={register}
            errors={errors}
          />
          <InputField
            label="Phone"
            name="phone"
            register={register}
            errors={errors}
          />
          <InputField
            label="First Name"
            name="name"
            register={register}
            errors={errors}
          />
          <InputField
            label="Last Name"
            name="surname"
            register={register}
            errors={errors}
          />
          <InputField
            label="Address"
            name="address"
            register={register}
            errors={errors}
          />
          <InputField
            label="Birthday"
            name="birthday"
            type="date"
            register={register}
            errors={errors}
          />
        </div>
      </div>

      {/* Section: Academic Info */}
      <div className="space-y-4 border border-gray-200 p-4 rounded-md">
        <h2 className="text-lg font-semibold text-gray-700">
          Academic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectField
            label="Class"
            name="classId"
            options={classes}
            register={register}
            errors={errors}
            isNumber={true}
          />
          <MultiSelectField
            label="Subjects"
            name="subjectIds"
            options={subjects}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
          <MultiSelectField
            label="Lessons"
            name="lessonIds"
            options={lessons}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
        </div>
      </div>

      {/* Section: Other Info */}
      <div className="space-y-4 border border-gray-200 p-4 rounded-md">
        <h2 className="text-lg font-semibold text-gray-700">Other Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectField
            label="Sex"
            name="sex"
            options={[
              { id: "MALE", name: "Male" },
              { id: "FEMALE", name: "Female" },
            ]}
            register={register}
            errors={errors}
            isNumber={false}
          />
          <SelectField
            label="Blood Type"
            name="bloodType"
            options={[
              { id: "A+", name: "A+" },
              { id: "A-", name: "A-" },
              { id: "B+", name: "B+" },
              { id: "B-", name: "B-" },
              { id: "O+", name: "O+" },
              { id: "O-", name: "O-" },
              { id: "AB+", name: "AB+" },
              { id: "AB-", name: "AB-" },
            ]}
            register={register}
            errors={errors}
            isNumber={false}
          />
          <SelectField
            label="Parent"
            name="parentId"
            options={parents}
            register={register}
            errors={errors}
          />
        </div>
      </div>

      {/* Section: Image Upload */}
      <div className="space-y-2 border border-gray-200 p-4 rounded-md">
        <label className="block text-sm font-medium text-gray-700">
          Profile Image
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            {...register("img")}
            className="border border-gray-300 py-2 px-3 rounded-md"
          />
          <CloudUpload className="w-6 h-6 text-gray-600" />
        </div>
        <ErrorMessage errors={errors} name="img" />

           {/* Submit Button */}
      
      </div>
      <div className="w-[500px] mb-6">
        <button
          type="submit"
          className=" mb-6 px-4 py-2 bg-blue-700 text-white text-lg font-medium  rounded-md hover:bg-blue-800 transition-colors"
        >
          {type === "create" ? "Create" : "Update"}
        </button>
      </div>
   
    </form>
  );
};

// Input Field Component
const InputField = ({ label, name, type = "text", register, errors }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      {...register(name)}
      className="form-input border border-black py-2 rounded-md px-2 w-[150px] gap-4"
    />
    <ErrorMessage errors={errors} name={name} />
  </div>
);

// Select Field Component
const SelectField = ({
  label,
  name,
  options,
  register,
  errors,
  isNumber = false,
}) => (
  <div>
    <label className="text-sm font-medium text-gray-700 flex flex-col space-y-1">
      {label}
    </label>
    <select
      {...register(name, isNumber ? { valueAsNumber: true } : {})}
      className="form-input border border-black py-2 rounded-md px-2 w-[150px] gap-4"
    >
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
    <ErrorMessage errors={errors} name={name} />
  </div>
);

// Multi-Select Field Component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MultiSelectField = ({
  label,
  name,
  options,
  register,
  setValue,
  watch,
  errors,
}) => {
  const selectedValues = watch(name) || [];

  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        multiple
        value={selectedValues}
        onChange={(e) =>
          setValue(
            name,
            Array.from(e.target.selectedOptions, (o) => Number(o.value))
          )
        }
        className="form-input border border-black py-2 rounded-md px-2"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <ErrorMessage errors={errors} name={name} />
    </div>
  );
};

const ErrorMessage = ({ errors, name }) =>
  errors[name] ? (
    <p className="text-xs text-red-600">{errors[name]?.message}</p>
  ) : null;

export default StudentForm;
