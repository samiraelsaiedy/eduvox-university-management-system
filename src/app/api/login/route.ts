import { supabase } from "@/lib/DB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const payload = (await req.json()) as {
    email: string;
    password: string;
    type: "student" | "program_director" | "instructors";
  };

  const { email, password, type } = payload;
  const dbResponse = await supabase
    .from(type)
    .select("id,password")
    .eq("email", email);

  if (
    dbResponse.data?.length === 1 &&
    //@ts-ignore
    password !== dbResponse.data[0].password
  ) {
    return NextResponse.json(
      {},
      { status: 401, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
  if (dbResponse.data && dbResponse.data.length === 0) {
    return NextResponse.json(
      //@ts-ignore
      { okay: false, massge: "user not found " },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
  return NextResponse.json(
    //@ts-ignore
    { okay: true, userId: dbResponse.data[0].id },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
};
