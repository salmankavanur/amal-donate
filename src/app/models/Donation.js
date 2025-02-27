const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["General", "Yatheem", "Hifz", "Building", "Campaign", "Institute"], required: true },
  userId: { type: String, required: true },
  campaignId: { type: String, default: null },
  instituteId: { type: String, default: null },
  district: { type: String, default: null },
  panchayat: { type: String, default: null },
  name: { type: String, default: null },
  phone: { type: String, default: null },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
 
  createdAt: { type: Date, default: Date.now },
});
 

const Donation = mongoose.models.Donation || mongoose.model("Donation", donationSchema);


export default Donation;
