"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="mt-4 px-6 py-2 bg-white/50 hover:bg-white/80 border border-current text-inherit rounded-xl font-bold transition flex items-center justify-center gap-2"
    >
      {isRefreshing ? (
        <span className="animate-spin">🔄</span>
      ) : (
        <span>🔄</span>
      )}
      {isRefreshing ? "Refreshing..." : "Refresh Status"}
    </button>
  );
}
