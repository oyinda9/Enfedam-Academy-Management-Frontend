import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClass } from "@/services/classServices";
import { getAllTeachers } from "@/services/teacherServices";
import { toast, ToastContainer } from "react-toastify";
import { Loader2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

// Define Zod Schema
const schema = z.object({
  name: z.string().min(1, "Class name is required"),
  capacity: z.coerce.number().min(1, "Capacity must be a positive number"),
  supervisorId: z.string().min(1, "Supervisor is required"),
});

// Define Form Type
type FormData = z.infer<typeof schema>;

const ClassForm = ({ type = "create", data }) => {
  
  const [loading, setLoading] = useState(false);
  const [supervisors, setSupervisors] = useState<
    { id: string; name: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  // Fetch teachers on component mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getAllTeachers();
        setSupervisors(data);
      } catch (error) {
        toast.error("Failed to load teachers");
        console.error("Failed to load teachers", error);
      }
    };

    fetchTeachers();
  }, []);

  // Form Submission Handler
  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const result = await createClass({
        name: formData.name!,
        capacity: formData.capacity!,
        supervisorId: formData.supervisorId!,
      });
      toast.success("Class created successfully!");
      
      console.log("Class created:", result);
    } catch (error) {
      toast.error("Failed to create class.");
      console.error("Error creating class:", error);
    } finally {
      setLoading(false);
    }
   
  };

  return (
    <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
      <ToastContainer />
      <h1 className="text-xl font-semibold mb-6">
        {type === "create" ? "CREATE NEW CLASS" : "UPDATE CLASS"}
      </h1>

      {/* Class Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Class Name
        </label>
        <input
          type="text"
          {...register("name")}
          className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-red-600">{errors.name?.message}</p>
      </div>

      {/* Capacity */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Capacity
        </label>
        <input
          type="number"
          {...register("capacity", { valueAsNumber: true })}
          className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-red-600">{errors.capacity?.message}</p>
      </div>

      {/* Supervisor Dropdown */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Supervisor
        </label>
        <select
          {...register("supervisorId")}
          className="ring-1 ring-gray-600 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Supervisor</option>
          {supervisors.length > 0 ? (
            supervisors.map((supervisor) => (
              <option key={supervisor.id} value={supervisor.id}>
                {supervisor.name}
              </option>
            ))
          ) : (
            <option disabled>No supervisors available</option>
          )}
        </select>
        <p className="text-xs text-red-600">
          {errors.supervisorId?.message}
        </p>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className="bg-blue-700 text-white p-3 rounded-md hover:bg-blue-800 w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              {type === "create" ? "Creating..." : "Updating..."}
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

export default ClassForm;
