import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    emisNumber: {
      type: String,
      required: true,
      unique: true,
    },

    dob: {
      type: String,
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },

    section: String,

    medium: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
