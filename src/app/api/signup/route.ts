import { supabase } from "@/lib/DB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const payload = (await req.json()) as {
      name: string;
      email: string;
      password: string;
      type: "student" | "program_director" | "instructors";
    };

    const { email, name, password, type } = payload;

    const { data, error } = await supabase
      .from(type)
      .insert({ email, name, password })
      .select("id");

    if (error) {
      return NextResponse.json(
        { okay: false, message: "Signup failed: " + error.message },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    return NextResponse.json(
      //@ts-ignore
      { okay: true, userId: data[0].id },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (error) {
    return NextResponse.json(
      { okay: false, message: "Server error. Please try again." },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
};
export const OPTIONS = async () => {
  return NextResponse.json(
    {},
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
};
