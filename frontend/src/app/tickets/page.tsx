"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";

type Ticket = {
  id: number;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
};

type ApiResponse = {
  data: Ticket[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    status: "",
    priority: "",
    search: "",
    page: 1,
    pageSize: 5,
    sortBy: "id",
    sortOrder: "ASC" as "ASC" | "DESC",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse>("/tickets", { params: filter });
      setTickets(res.data.data);
      setTotalPages(res.data.totalPages);
      setError("");
    } catch (err: any) {
      console.error("❌ Fetch error:", err);
      setError("Failed to fetch tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const CustomSelect = ({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: string | number;
    options: { label: string; value: string | number }[];
    onChange: (val: string | number) => void;
  }) => (
    <div className="relative">
      <button
        onClick={() =>
          setOpenDropdown(openDropdown === label ? null : label)
        }
        className="w-full flex justify-between items-center border border-pink-200 px-3 py-2.5 rounded-lg bg-white text-sm sm:text-base font-medium shadow-sm hover:shadow-md transition focus:ring-2 focus:ring-pink-300"
      >
        {options.find((o) => o.value === value)?.label || label}
        <ChevronDown className="h-4 w-4 text-pink-500" />
      </button>

      {openDropdown === label && (
        <div className="absolute mt-2 w-full bg-white border border-pink-200 rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpenDropdown(null);
              }}
              className={`px-3 py-2 text-sm sm:text-base cursor-pointer hover:bg-pink-50 transition ${
                opt.value === value ? "bg-pink-100 font-semibold" : ""
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 text-gray-900 font-[Inter]">
      {/* Snow effect */}
      <div className="snow pointer-events-none absolute inset-0 z-0"></div>

      {/* Floating bubbles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute w-20 h-20 bg-pink-200 rounded-full opacity-40 animate-bounce top-10 left-10"></div>
        <div className="absolute w-28 h-28 bg-purple-200 rounded-full opacity-30 animate-pulse top-40 right-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
            🎤 Ticket System
          </h1>
          <Link
            href="/tickets/create"
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-5 py-2.5 rounded-lg shadow-md transition text-center font-semibold"
          >
            + Create Ticket
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-md border border-pink-100">
          <h2 className="text-base sm:text-lg font-semibold text-pink-600 mb-4">
            🔍 Filters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <CustomSelect
              label="Status"
              value={filter.status}
              options={[
                { label: "All Status", value: "" },
                { label: "OPEN", value: "OPEN" },
                { label: "IN PROGRESS", value: "IN_PROGRESS" },
                { label: "RESOLVED", value: "RESOLVED" },
              ]}
              onChange={(val) =>
                setFilter({ ...filter, status: String(val), page: 1 })
              }
            />

            <CustomSelect
              label="Priority"
              value={filter.priority}
              options={[
                { label: "All Priority", value: "" },
                { label: "LOW", value: "LOW" },
                { label: "MEDIUM", value: "MEDIUM" },
                { label: "HIGH", value: "HIGH" },
              ]}
              onChange={(val) =>
                setFilter({ ...filter, priority: String(val), page: 1 })
              }
            />

            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-pink-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                value={filter.search}
                onChange={(e) =>
                  setFilter({ ...filter, search: e.target.value, page: 1 })
                }
                className="w-full border border-pink-200 pl-9 pr-3 py-2.5 rounded-lg focus:ring-2 focus:ring-pink-300 text-sm sm:text-base bg-white shadow-sm"
              />
            </div>

            <CustomSelect
              label="Sort By"
              value={filter.sortBy}
              options={[
                { label: "ID", value: "id" },
                { label: "Title", value: "title" },
                { label: "Priority", value: "priority" },
                { label: "Status", value: "status" },
              ]}
              onChange={(val) => setFilter({ ...filter, sortBy: String(val) })}
            />

            <CustomSelect
              label="Sort Order"
              value={filter.sortOrder}
              options={[
                { label: "Ascending", value: "ASC" },
                { label: "Descending", value: "DESC" },
              ]}
              onChange={(val) =>
                setFilter({ ...filter, sortOrder: val as "ASC" | "DESC" })
              }
            />

            <CustomSelect
              label="Page Size"
              value={filter.pageSize}
              options={[
                { label: "5 / page", value: 5 },
                { label: "10 / page", value: 10 },
                { label: "20 / page", value: 20 },
              ]}
              onChange={(val) =>
                setFilter({ ...filter, pageSize: Number(val), page: 1 })
              }
            />
          </div>
        </div>

        {/* Table */}
        {!loading && !error && tickets.length > 0 && (
          <div>
            <div className="overflow-hidden rounded-2xl shadow border border-pink-100 bg-white">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {tickets.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition"
                    >
                      <td className="p-4 font-medium">{t.id}</td>
                      <td className="p-4">
                        <Link
                          href={`/tickets/${t.id}`}
                          className="text-pink-600 font-semibold underline hover:text-purple-600"
                        >
                          {t.title}
                        </Link>
                      </td>
                      <td className="p-4">{t.priority}</td>
                      <td className="p-4">{t.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-8">
              <button
                disabled={filter.page === 1}
                onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
                className="px-5 py-2 bg-gradient-to-r from-pink-200 to-purple-200 text-pink-800 rounded-full disabled:opacity-50 hover:from-pink-300 hover:to-purple-300 transition font-medium"
              >
                ⬅ Prev
              </button>
              <span className="text-pink-800 font-semibold">
                Page {filter.page} of {totalPages}
              </span>
              <button
                disabled={filter.page === totalPages}
                onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
                className="px-5 py-2 bg-gradient-to-r from-pink-200 to-purple-200 text-pink-800 rounded-full disabled:opacity-50 hover:from-pink-300 hover:to-purple-300 transition font-medium"
              >
                Next ➡
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes snow {
          0% {
            transform: translateY(-10px) translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(40px);
            opacity: 0;
          }
        }
        .snow::before,
        .snow::after {
          content: "";
          position: absolute;
          top: -10px;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(
              rgba(255, 192, 203, 0.9) 1px,
              transparent 1px
            ),
            radial-gradient(rgba(216, 191, 255, 0.7) 1px, transparent 1px);
          background-size: 20px 20px, 30px 30px;
          animation: snow 12s linear infinite;
        }
        .snow::after {
          animation-duration: 20s;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
