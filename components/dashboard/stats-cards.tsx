"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function StatsCards() {
  const supabase = createClient();
  const [stats, setStats] = useState({ todo: 0, in_progress: 0, done: 0 });

  useEffect(() => {
    async function loadStats() {
      const { data: t } = await supabase
        .from("tasks")
        .select("id", { count: "exact" })
        .eq("status", "todo");
      const { data: ip } = await supabase
        .from("tasks")
        .select("id", { count: "exact" })
        .eq("status", "in_progress");
      const { data: d } = await supabase
        .from("tasks")
        .select("id", { count: "exact" })
        .eq("status", "done");
      setStats({
        todo: t?.length || 0,
        in_progress: ip?.length || 0,
        done: d?.length || 0,
      });
    }
    loadStats();
  }, [supabase]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>To Do</CardTitle>
        </CardHeader>
        <CardContent>{stats.todo}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>In Progress</CardTitle>
        </CardHeader>
        <CardContent>{stats.in_progress}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Done</CardTitle>
        </CardHeader>
        <CardContent>{stats.done}</CardContent>
      </Card>
    </div>
  );
}
