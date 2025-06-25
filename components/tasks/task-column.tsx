"use client";
import { TaskCard } from "@/components/tasks/task-card";
import { useState } from "react";
import { differenceInDays } from "date-fns";
import { useDroppable } from "@dnd-kit/core";
import { Task } from "@/types";

export function TaskColumn({
  id,
  title,
  tasks,
}: {
  id: string;
  title: string;
  tasks: Task[];
}) {
  const [showOldDone, setShowOldDone] = useState(false);
  const { isOver, setNodeRef } = useDroppable({ id });
  // Only for the 'done' column
  const isDone = id === "done";
  let mainTasks = tasks;
  let oldDoneTasks: Task[] = [];
  if (isDone) {
    const now = new Date();
    oldDoneTasks = tasks.filter(
      (task) => differenceInDays(now, new Date(task.updated_at)) > 2
    );
    mainTasks = tasks.filter(
      (task) => differenceInDays(now, new Date(task.updated_at)) <= 2
    );
  }
  return (
    <div
      ref={setNodeRef}
      className={`bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-blue-100 dark:border-gray-800 rounded-3xl shadow-xl p-6 flex flex-col transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl ${
        isOver ? "ring-4 ring-indigo-300 dark:ring-indigo-600" : ""
      }`}
    >
      <h3 className="font-extrabold text-lg text-indigo-700 dark:text-indigo-300 mb-6 font-serif tracking-tight">
        {title}
      </h3>
      <div className="flex-1 space-y-4 overflow-auto">
        {mainTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      {isDone && oldDoneTasks.length > 0 && (
        <div className="mt-6">
          <button
            className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-gradient-to-r from-gray-200/70 to-indigo-100/60 dark:from-gray-800/70 dark:to-indigo-900/40 text-indigo-700 dark:text-indigo-200 font-semibold shadow hover:from-gray-300 hover:to-indigo-200 dark:hover:from-gray-700 dark:hover:to-indigo-800 transition-all"
            onClick={() => setShowOldDone((v) => !v)}
          >
            <span>Show completed tasks older than 2 days</span>
            <span
              className={`transform transition-transform ${
                showOldDone ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </button>
          {showOldDone && (
            <div className="mt-4 space-y-4 animate-fade-in-up">
              {oldDoneTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
