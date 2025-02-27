const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Use bcryptjs instead of bcrypt

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: {type: String },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["Super Admin", "Manager", "Admin", "Staff", "Volunteer", "User"], 
    default: "Admin",
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);