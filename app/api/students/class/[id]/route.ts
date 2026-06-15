import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Student from "@/models/Student";

export async function GET(
  request: Request,

  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    await connectDB();

    const { id } = await params;

    const students = await Student.find({
      classId: id,
    })

      .sort({
        name: 1,
      });

    return NextResponse.json({
      success: true,

      data: students,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,

      data: [],
    });
  }
}
