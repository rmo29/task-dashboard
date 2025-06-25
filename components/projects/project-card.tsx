// components/dashboard/project-card.tsx
"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Project } from "@/types";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProjects } from "@/hooks/use-projects";

export function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const { fetchProjects } = useProjects();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const supabase = createClient();

  return (
    <div
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-blue-100 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer flex flex-col gap-2 hover:scale-[1.03]"
      onClick={() => router.push(`/projects/${project.id}`)}
      style={{ borderColor: project.color }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-4 h-4 rounded-full"
          style={{ background: project.color }}
        />
        <span className="text-lg font-extrabold text-indigo-700 dark:text-indigo-200 font-serif tracking-tight truncate">
          {project.name}
        </span>
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <button
              className="ml-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition"
              title="Delete Project"
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
              <DialogTitle>Delete Project</DialogTitle>
            </DialogHeader>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>
            {deleteError && <p className="text-red-500 mb-2">{deleteError}</p>}
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
                onClick={async (e) => {
                  e.stopPropagation();
                  setDeleting(true);
                  setDeleteError(null);
                  const { error } = await supabase
                    .from("projects")
                    .delete()
                    .eq("id", project.id);
                  setDeleting(false);
                  if (error) {
                    setDeleteError(error.message);
                  } else {
                    setDeleteOpen(false);
                    fetchProjects && fetchProjects();
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
      <p className="text-xs text-muted-foreground mb-2 font-sans line-clamp-2">
        {project.description}
      </p>
      <div className="flex justify-between items-center mt-auto">
        <span
          className="text-[10px] uppercase tracking-wide font-semibold"
          style={{ color: project.color }}
        >
          {project.color}
        </span>
        <Button
          size="sm"
          className="rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold px-4 py-1 shadow-md hover:from-indigo-600 hover:to-blue-600 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            void router.push(`/projects/${project.id}`);
          }}
        >
          View
        </Button>
      </div>
    </div>
  );
}
