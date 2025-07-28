import { supabase } from "@/lib/DB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const payload = (await req.json()) as {
    name: string;
    description: string;
  };

  const { name, description } = payload;
  const { error } = await supabase
    .from("courses")
    .insert({ name, description });

  if (error) {
    console.log(error);

    return NextResponse.json({ okay: false }, { status: 500 });
  }

  return NextResponse.json(
    { okay: true },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
};

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");

  let supabaseResponse;
  if (id) {
    supabaseResponse = await supabase
      .from("courses")
      .select("id,name, lectures(*)")
      .eq("id", id);
  } else {
    supabaseResponse = await supabase.from("courses").select("id,name");
  }
  const { data, error } = supabaseResponse;
  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "courses not found" },

      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
  return NextResponse.json(
    { data },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
};
