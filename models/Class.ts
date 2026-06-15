import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    className: String,

    section: String,

    medium: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Class || mongoose.model("Class", ClassSchema);
