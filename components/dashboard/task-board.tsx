"use client";
import { useState } from "react";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskColumn } from "@/components/tasks/task-column";
import { TaskCard } from "@/components/tasks/task-card";
import { useTaskStore } from "@/lib/store/task-store";
import { TaskStatus } from "@/types";

const columns: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export function TaskBoard() {
  const { tasks, moveTask } = useTaskStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      setActiveId(null);
      return;
    }
    const activeTask = tasks.find((t) => t.id === active.id);
    const overColumn = columns.find((col) => col.id === over.id);
    if (activeTask && overColumn && activeTask.status !== overColumn.id) {
      moveTask(activeTask.id, overColumn.id);
    }
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 h-full p-2 sm:p-4 md:p-8 bg-gradient-to-br from-blue-50/60 via-white/80 to-indigo-100/60 rounded-3xl animate-fade-in-up">
        {columns.map((col) => (
          <SortableContext
            key={col.id}
            id={col.id}
            items={tasks.filter((t) => t.status === col.id).map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn
              id={col.id}
              title={col.title}
              tasks={tasks.filter((t) => t.status === col.id)}
            />
          </SortableContext>
        ))}
      </div>
      <DragOverlay>{activeTask && <TaskCard task={activeTask} />}</DragOverlay>
    </DndContext>
  );
}
