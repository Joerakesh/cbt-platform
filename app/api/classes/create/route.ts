import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Class from "@/models/Class";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const newClass = await Class.create(body);

    return NextResponse.json({
      success: true,
      data: newClass,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}
