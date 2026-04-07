import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  images: [String],
  category: String,
  description: String,
  stock: Number,
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);