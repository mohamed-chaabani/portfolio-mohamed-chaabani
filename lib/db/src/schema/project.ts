import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  featured: boolean;
  order: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    tags: { type: [String], default: [] },
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
