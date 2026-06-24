"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";

interface ActionState {
  error: string | null;
}

export default function SignUpPage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (!name || !email || !password || !confirmPassword) {
        return { error: "Please fill in all fields" };
      }

      if (password.length < 6) {
        return { error: "Password must be at least 6 characters" };
      }

      if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
      }

      const res = await signUp.email({
        name,
        email,
        password,
      });

      if (res.error) {
        return { error: res.error.message || "Something went wrong, try again" };
      }

      router.push("/account");
      return { error: null };
    },
    { error: null }
  );

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-extrabold mb-2 text-center bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-center text-slate-500 mb-8 text-sm">
          Join Eat Quick to customize and save your favorite recipes.
        </p>

        {state.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-800 placeholder-slate-400 text-sm"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-800 placeholder-slate-400 text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-800 placeholder-slate-400 text-sm"
              placeholder="•••••••• (min. 6 characters)"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-800 placeholder-slate-400 text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold py-3 rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-orange-600 hover:text-orange-700 font-bold transition">
            Sign In
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-orange-600 transition">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
