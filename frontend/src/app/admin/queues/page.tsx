"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type QueueStats = {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
};

export default function QueuesPage() {
  const [queues] = useState(["notify", "sla"]);
  const [stats, setStats] = useState<Record<string, QueueStats>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const results: Record<string, QueueStats> = {};
      for (const q of queues) {
        const res = await api.get(`/admin/queues/${q}/stats`);
        results[q] = res.data;
      }
      setStats(results);
    } catch {
      setError("❌ Failed to load queue stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Queue Monitor</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {queues.map((q) => (
          <div key={q} className="border rounded p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">{q.toUpperCase()} Queue</h2>
            <ul className="space-y-1">
              <li>⏳ Waiting: {stats[q]?.waiting ?? 0}</li>
              <li>⚡ Active: {stats[q]?.active ?? 0}</li>
              <li>✅ Completed: {stats[q]?.completed ?? 0}</li>
              <li>❌ Failed: {stats[q]?.failed ?? 0}</li>
              <li>⏰ Delayed: {stats[q]?.delayed ?? 0}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
