// lib/store/task-store.ts
import { create } from "zustand";
import { Task, TaskStatus } from "@/types";

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  setLoading: (loading: boolean) => void;
  fetchTasks: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: true,
  fetchTasks: async () => {
    const supabase = (await import("@/lib/supabase/client")).createClient();
    set({ loading: true });
    const { data: tasks } = await supabase.from("tasks").select("*");
    set({ tasks: tasks || [], loading: false });
  },
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
  moveTask: async (id, status) => {
    const supabase = (await import("@/lib/supabase/client")).createClient();
    await supabase.from("tasks").update({ status }).eq("id", id);
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      ),
    }));
  },
  setLoading: (loading) => set({ loading }),
}));
