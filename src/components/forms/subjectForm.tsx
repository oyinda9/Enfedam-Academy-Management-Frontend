import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSubject } from "@/services/subjectService";

// Define Zod Schema
const schema = z.object({
  name: z.string().min(1, "Subject name is required"),
});

const SubjectForm = ({ type = "create", data }) => {
  const { register, handleSubmit,formState: { errors, isSubmitting },} = useForm({ resolver: zodResolver(schema), defaultValues: data || {}, });

  const onSubmit = async (FormData) => {
    try {
      await createSubject(FormData);
      alert("Subject created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create subject");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium">Subject Name</label>
        <input
          type="text"
          {...register("name")}
          className="w-full p-2 border rounded-md"
        />
        {errors.name && (
          <p className="text-red-500 text-xs">
            {String(errors.name.message || "")}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Submitting..."
          : type === "create"
          ? "Create Subject"
          : "Update Subject"}
      </button>
    </form>
  );
};

export default SubjectForm;
