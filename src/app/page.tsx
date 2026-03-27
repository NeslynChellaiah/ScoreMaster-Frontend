"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // POST /api/auth/login → { success, message, statusCode, data: { username, role } }
      const res = await api.post("/api/auth/login", { username, password });
      setUser({ username: res.data.data.username, role: res.data.data.role });
      router.push("/home");
    } catch {
      toast.error("Invalid username or password. Please try again.", {
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* LEFT DIV: Hidden on small, 50% on medium (2/4), 75% on large (3/4) */}
      <div className="hidden md:flex lg:col-span-2 items-center justify-center secondary-text">
        <h1>placeholder for illustration</h1>
      </div>

      {/* RIGHT DIV: 100% on small, 50% on medium (2/4), 25% on large (1/4) */}
      <div className="col-span-1 lg:col-span-2 flex items-center justify-center bg-layer-1 border-color">
        <div className="text-center mb-8 w-80">
          <h1 className="text-3xl font-bold">ScoreMaster</h1>
          <p className="secondary-text text-sm mt-1 mb-2">Sign in to your account</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 text-left">
              <label className="block w-full text-xs font-semibold">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full primary-bg border-color rounded-xl px-4 py-3 text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block w-full text-xs font-semibold">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full primary-bg border-color rounded-xl px-4 py-3 text-sm outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-click-to-action opacity-90 black-text hover:opacity-100 font-bold py-3.5 rounded-xl cursor-pointer text-sm tracking-wide transition-opacity mt-2 disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
