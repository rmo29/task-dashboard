"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import { ProjectCard } from "../../../components/projects/project-card";
import { ProjectForm } from "../../../components/projects/project-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
  const supabase = createClient();
  type Project = {
    id: string;
    name: string;
    color: string;
    user_id: string;
    created_at: string;
    updated_at: string;
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .then(({ data }) => setProjects(data || []));
  }, [supabase]);

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-md hover:from-indigo-600 hover:to-blue-600 transition-all">
              <Plus className="w-5 h-5" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Project</DialogTitle>
            </DialogHeader>
            <ProjectForm
              onSuccess={() => {
                setAddOpen(false);
                supabase
                  .from("projects")
                  .select("*")
                  .then((r) => setProjects(r.data || []));
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6">
        {projects.map((proj) => (
          <ProjectCard key={proj.id} project={proj} />
        ))}
      </div>
    </div>
  );
}
