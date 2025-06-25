"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskInput } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useRef } from "react";
import { Project } from "@/types";
import {
  CalendarDays,
  Flag,
  Clipboard,
  FileText,
  CheckCircle2,
  User,
} from "lucide-react";

export function TaskForm({
  projectId,
  onSuccess,
}: {
  projectId?: string;
  onSuccess: () => void;
}) {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      project_id: projectId || "",
      title: "",
      description: "",
      due_date: "",
      status: "todo",
      priority: "medium",
    },
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase.from("projects").select("*");
        if (error) {
          console.error("Error fetching projects:", error);
          setError(`Project fetch error: ${error.message}`);
          return;
        }
        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError(`Project fetch error: ${error}`);
      }
    };

    if (!projectId) {
      fetchProjects();
    }
  }, [projectId, supabase]);

  const onSubmit = async (values: TaskInput) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setDebugInfo("Starting submission...");
      setShowSuccess(false);

      // Check authentication first
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setError(`Authentication error: ${userError.message}`);
        setDebugInfo(`User error: ${JSON.stringify(userError)}`);
        return;
      }

      if (!user) {
        setError("User not authenticated");
        setDebugInfo("No user found");
        return;
      }

      setDebugInfo(`User authenticated: ${user.id}`);

      // Log the data being inserted
      const taskData = {
        ...values,
        user_id: user.id,
        project_id: values.project_id || projectId,
      };

      console.log("Inserting task data:", taskData);
      setDebugInfo(`Inserting: ${JSON.stringify(taskData)}`);

      // Try the insert
      const { data: newTask, error: insertError } = await supabase
        .from("tasks")
        .insert([taskData])
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        setError(
          `Insert error: ${insertError.message} (Code: ${insertError.code})`
        );
        setDebugInfo(`Full error: ${JSON.stringify(insertError)}`);

        // Check if it's an RLS error
        if (
          insertError.code === "42501" ||
          insertError.message.includes("row-level security")
        ) {
          setError(
            "RLS Policy Error: You don't have permission to insert tasks. Check your RLS policies."
          );
        }
        return;
      }

      console.log("Task inserted successfully:", newTask);
      setDebugInfo(`Success: ${JSON.stringify(newTask)}`);

      reset();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1800);
      onSuccess();
    } catch (error) {
      console.error("Unexpected error:", error);
      setError(`Unexpected error: ${error}`);
      setDebugInfo(`Catch error: ${JSON.stringify(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in-up">
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-2 font-serif tracking-tight flex items-center gap-2">
        <Clipboard className="w-8 h-8 text-indigo-400" /> Add a New Task
      </h2>
      <p className="text-gray-500 mb-8 text-lg font-light font-sans">
        Organize your work and boost productivity. Fill in the details below to
        create a new task.
      </p>
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {!projectId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            <Select
              onValueChange={(value) => setValue("project_id", value)}
              defaultValue={watch("project_id")}
            >
              <SelectTrigger className="focus:ring-2 focus:ring-indigo-300 hover:border-indigo-400 transition border-gray-300 bg-white/60">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.project_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.project_id.message}
              </p>
            )}
          </div>
        )}
        <div className="relative">
          <Input
            {...register("assignee")}
            placeholder=" "
            className="peer block w-full rounded-xl border border-gray-300 bg-white/60 px-4 pt-5 pb-2 text-base text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.10)] focus:scale-[1.03] transition placeholder-transparent focus:placeholder-gray-400 shadow-sm"
            autoComplete="off"
            aria-label="Assignee Name"
          />
          <label className="pointer-events-none absolute left-4 top-2 text-gray-400 text-sm font-medium transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm flex items-center gap-1">
            <User className="w-4 h-4 text-indigo-300" /> Assignee Name
          </label>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              {...register("title")}
              placeholder=" "
              className="peer block w-full rounded-xl border border-gray-300 bg-white/60 px-4 pt-5 pb-2 text-base text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition placeholder-transparent focus:placeholder-gray-400 shadow-sm"
              autoComplete="off"
            />
            <label className="pointer-events-none absolute left-4 top-2 text-gray-400 text-sm font-medium transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm flex items-center gap-1">
              <Clipboard className="w-4 h-4 text-indigo-300" /> Task Title
            </label>
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="flex-1 relative">
            <input
              {...register("description")}
              placeholder=" "
              className="peer block w-full rounded-xl border border-gray-300 bg-white/60 px-4 pt-5 pb-2 text-base text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition placeholder-transparent focus:placeholder-gray-400 shadow-sm"
              autoComplete="off"
            />
            <label className="pointer-events-none absolute left-4 top-2 text-gray-400 text-sm font-medium transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm flex items-center gap-1">
              <FileText className="w-4 h-4 text-indigo-300" /> Description
            </label>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              onValueChange={(value) =>
                setValue("status", value as "todo" | "in_progress" | "done")
              }
              defaultValue={watch("status")}
            >
              <SelectTrigger className="focus:ring-2 focus:ring-indigo-300 hover:border-indigo-400 transition border-gray-300 bg-white/60">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo" className="text-blue-600">
                  To Do
                </SelectItem>
                <SelectItem value="in_progress" className="text-yellow-600">
                  In Progress
                </SelectItem>
                <SelectItem value="done" className="text-green-600">
                  Done
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <Select
              onValueChange={(value) =>
                setValue("priority", value as "low" | "medium" | "high")
              }
              defaultValue={watch("priority")}
            >
              <SelectTrigger className="focus:ring-2 focus:ring-indigo-300 hover:border-indigo-400 transition border-gray-300 bg-white/60 pl-10">
                <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300 w-5 h-5 pointer-events-none" />
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low" className="text-green-600">
                  Low
                </SelectItem>
                <SelectItem value="medium" className="text-yellow-600">
                  Medium
                </SelectItem>
                <SelectItem value="high" className="text-red-600">
                  High
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">
                {errors.priority.message}
              </p>
            )}
          </div>
          <div className="flex-1 relative">
            <input
              type="date"
              {...register("due_date")}
              placeholder=" "
              className="peer block w-full rounded-xl border border-gray-300 bg-white/60 px-4 pt-5 pb-2 text-base text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition placeholder-transparent focus:placeholder-gray-400 shadow-sm"
              autoComplete="off"
            />
            <label className="pointer-events-none absolute left-4 top-2 text-gray-400 text-sm font-medium transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm flex items-center gap-1">
              <CalendarDays className="w-4 h-4 text-indigo-300" /> Due Date
            </label>
            {errors.due_date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.due_date.message}
              </p>
            )}
          </div>
        </div>
        <div className="my-6">
          <div className="h-px w-full bg-gradient-to-r from-indigo-200 via-blue-100 to-pink-100 opacity-60 rounded-full" />
        </div>
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 shadow-lg rounded-xl flex items-center justify-center gap-2 relative overflow-hidden ripple"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Adding Task...</span>
            ) : showSuccess ? (
              <span className="flex items-center gap-2 text-green-600 animate-fade-in">
                <CheckCircle2 className="w-6 h-6" /> Task Added!
              </span>
            ) : (
              <>
                <Clipboard className="w-5 h-5" /> Add Task
              </>
            )}
          </Button>
        </div>
        {/* Debug information */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md transition-all duration-300 animate-fade-in">
            <p className="text-red-700 font-medium">Error:</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {debugInfo && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md transition-all duration-300 animate-fade-in">
            <p className="text-blue-700 font-medium">Debug Info:</p>
            <p className="text-blue-600 text-sm font-mono">{debugInfo}</p>
          </div>
        )}
      </form>
    </div>
  );
}
