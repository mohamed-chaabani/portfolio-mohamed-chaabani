import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  order: number;
  color: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
    color: { type: String, default: "rgb(0,200,255)" },
  },
  { timestamps: true },
);

export const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
