import mongoose from "mongoose";

const ExamSessionSchema = new mongoose.Schema(
  {
    // Session title
    title: {
      type: String,
      required: true,
    },

    // Test reference
    testId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Test",

      required: true,
    },

    // Allowed classes
    classIds: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Class",
      },
    ],

    // Session start
    startTime: {
      type: Date,
      required: true,
    },

    // Session end
    endTime: {
      type: Date,
      required: true,
    },

    // Publish control
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.ExamSession ||
  mongoose.model("ExamSession", ExamSessionSchema);
