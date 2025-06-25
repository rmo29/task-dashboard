"use client";

import { useEffect } from "react";
import { TaskFilters } from "../../../components/tasks/task-filters";
import { TaskBoard } from "../../../components/dashboard/task-board";
import { useTaskStore } from "../../../lib/store/task-store";
import { createClient } from "../../../lib/supabase/client";

export default function TasksPage() {
  const { setTasks } = useTaskStore();
  const supabase = createClient();

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: tasks } = await supabase.from("tasks").select("*");
      if (tasks) {
        setTasks(tasks);
      }
    };
    fetchTasks();
  }, [supabase, setTasks]);

  return (
    <div>
      <TaskFilters />
      <div className="mt-4">
        <TaskBoard />
      </div>
    </div>
  );
}
