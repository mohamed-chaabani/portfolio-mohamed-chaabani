import mongoose, { Schema, Document } from "mongoose";

export interface IAbout extends Document {
  name: string;
  title: string;
  phrases: string[];
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  yearsExperience: number;
  projectsCompleted: number;
  happyClients: number;
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    name: { type: String, default: "Alex Morgan" },
    title: { type: String, default: "Full Stack Developer" },
    phrases: { type: [String], default: [] },
    bio: { type: String, default: "" },
    email: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    yearsExperience: { type: Number, default: 5 },
    projectsCompleted: { type: Number, default: 50 },
    happyClients: { type: Number, default: 30 },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const About =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);
