import { supabase } from "@/lib/DB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const payload = (await req.json()) as {
    course_id: string;
    title: string;
    description: string;
    lecture_url: string;
    uploaded_by: string;
  };

  if (
    !payload.course_id ||
    !payload.title ||
    !payload.description ||
    !payload.lecture_url ||
    !payload.uploaded_by
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("lectures")
    .insert({
      course_id: payload.course_id,
      title: payload.title,
      description: payload.description,
      lecture_url: payload.lecture_url,
      uploaded_by: payload.uploaded_by,
      upload_date: new Date().toISOString(),
    })
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log(data);
  await fetch("http://localhost:8000/api/ai", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      lecture_url: payload.lecture_url,
      lecture_id: data[0].id,
    }),
  });
  return NextResponse.json(
    { message: "Lecture uploaded successfully", data },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
};
