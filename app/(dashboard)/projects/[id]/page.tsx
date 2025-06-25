"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TaskColumn } from "@/components/tasks/task-column";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clipboard, Trash2, Plus } from "lucide-react";
import { Project, TaskStatus } from "@/types";
import { useTaskStore } from "@/lib/store/task-store";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "@/components/tasks/task-form";

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const supabase = createClient();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tasks, fetchTasks } = useTaskStore();
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      setProject(data);
      setError(error ? error.message : null);
      setLoading(false);
    }
    if (id) fetchProject();
  }, [id, supabase]);

  useEffect(() => {
    if (project?.id && fetchTasks) fetchTasks();
  }, [project?.id, fetchTasks]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  if (error || !project)
    return (
      <div className="text-red-500 text-center mt-10">Project not found.</div>
    );

  return (
    <div className="max-w-4xl mx-auto py-10 px-2 md:px-0">
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-blue-100 dark:border-gray-800 rounded-3xl shadow-2xl p-10 mb-10 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <span
              className="w-8 h-8 rounded-full border-2 border-blue-200"
              style={{ background: project?.color }}
            />
            <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-200 font-serif tracking-tight">
              {project?.name}
            </h1>
            <Badge
              className="ml-2"
              style={{ background: project?.color, color: "#fff" }}
            >
              {project?.color}
            </Badge>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Project</DialogTitle>
                </DialogHeader>
                <p className="mb-4 text-gray-600">
                  Are you sure you want to delete this project? This action
                  cannot be undone.
                </p>
                {deleteError && (
                  <p className="text-red-500 mb-2">{deleteError}</p>
                )}
                <div className="flex gap-3 justify-end mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteOpen(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      setDeleting(true);
                      setDeleteError(null);
                      const { error } = await supabase
                        .from("projects")
                        .delete()
                        .eq("id", project?.id);
                      setDeleting(false);
                      if (error) {
                        setDeleteError(error.message);
                      } else {
                        setDeleteOpen(false);
                        router.push("/projects");
                      }
                    }}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {project?.description ? (
          <p className="mt-4 text-gray-500 text-base font-light max-w-2xl">
            {project.description}
          </p>
        ) : null}
      </Card>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
            <Clipboard className="w-6 h-6 text-indigo-400" /> Tasks
          </h2>
          <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-md hover:from-indigo-600 hover:to-blue-600 transition-all">
                <Plus className="w-5 h-5" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Task</DialogTitle>
              </DialogHeader>
              <TaskForm
                projectId={project?.id}
                onSuccess={() => setAddTaskOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid md:grid-cols-3 gap-8 h-full p-4 md:p-8 bg-gradient-to-br from-blue-50/60 via-white/80 to-indigo-100/60 rounded-3xl animate-fade-in-up">
          {(["todo", "in_progress", "done"] as TaskStatus[]).map((status) => (
            <TaskColumn
              key={status}
              id={status}
              title={
                status === "todo"
                  ? "To Do"
                  : status === "in_progress"
                  ? "In Progress"
                  : "Done"
              }
              tasks={tasks.filter(
                (t) => t.project_id === project?.id && t.status === status
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
