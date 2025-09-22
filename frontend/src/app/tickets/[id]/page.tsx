"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

type Ticket = {
  id: number;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
};

export default function TicketDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchTicket = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/tickets/${params.id}`);
      setTicket(res.data);
    } catch {
      setError("❌ Ticket not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  const updateStatus = async (status: Ticket["status"]) => {
    if (!ticket) return;
    try {
      await api.patch(`/tickets/${ticket.id}`, { status });
      setMessage(" Status updated");
      fetchTicket();
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("❌ Failed to update");
    }
  };

  const deleteTicket = async () => {
    if (!ticket) return;
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await api.delete(`/tickets/${ticket.id}`);
      alert("Ticket deleted successfully.");
      router.push("/tickets");
    } catch {
      alert("❌ Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 font-[Inter]">
        <div className="p-6 max-w-lg w-full bg-white rounded-2xl shadow-lg space-y-3 animate-pulse">
          <div className="h-6 bg-pink-200 rounded w-1/3"></div>
          <div className="h-4 bg-pink-200 rounded w-1/2"></div>
          <div className="h-4 bg-pink-200 rounded w-1/4"></div>
          <div className="h-4 bg-pink-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 font-[Inter]">
        <div className="p-6 max-w-lg w-full bg-white rounded-2xl shadow-lg">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 border border-red-200">
            <p>{error}</p>
            <button
              onClick={() => router.push("/tickets")}
              className="mt-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow hover:from-pink-600 hover:to-purple-600 transition"
            >
              ⬅ Back to Tickets
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 font-[Inter] px-4 overflow-hidden">
      {/* Floating bubbles */}
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
          onClick={() => router.push("/tickets")}
          className="mb-4 bg-gradient-to-r from-pink-200 to-purple-200 text-pink-800 font-medium px-4 py-2 rounded-lg hover:from-pink-300 hover:to-purple-300 transition"
        >
          ⬅ Back to Tickets
        </button>

        <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          🎟 Ticket #{ticket.id}
        </h1>

        <div className="space-y-3 text-gray-900">
          <p>
            <span className="font-semibold text-pink-700">Title:</span> {ticket.title}
          </p>
          <p>
            <span className="font-semibold text-pink-700">Description:</span>{" "}
            {ticket.description}
          </p>
          <p>
            <span className="font-semibold text-pink-700">Priority:</span>{" "}
            <span
              className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                ticket.priority === "LOW"
                  ? "bg-green-100 text-green-700"
                  : ticket.priority === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {ticket.priority}
            </span>
          </p>
          <p>
            <span className="font-semibold text-pink-700">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                ticket.status === "OPEN"
                  ? "bg-gray-100 text-gray-700"
                  : ticket.status === "IN_PROGRESS"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {ticket.status}
            </span>
          </p>
        </div>

        {/*  Action buttons */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => updateStatus("OPEN")}
            className="bg-gray-500 px-3 py-2 text-white rounded-lg hover:bg-gray-600 transition"
          >
            OPEN
          </button>
          <button
            onClick={() => updateStatus("IN_PROGRESS")}
            className="bg-yellow-500 px-3 py-2 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            IN PROGRESS
          </button>
          <button
            onClick={() => updateStatus("RESOLVED")}
            className="bg-green-600 px-3 py-2 text-white rounded-lg hover:bg-green-700 transition"
          >
            RESOLVED
          </button>

          {/*  Edit button */}
          <Link
            href={`/tickets/${ticket.id}/edit`}
            className="bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-2 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition"
          >
            ✏️ Edit
          </Link>
        </div>

        {/*  Delete button */}
        <button
          onClick={deleteTicket}
          className="bg-red-600 text-white px-4 py-2 mt-6 rounded-lg hover:bg-red-700 transition w-full"
        >
          🗑 Delete Ticket
        </button>

        {message && (
          <p
            className={`mt-3 text-center font-medium ${
              message.startsWith("") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
