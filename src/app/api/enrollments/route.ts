import { supabase } from "@/lib/DB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const payload = (await req.json()) as {
    email: string;
    courseId: string;
  };

  const { data: studentsdata, error: studentserror } = await supabase
    .from("student")
    .select("id")
    .eq("email", payload.email);

  if (studentserror) {
    console.log(studentserror);
    return NextResponse.json(
      { okay: false },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
  console.log(payload.email, studentsdata);

  const { data: enrollmensdata, error: enrollmenserror } = await supabase
    .from("enrollments")
    .insert({ course_id: payload.courseId, student_id: studentsdata[0].id });

  if (enrollmenserror) {
    console.log(enrollmenserror);
    return NextResponse.json(
      { okay: false },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  return NextResponse.json(
    { okay: true },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
};

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "id parameter is required" },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  const { data: coursesData, error: coursesError } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("student_id", id);

  if (coursesError || !coursesData) {
    return NextResponse.json(
      { error: coursesError?.message || "No courses found" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  const courseIds = coursesData.map(
    (registration: { course_id: string }) => registration.course_id
  );

  const { data: detailedCoursesData, error: detailedCoursesError } =
    await supabase.from("courses").select("*").in("id", courseIds);

  if (detailedCoursesError) {
    return NextResponse.json(
      { error: detailedCoursesError.message },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  return NextResponse.json(
    { courses: detailedCoursesData },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
};
