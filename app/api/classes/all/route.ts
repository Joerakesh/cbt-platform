import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Class from "@/models/Class";

export async function GET() {
  try {
    await connectDB();

    const classes = await Class.find();

    return NextResponse.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}
