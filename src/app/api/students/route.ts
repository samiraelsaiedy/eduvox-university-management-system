import { supabase } from "@/lib/DB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { data, error } = await supabase
    .from("student")
    .select("id, name, email");
  if (error) {
    return NextResponse.json(
      { error: "Students not found" },
      { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  return NextResponse.json(
    { data },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
};

export const POST = async (req: NextRequest) => {
  const { name, email } = await req.json();

  const { data, error } = await supabase
    .from("student")
    .insert([{ name, email }]);

  if (error) {
    return NextResponse.json(
      { error: "Error adding student" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  return NextResponse.json(
    { data },
    { status: 201, headers: { "Access-Control-Allow-Origin": "*" } }
  );
};
