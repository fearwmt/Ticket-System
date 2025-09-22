"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

type FormData = {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
};

export default function EditTicketPage({ params }: { params: { id: string } }) {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/tickets/${params.id}`);
        const ticket = res.data;
        reset({
          title: ticket.title,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
        });
      } catch {
        toast.error("❌ Failed to load ticket");
      }
    };
    fetchTicket();
  }, [params.id, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await toast.promise(api.patch(`/tickets/${params.id}`, data), {
        loading: "Saving...",
        success: " Ticket updated successfully",
        error: " Failed to update ticket",
      });

      setTimeout(() => {
        router.push(`/tickets/${params.id}`);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 font-[Inter] px-4 overflow-hidden">
    {/* Toaster */}
    <Toaster
      position="top-center"
      toastOptions={{
        className: "font-[Inter] text-sm font-medium",
        style: {
          background: "white",
          color: "#4B5563",
          borderRadius: "0.5rem",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
      }}
    />

      {/* Floating background bubbles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute w-28 h-28 bg-pink-300 rounded-full opacity-30 animate-bounce top-10 left-12"></div>
        <div className="absolute w-36 h-36 bg-purple-300 rounded-full opacity-20 animate-pulse top-1/3 right-10"></div>
        <div className="absolute w-20 h-20 bg-pink-200 rounded-full opacity-40 animate-float bottom-20 left-1/4"></div>
        <div className="absolute w-24 h-24 bg-purple-200 rounded-full opacity-50 animate-float-slow bottom-10 right-1/3"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 p-8 max-w-lg w-full bg-white rounded-2xl shadow-xl border border-pink-100">
        {/* Back button */}
        <button
          onClick={() => router.push(`/tickets/${params.id}`)}
          className="mb-4 bg-gradient-to-r from-pink-200 to-purple-200 text-pink-800 font-medium px-4 py-2 rounded-lg hover:from-pink-300 hover:to-purple-300 transition"
        >
          ⬅ Back to Ticket
        </button>

        {/* Title */}
        <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          ✏️ Edit Ticket #{params.id}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-1">
              Title
            </label>
            <input
              placeholder="Enter ticket title"
              {...register("title", { required: true })}
              className="border border-pink-200 px-3 py-2 rounded-lg w-full 
                         focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:outline-none 
                         text-gray-900 placeholder:text-gray-400 shadow-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter ticket description"
              {...register("description", { required: true, maxLength: 5000 })}
              rows={4}
              className="border border-pink-200 px-3 py-2 rounded-lg w-full 
                         focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:outline-none 
                         text-gray-900 placeholder:text-gray-400 shadow-sm"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-1">
              Priority
            </label>
            <select
              {...register("priority", { required: true })}
              className="border border-pink-200 px-3 py-2 rounded-lg w-full 
                         focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:outline-none 
                         text-gray-900 shadow-sm"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-1">
              Status
            </label>
            <select
              {...register("status", { required: true })}
              className="border border-pink-200 px-3 py-2 rounded-lg w-full 
                         focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:outline-none 
                         text-gray-900 shadow-sm"
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 
                       text-white px-4 py-2 rounded-lg shadow-md flex items-center justify-center gap-2 
                       disabled:opacity-50 transition font-semibold"
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
