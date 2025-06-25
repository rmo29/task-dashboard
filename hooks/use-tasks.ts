import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Task } from "@/types";

export function useTasks(projectId: string) {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);

  async function fetchTasks() {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId);
    setTasks(data || []);
  }

  return { tasks, fetchTasks };
}
