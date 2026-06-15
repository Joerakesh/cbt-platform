import { NextResponse } from "next/server";

import * as XLSX from "xlsx";

import { connectDB } from "@/lib/mongodb";

import Student from "@/models/Student";

export async function POST(request: Request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const file = formData.get("file") as File;

    const classId = formData.get("classId");

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const workbook = XLSX.read(buffer, {
      type: "buffer",
    });

    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet);

    const students = data.map((item: any) => ({
      name: item.Name,

      emisNumber: item.EMIS,

      dob: item.DOB,

      classId,
    }));

    await Student.insertMany(students);

    return NextResponse.json({
      success: true,
      total: students.length,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}
