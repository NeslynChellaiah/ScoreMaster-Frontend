"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function HomePage() {
  const { user, setUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setUser(null);
      router.replace("/");
    }
  };


  // if (isLoading || !user) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-slate-950">
  //       <div className="w-10 h-10 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 h-16 bg-layer-1 border-color-bottom">
        <span className="text-lg font-bold">
          ScoreMaster
        </span>
        <div className="flex items-center gap-4">
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="border border-red-500/40 text-red-300 hover:bg-red-500/10 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
