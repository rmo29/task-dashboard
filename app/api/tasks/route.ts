import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server"; // ✅ use your wrapper

export async function POST(req: Request) {
  const supabase = await createClient(); // ✅ this handles cookies internally

  const { title, project_id, status, priority } = await req.json();
  const user = (await supabase.auth.getUser()).data.user;

  const { data, error } = await supabase
    .from("tasks")
    .insert([{ title, project_id, status, priority, user_id: user?.id }]);

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json(data);
}
