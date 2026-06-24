"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading session info...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <p className="text-slate-600 font-bold mb-2">Redirecting to Sign In...</p>
        <p className="text-sm text-slate-400">Please wait while we redirect you.</p>
      </div>
    );
  }

  const { user } = session;

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-orange-500/25 mb-4 text-white text-3xl font-black">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Account details</h1>
        <p className="text-slate-500">Manage your Eat Quick profile and orders</p>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span>👤</span> Profile Information
        </h2>
        
        <div className="space-y-4">
          <div className="flex justify-between border-b border-slate-50 pb-4">
            <span className="text-slate-400 font-medium">Name</span>
            <span className="text-slate-800 font-bold">{user.name}</span>
          </div>
          <div className="flex justify-between border-b border-slate-50 pb-4">
            <span className="text-slate-400 font-medium">Email Address</span>
            <span className="text-slate-800 font-bold">{user.email}</span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="text-slate-400 font-medium">Member Since</span>
            <span className="text-slate-800 font-semibold">
              {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/make-your-own-salad"
          className="px-8 py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white rounded-xl font-bold transition text-center shadow-md shadow-orange-500/25"
        >
          Create a New Salad 🥗
        </Link>
        <button
          onClick={handleSignOut}
          className="px-8 py-3.5 border-2 border-slate-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50/50 text-slate-600 rounded-xl font-bold transition text-center"
        >
          Sign Out 🚪
        </button>
      </div>
    </div>
  );
}
