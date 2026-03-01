import React, { useState, useEffect } from "react";
import {
  Heart,
  Sparkles,
  TrendingUp,
  Loader2,
  Timer,
} from "lucide-react";
import { auraService } from "../services/auraService";
import { motion } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MoodEntry } from "../types";

export const MoodSupport: React.FC = () => {
  const [mood, setMood] = useState(5);

  const [encouragement, setEncouragement] = useState("");
  const [encouragementLoading, setEncouragementLoading] = useState(false);

  const [supportData, setSupportData] = useState<any>(null);
  const [supportLoading, setSupportLoading] = useState(false);

  const [resetTimer, setResetTimer] = useState(0);

  const [history, setHistory] = useState<MoodEntry[]>([
    { date: "Mon", score: 6 },
    { date: "Tue", score: 4 },
    { date: "Wed", score: 7 },
    { date: "Thu", score: 5 },
    { date: "Fri", score: 8 },
  ]);

  // 🔹 Load saved mood history on first render
  useEffect(() => {
    const savedMood = localStorage.getItem("moodHistory");
    if (savedMood) {
      setHistory(JSON.parse(savedMood));
    }
  }, []);

  // 🔹 Save mood history whenever it changes
  useEffect(() => {
    localStorage.setItem("moodHistory", JSON.stringify(history));
  }, [history]);

  // ---------------- ENCOURAGEMENT ----------------
  const handleMoodSubmit = async () => {
    setEncouragementLoading(true);
    try {
      const msg = await auraService.getMoodEncouragement(mood);
      setEncouragement(msg);

      const today = new Date().toLocaleDateString("en-US", {
        weekday: "short",
      });

      setHistory((prev) => [
        ...prev.slice(-4),
        { date: today, score: mood },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setEncouragementLoading(false);
    }
  };

  // ---------------- STRUCTURED SUPPORT ----------------
  const handleStructuredSupport = async () => {
    setSupportLoading(true);
    try {
      const result = await auraService.getMoodSupport(mood);
      setSupportData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setSupportLoading(false);
    }
  };

  // ---------------- RESET TIMER ----------------
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (resetTimer > 0) {
      interval = setInterval(() => {
        setResetTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resetTimer]);

  const startResetTimer = () => {
    setResetTimer(300); // 5 minutes
  };

  const weeklyAverage =
    history.reduce((sum, item) => sum + item.score, 0) /
    history.length;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
          <Heart size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">
            Mood & Stress Support
          </h2>
          <p className="text-zinc-500 text-sm">
            Mental well-being matters
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 flex flex-col">
          <h3 className="text-lg font-semibold mb-6">
            How are you feeling today?
          </h3>

          <div className="space-y-8">
            <div className="flex justify-between text-4xl">
              <span>😔</span>
              <span>😐</span>
              <span>😊</span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) =>
                setMood(parseInt(e.target.value))
              }
              className="w-full h-3 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />

            <div className="flex justify-between text-sm font-medium text-zinc-400">
              <span>1 - Struggling</span>
              <span>10 - Amazing</span>
            </div>

            <button
              onClick={handleMoodSubmit}
              disabled={encouragementLoading}
              className="w-full py-4 bg-rose-500 text-white rounded-2xl font-semibold hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
            >
              {encouragementLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Sparkles size={20} />
              )}
              Get Encouragement
            </button>

            <button
              onClick={handleStructuredSupport}
              disabled={supportLoading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              {supportLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Heart size={20} />
              )}
              Get Support Plan
            </button>
          </div>

          {encouragement && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-rose-50 rounded-2xl border border-rose-100"
            >
              <p className="text-rose-900 italic">
                "{encouragement}"
              </p>
            </motion.div>
          )}

          {supportData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-6 bg-indigo-50 rounded-2xl border border-indigo-100"
            >
              <h4 className="font-semibold text-indigo-800">
                Personalized Support
              </h4>

              <p className="mt-2 text-indigo-900">
                {supportData.message}
              </p>

              <div className="mt-4 p-4 bg-white rounded-xl border">
                <p className="font-medium">
                  Suggested Activity:
                </p>
                <p>{supportData.suggestedActivity}</p>
                <p className="text-sm text-gray-500">
                  Duration: {supportData.duration}
                </p>
              </div>

              <button
                onClick={startResetTimer}
                className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2"
              >
                <Timer size={18} />
                Start 5-Minute Reset
              </button>

              {resetTimer > 0 && (
                <div className="mt-4 text-center text-indigo-700 font-semibold">
                  ⏳ {Math.floor(resetTimer / 60)}:
                  {String(resetTimer % 60).padStart(2, "0")}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* RIGHT SIDE - CHART */}
        <div className="bg-zinc-900 rounded-3xl p-8 shadow-xl text-white">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="text-rose-400" />
              Mood Trends
            </h3>
            <span className="text-xs px-3 py-1 bg-zinc-800 rounded-full text-zinc-400">
              Last 5 Days
            </span>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 10]} stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#fb7185"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-800 rounded-2xl">
              <p className="text-zinc-500 text-xs uppercase font-bold mb-1">
                Weekly Avg
              </p>
              <p className="text-2xl font-bold">
                {weeklyAverage.toFixed(1)}
              </p>
            </div>
            <div className="p-4 bg-zinc-800 rounded-2xl">
              <p className="text-zinc-500 text-xs uppercase font-bold mb-1">
                Status
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                Stable
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};