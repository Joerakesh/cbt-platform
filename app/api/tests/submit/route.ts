// Import response helper
import { NextResponse } from "next/server";

// Import DB connection
import { connectDB } from "@/lib/mongodb";

// Import models
import Test from "@/models/Test";

import Attempt from "@/models/Attempt";

import ExamSession from "@/models/ExamSession";

// Submit exam
export async function POST(request: Request) {
  try {
    // Connect database
    await connectDB();

    // Request body
    const body = await request.json();

    console.log("Submit Body:", body);

    // Find session
    const session = await ExamSession.findById(body.sessionId);

    // Session not found
    if (!session) {
      return NextResponse.json({
        success: false,

        message: "Session not found",
      });
    }

    // Find exam
    const exam = await Test.findById(session.testId);

    // Exam missing
    if (!exam) {
      return NextResponse.json({
        success: false,

        message: "Exam not found",
      });
    }

    // Score
    let score = 0;

    // Check answers
    body.answers.forEach((answer: any) => {
      // Find question
      const question = exam.questions.find(
        (item: any) => item._id.toString() === answer.questionId,
      );

      // Invalid question
      if (!question) {
        return;
      }

      // Correct answer
      if (question.correctAnswer === answer.selectedAnswer) {
        score++;
      }
    });

    // Save attempt
    const attempt = await Attempt.create({
      sessionId: body.sessionId,

      examId: session.testId,

      studentId: body.studentId,

      emisNumber: body.emisNumber,

      answers: body.answers,

      score,
    });

    // Success
    return NextResponse.json({
      success: true,

      score,

      attempt,
    });
  } catch (error) {
    console.log("Submit Error:", error);

    return NextResponse.json({
      success: false,

      message: "Submission failed",
    });
  }
}
