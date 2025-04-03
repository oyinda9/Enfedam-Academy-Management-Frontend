import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEvents } from "@/services/eventsServices";

// Define Zod Schema
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

// Define Form Type
type FormData = z.infer<typeof schema>;

const EventsForm = ({ type = "create",data }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: data || {},
      });
      
  const onSubmit = async (FormData) => {
    try {
      await createEvents(FormData);
      alert("Event created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create event");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          {...register("title")}
          className="w-full p-2 border rounded-md"
        />
        {errors.title && (
          <p className="text-red-500 text-xs">{errors.title.message}</p>
        )}
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          className="w-full p-2 border rounded-md"
        />
        {errors.description && (
          <p className="text-red-500 text-xs">{errors.description.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : type === "create" ? "Create Event" : "Update Event"}
      </button>
    </form>
  );
};

export default EventsForm;
