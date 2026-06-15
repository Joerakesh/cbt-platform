import mongoose from "mongoose";

// Answer schema
const AnswerSchema = new mongoose.Schema({
  questionId: String,

  selectedAnswer: String,
});

// Attempt schema
const AttemptSchema = new mongoose.Schema(
  {
    // Session reference
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "ExamSession",
    },

    // Test reference
    examId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Test",
    },

    // Student reference
    studentId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Student",
    },

    // Student EMIS
    emisNumber: String,

    // Answers
    answers: [AnswerSchema],

    // Final score
    score: Number,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Attempt ||
  mongoose.model("Attempt", AttemptSchema);
