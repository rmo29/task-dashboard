"use client";
import { createClient } from "@/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/projects");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/80 via-white/80 to-indigo-100/80 p-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-blue-100 dark:border-gray-800 rounded-3xl shadow-2xl p-10 animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 font-serif tracking-tight mb-2 text-center">
          Sign in to TaskDash
        </h2>
        <p className="text-gray-500 mb-6 text-base text-center font-light">
          Welcome back! Sign in to access your dashboard and manage your
          projects.
        </p>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          redirectTo={
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback`
              : ""
          }
          providers={[]}
        />
      </div>
    </div>
  );
}
