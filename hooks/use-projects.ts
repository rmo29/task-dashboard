import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types";

export function useProjects() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);

  async function fetchProjects() {
    const { data } = await supabase.from("projects").select("*");
    setProjects(data || []);
  }

  return { projects, fetchProjects };
}
