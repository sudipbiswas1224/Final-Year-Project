import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { BookHeart, Plus, Loader2, Clock, ShieldCheck } from "lucide-react";
import dayjs from "dayjs"; // Consider installing dayjs or use native Date if you want zero deps

const Journals = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await axiosInstance.get("/journal/all");
        setJournals(res.data.data || res.data || []);
      } catch (err) {
        console.error("Failed to load journals", err);
        setError("Ensure backend /api/journal/all is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-20">
      <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-end">
        <div>
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <BookHeart size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            My Journals
          </h1>
          <p className="mt-2 text-slate-500 max-w-lg flex items-center">
            <ShieldCheck size={16} className="text-emerald-500 mr-2" />
            Your thoughts are locally encrypted before saving.
          </p>
        </div>

        <Link
          to="/journal/new"
          className="mt-6 inline-flex items-center rounded-xl bg-orange-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-orange-700 sm:mt-0"
        >
          <Plus size={20} className="mr-2" />
          New Entry
        </Link>
      </div>

      {error && (
        <p className="rounded-lg bg-orange-50 p-4 text-orange-600 text-sm font-medium">
          {error}
        </p>
      )}

      {journals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <BookHeart size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-800">
            No journals yet
          </h3>
          <p className="mt-1 text-slate-500">
            Your space is empty. Start by writing your first journal entry.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {journals.map((entry) => (
            <Link
              key={entry._id || entry.id}
              to={`/journal/${entry._id || entry.id}`}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-slate-200"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-xs font-medium text-slate-500">
                    <Clock size={14} className="mr-1" />
                    {new Date(entry.createdAt || entry.date).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </div>
                  {/* Mock Emotion Pill */}
                  {entry.emotion && (
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 capitalize">
                      {entry.emotion}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">
                  {entry.title || "Untitled Entry"}
                </h3>
                <p className="mt-2 text-sm text-slate-500 line-clamp-3">
                  {entry.content?.replace(/(<([^>]+)>)/gi, "") ||
                    "No content provided."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journals;
