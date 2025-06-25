"use client";
import { createClient } from "@/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.push("/projects");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/projects`, // <-- Set this!
      },
    });
    if (error) setError(error.message);
    else setMessage("Check your email for a confirmation link!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/80 via-white/80 to-indigo-100/80 p-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-blue-100 dark:border-gray-800 rounded-3xl shadow-2xl p-10 animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 font-serif tracking-tight mb-2 text-center">
          Create your TaskDash account
        </h2>
        <p className="text-gray-500 mb-6 text-base text-center font-light">
          Sign up to start managing your projects and tasks with ease.
        </p>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          view="sign_up"
          providers={[]}
          redirectTo={
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback`
              : ""
          }
        />
      </div>
    </div>
  );
}
