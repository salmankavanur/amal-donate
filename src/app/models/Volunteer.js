const mongoose = require('mongoose');
const bcrypt = require("bcryptjs"); 

const volunteerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name:{ type:String },
  role: { 
    type: String, 
    enum: ["Super Admin", "Manager", "Admin", "Staff", "Volunteer", "User"], 
    default: "Volunteer",
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
});

volunteerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



module.exports = mongoose.models.Volunteer || mongoose.model("Volunteer", volunteerSchema);