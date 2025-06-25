// components/dashboard/header.tsx
"use client";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-center px-10 py-5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-xl border-b border-blue-100 dark:border-gray-800 rounded-b-3xl transition-all duration-300">
      <Link
        href="/"
        className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 font-serif tracking-tight"
      >
        TaskDash
      </Link>
    </header>
  );
}
