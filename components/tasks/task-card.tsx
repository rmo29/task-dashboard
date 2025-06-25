// components/tasks/task-card.tsx
"use client";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types";
import { format } from "date-fns";
import { CheckCircle2 } from "lucide-react";
import { useTaskStore } from "@/lib/store/task-store";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const { updateTask, fetchTasks, deleteTask } = useTaskStore();
  const [completing, setCompleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const supabase = createClient();
  const [projectName, setProjectName] = useState<string>("");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchProjectName() {
      if (!task.project_id) return;
      const { data } = await supabase
        .from("projects")
        .select("name")
        .eq("id", task.project_id)
        .single();
      if (isMounted && data?.name) setProjectName(data.name);
    }
    fetchProjectName();
    return () => {
      isMounted = false;
    };
  }, [task.project_id, supabase]);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 8px 32px 0 rgba(99,102,241,0.15)",
      }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-grab active:cursor-grabbing transition-all duration-300 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="mb-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-blue-100 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-base text-indigo-700 dark:text-indigo-200 font-serif truncate max-w-[70%]">
            {task.title}
          </h4>
          <Badge
            className={
              priorityColors[task.priority] +
              " px-3 py-1 rounded-full text-xs font-semibold capitalize shadow-sm"
            }
          >
            {task.priority}
          </Badge>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <button
                className="ml-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                title="Delete Task"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteOpen(true);
                }}
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Task</DialogTitle>
              </DialogHeader>
              <p className="mb-4 text-gray-600">
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>
              {deleteError ? (
                <p className="text-red-500 mb-2">{deleteError}</p>
              ) : (
                void 0
              )}
              <div className="flex gap-3 justify-end mt-6">
                <button
                  className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                  onClick={() => setDeleteOpen(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md hover:from-red-600 hover:to-pink-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={async () => {
                    setDeleting(true);
                    setDeleteError(null);
                    const { error } = await supabase
                      .from("tasks")
                      .delete()
                      .eq("id", task.id);
                    setDeleting(false);
                    if (error) {
                      setDeleteError(error.message);
                    } else {
                      setDeleteOpen(false);
                      deleteTask(task.id);
                      fetchTasks && fetchTasks();
                    }
                  }}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-3 mb-2 text-xs text-gray-500 font-medium">
          {projectName && (
            <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-200 px-2 py-0.5 rounded-full font-semibold truncate max-w-[50%]">
              {projectName}
            </span>
          )}
          {task.assignee && (
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-200 px-2 py-0.5 rounded-full font-semibold truncate max-w-[50%]">
              {task.assignee}
            </span>
          )}
        </div>
        {task.description ? (
          <p className="text-xs text-muted-foreground mb-2 font-sans line-clamp-2">
            {task.description}
          </p>
        ) : (
          void 0
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          {task.due_date && (
            <span className="font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
              {format(new Date(task.due_date), "MMM dd")}
            </span>
          )}
        </div>
        {task.status !== "done" && (
          <button
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-white font-semibold shadow-md hover:from-green-500 hover:to-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={completing}
            onClick={async () => {
              setCompleting(true);
              await supabase
                .from("tasks")
                .update({ status: "done" })
                .eq("id", task.id);
              updateTask(task.id, { status: "done" });
              setCompleting(false);
              fetchTasks && fetchTasks();
            }}
          >
            <CheckCircle2 className="w-5 h-5" />
            {completing ? "Completing..." : "Mark as Done"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
