import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Student from "@/models/Student";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const student = await Student.findOne({
      emisNumber: body.emisNumber,

      dob: body.dob,
    });

    if (!student) {
      return NextResponse.json({
        success: false,
      });
    }

    return NextResponse.json({
      success: true,

      student,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}
