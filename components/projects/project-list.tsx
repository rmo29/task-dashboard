"use client";
import { useEffect } from "react";
import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/projects/project-card";

export function ProjectList() {
  const { projects, fetchProjects } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 p-2 sm:p-4 md:p-8 bg-gradient-to-br from-blue-50/60 via-white/80 to-indigo-100/60 rounded-3xl animate-fade-in-up">
      {projects.map((proj) => (
        <ProjectCard key={proj.id} project={proj} />
      ))}
    </div>
  );
}
