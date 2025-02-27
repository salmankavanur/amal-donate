import mongoose from "mongoose";

const BoxSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true, unique: true },
  holderName: { type: String, default: "Unknown" },
  status: { type: String, default: "Active" },
});

// Avoid redefining the model if it already exists
const Box = mongoose.models.Box || mongoose.model("Box", BoxSchema);

export default Box;
