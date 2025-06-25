// components/projects/project-form.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectInput } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Palette, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function ProjectForm({ onSuccess }: { onSuccess: () => void }) {
  const supabase = createClient();
  const { register, handleSubmit, formState } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (values: ProjectInput) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("projects").insert({ ...values, user_id: user.id });
    onSuccess();
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-blue-100 dark:border-gray-800 rounded-2xl shadow-lg p-8 max-w-md mx-auto animate-fade-in-up">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="relative">
          <input
            {...register("name")}
            placeholder=" "
            className="peer block w-full rounded-xl border border-gray-300 bg-white/60 px-4 pt-5 pb-2 text-base text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.10)] focus:scale-[1.03] transition placeholder-transparent focus:placeholder-gray-400 shadow-sm"
            autoComplete="off"
            aria-label="Project Name"
          />
          <label className="pointer-events-none absolute left-4 top-2 text-gray-400 text-sm font-medium transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm flex items-center gap-1">
            <FileText className="w-4 h-4 text-indigo-300" /> Project Name
          </label>
        </div>
        <div className="relative">
          <Textarea
            {...register("description")}
            placeholder="Project description (optional)"
            className="block w-full rounded-xl border border-gray-300 bg-white/60 px-4 pt-4 pb-2 text-base text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.10)] focus:scale-[1.03] transition shadow-sm min-h-[80px] resize-none"
            aria-label="Project Description"
          />
        </div>
        <div className="relative flex items-center gap-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-300" /> Color
          </label>
          <input
            {...register("color")}
            type="color"
            className="w-10 h-10 rounded-lg border border-blue-100 shadow-inner cursor-pointer transition-all"
            aria-label="Project Color"
          />
        </div>
        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 shadow-lg rounded-xl flex items-center justify-center gap-2 relative overflow-hidden ripple focus:scale-[0.98] focus:shadow-[0_0_12px_2px_rgba(99,102,241,0.25)] active:scale-[0.97]"
        >
          Create Project
        </Button>
      </form>
    </div>
  );
}
