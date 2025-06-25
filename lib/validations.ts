// lib/validations.ts
import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color"),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  assignee: z.string().optional(),
  due_date: z.string().optional(),
  project_id: z.string().uuid(),
});

export type TaskInput = z.infer<typeof taskSchema>;
