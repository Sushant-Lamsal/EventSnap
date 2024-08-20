import { Document, Schema, model, models } from "mongoose";
import mongoose from 'mongoose'

export interface ICategory extends Document {
  _id: string;
  name: string;
}

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
})

const Category = mongoose.models.Category || model('Category', CategorySchema);

export default Category;