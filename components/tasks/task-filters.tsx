// components/tasks/task-filters.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskStore } from "@/lib/store/task-store";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./task-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Task } from "@/types";

export function TaskFilters() {
  const { setTasks, setLoading, fetchTasks } = useTaskStore();
  const [statusFilter, setStatusFilter] = useState<
    "todo" | "in_progress" | "done" | "all"
  >("all");
  const [search, setSearch] = useState("");
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [sortBy, setSortBy] = useState<
    "created_desc" | "created_asc" | "due_asc" | "due_desc"
  >("created_desc");

  // Fetch all tasks on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { data } = await supabase.from("tasks").select("*");
      setAllTasks(data || []);
      setTasks(data || []);
      setLoading(false);
    };
    fetchAll();
  }, [setTasks, setLoading]);

  // Filter tasks when search or status changes
  useEffect(() => {
    let filtered = allTasks;
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }
    if (search.trim()) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    // Sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "created_desc") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sortBy === "created_asc") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sortBy === "due_asc") {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      } else if (sortBy === "due_desc") {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
      }
      return 0;
    });
    setTasks(filtered);
  }, [statusFilter, search, allTasks, setTasks, sortBy]);

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Select
        onValueChange={(value) =>
          setStatusFilter(value as "todo" | "in_progress" | "done" | "all")
        }
        defaultValue="all"
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => {
            setSearch(value);
          }, 200);
        }}
        className="w-60"
      />
      <Select
        onValueChange={(value) =>
          setSortBy(
            value as "created_desc" | "created_asc" | "due_asc" | "due_desc"
          )
        }
        defaultValue="created_desc"
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_desc">Newest Created</SelectItem>
          <SelectItem value="created_asc">Oldest Created</SelectItem>
          <SelectItem value="due_asc">Due Soonest</SelectItem>
          <SelectItem value="due_desc">Due Latest</SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add Task</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new task</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSuccess={() => {
              fetchTasks();
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
