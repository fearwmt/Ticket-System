"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

type FormData = {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

export default function CreateTicketPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      await api.post("/tickets", data);
      setStatus("success");
      reset();

      setTimeout(() => {
        router.push("/tickets");
      }, 1200);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setStatus("error");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 font-[Inter] px-4 overflow-hidden">
      {/* Floating background bubbles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute w-28 h-28 bg-pink-300 rounded-full opacity-30 animate-bounce top-10 left-12"></div>
        <div className="absolute w-36 h-36 bg-purple-300 rounded-full opacity-20 animate-pulse top-1/3 right-10"></div>
       <div className="absolute w-20 h-20 bg-pink-200 rounded-full opacity-40 animate-[float_7s_ease-in-out_infinite] bottom-20 left-1/4"></div>

      </div>

      {/* Card */}
      <div className="relative z-10 p-8 max-w-lg w-full bg-white rounded-2xl shadow-xl border border-pink-100">
        <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          ➕ Create Ticket
        </h1>

        {/* Alerts */}
        {status === "success" && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 border border-green-200 text-sm font-medium">
             Ticket created successfully! Redirecting...
          </div>
        )}
        {status === "error" && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 border border-red-200 text-sm font-medium">
            ❌ Failed to create ticket. Please try again.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-1">
              Title
            </label>
            <input
              placeholder="Enter ticket title"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 characters",
                },
                maxLength: {
                  value: 255,
                  message: "Title must not exceed 255 characters",
                },
              })}
              className="border border-pink-200 px-3 py-2 rounded-lg w-full 
                         focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:outline-none
                         text-gray-900 placeholder:text-gray-400 shadow-sm"
              disabled={status === "loading"}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter ticket description"
              {...register("description", {
                required: "Description is required",
                maxLength: {
                  value: 5000,
                  message: "Description must not exceed 5000 characters",
                },
              })}
              rows={4}
              className="border border-pink-200 px-3 py-2 rounded-lg w-full 
                         focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:outline-none
                         text-gray-900 placeholder:text-gray-400 shadow-sm"
              disabled={status === "loading"}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-1">
              Priority
            </label>
            <select
              {...register("priority", { required: "Priority is required" })}
              className="border border-pink-200 px-3 py-2 rounded-lg w-full 
                         focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:outline-none
                         text-gray-900 shadow-sm"
              disabled={status === "loading"}
            >
              <option value="">-- Select Priority --</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">
                {errors.priority.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 
                       text-white font-semibold px-4 py-2 rounded-lg shadow-md 
                       disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Creating...
              </>
            ) : (
              "Create Ticket"
            )}
          </button>
        </form>

        {/* Skeleton loader */}
        {status === "loading" && (
          <div className="mt-6 space-y-2 animate-pulse">
            <div className="h-4 bg-pink-200 rounded w-1/3"></div>
            <div className="h-4 bg-pink-200 rounded w-1/2"></div>
            <div className="h-4 bg-pink-200 rounded w-1/4"></div>
          </div>
        )}
      </div>


    </div>
  );
}
