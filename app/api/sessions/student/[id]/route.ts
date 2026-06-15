// Import response helper
import { NextResponse } from "next/server";

// Import DB connection
import { connectDB } from "@/lib/mongodb";

// Import models
import Student from "@/models/Student";

import ExamSession from "@/models/ExamSession";

// Register model
import "@/models/Test";

// Get student sessions
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
    // Connect database
    await connectDB();

    // Get student ID
    const { id } = await params;

    // Find student
    const student = await Student.findById(id);

    // Student not found
    if (!student) {
      return NextResponse.json({
        success: false,

        data: [],

        message: "Student not found",
      });
    }

    // Current time
    const now = new Date();

    // Next 7 days
    const nextWeek = new Date();

    nextWeek.setDate(now.getDate() + 7);

    // Find sessions
    const sessions = await ExamSession.find({
      // Match student class
      classIds: {
        $in: [student.classId],
      },

      // Published only
      isPublished: true,

      // Show:
      // 1. Live exams
      // 2. Upcoming exams
      $or: [
        // Upcoming
        {
          startTime: {
            $gte: now,

            $lte: nextWeek,
          },
        },

        // Live
        {
          startTime: {
            $lte: now,
          },

          endTime: {
            $gte: now,
          },
        },
      ],
    })

      // Populate test details
      .populate({
        path: "testId",

        select: "title duration language",
      })

      // Sort by time
      .sort({
        startTime: 1,
      });

    // Success
    return NextResponse.json({
      success: true,

      total: sessions.length,

      data: sessions,
    });
  } catch (error) {
    console.log("Student Sessions Error:", error);

    return NextResponse.json({
      success: false,

      data: [],

      message: "Failed to fetch sessions",
    });
  }
}
