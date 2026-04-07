import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customerName: String,
  phone: String,
  address: String,
  items: [
    {
      productId: String,
      quantity: Number,
    }
  ],
  status: {
    type: String,
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);