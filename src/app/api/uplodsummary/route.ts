import { supabase } from "@/lib/DB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const payload = (await req.json()) as {
    lecture_id: string;
    summary: string;
  };

  const { lecture_id, summary } = payload;
  const dbResponse = await supabase
    .from("lectures")
    .update({ summary: summary })
    .eq("id", lecture_id);
  console.log(dbResponse);
  return NextResponse.json(
    //@ts-ignore
    { okay: true },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
};
