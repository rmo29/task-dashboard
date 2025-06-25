"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/80 via-white/80 to-indigo-100/80 p-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-blue-100 dark:border-gray-800 rounded-3xl shadow-2xl p-10 animate-fade-in-up flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 dark:text-indigo-300 font-serif tracking-tight mb-4 text-center">
          Welcome to TaskDash
        </h1>
        <p className="text-gray-500 mb-8 text-lg text-center font-light">
          Manage your projects and tasks with clarity and style.
          <br />
          Sign in or create an account to get started.
        </p>
        <div className="flex flex-col gap-4 w-full">
          <Link href="/auth/login" passHref legacyBehavior>
            <button className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 shadow-lg rounded-xl flex items-center justify-center gap-2 relative overflow-hidden ripple focus:scale-[0.98] focus:shadow-[0_0_12px_2px_rgba(99,102,241,0.25)] active:scale-[0.97]">
              Login with Email
            </button>
          </Link>
          <Link href="/auth/signup" passHref legacyBehavior>
            <button className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 transition-all duration-200 shadow-lg rounded-xl flex items-center justify-center gap-2 relative overflow-hidden ripple focus:scale-[0.98] focus:shadow-[0_0_12px_2px_rgba(34,197,94,0.25)] active:scale-[0.97]">
              Sign Up with Email
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
