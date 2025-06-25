import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const user = (await supabase.auth.getUser()).data.user;

  const { data, error } = await supabase
    .from("projects")
    .insert([{ ...body, user_id: user?.id }]);

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json(data);
}
