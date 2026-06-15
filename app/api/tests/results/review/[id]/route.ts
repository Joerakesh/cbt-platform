// Import response helper
import { NextResponse } from "next/server";

// MongoDB connection
import { connectDB } from "@/lib/mongodb";

// Models
import Attempt from "@/models/Attempt";
import Test from "@/models/Test";

// Review API
export async function GET(
  request: Request,

  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    // Connect DB
    await connectDB();

    // Get attempt ID
    const { id } = await params;

    // Find attempt
    const attempt = await Attempt.findById(id);

    // Find exam
    const exam = await Test.findById(attempt.examId);

    // Merge questions + answers
    const reviewData = exam.questions.map((question: any, index: number) => {
      // Find student's answer
      const studentAnswer = attempt.answers.find(
        (answer: any) => answer.questionIndex === index,
      );

      // Selected option
      const selectedAnswer = studentAnswer?.selectedAnswer || "";

      // Check correctness
      const isCorrect = selectedAnswer === question.correctAnswer;

      return {
        question: question.question,

        options: question.options,

        correctAnswer: question.correctAnswer,

        selectedAnswer,

        isCorrect,
      };
    });

    return NextResponse.json({
      success: true,

      rollNo: attempt.rollNo,

      score: attempt.score,

      reviewData,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}
