// components/dashboard/sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Folder, ClipboardList, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/projects", icon: Folder, label: "Projects" },
  { href: "/tasks", icon: ClipboardList, label: "Tasks" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="w-64 h-screen bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-2xl border-r border-blue-100 dark:border-gray-800 rounded-tr-3xl rounded-br-3xl flex flex-col transition-all duration-300">
      <div className="p-8 pb-4">
        <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 font-serif tracking-tight">
          TaskDash
        </h2>
      </div>
      <nav className="flex flex-col px-4 py-2 gap-2 flex-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} passHref>
            <Button
              variant={pathname === href ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200
                ${
                  pathname === href
                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
                    : "hover:bg-indigo-50 dark:hover:bg-gray-800/60 hover:text-indigo-700"
                }
              `}
              style={{ fontFamily: "var(--font-sans, inherit)" }}
            >
              <Icon
                size={20}
                className={
                  pathname === href
                    ? "text-white"
                    : "text-indigo-400 group-hover:text-indigo-700"
                }
              />
              {label}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-4 pb-6">
        <div className="h-px w-full bg-gradient-to-r from-indigo-200 via-blue-100 to-pink-100 opacity-60 mb-4 rounded-full" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-base font-medium hover:bg-red-50 dark:hover:bg-gray-800/60 hover:text-red-600 transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut size={20} className="text-red-400" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
