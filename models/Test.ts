import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: String,

  options: [String],

  correctAnswer: String,
});

const TestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    // Subject reference
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },

    // Allowed classes
    classIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],

    duration: Number,

    language: String,

    questions: [QuestionSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Test || mongoose.model("Test", TestSchema);
