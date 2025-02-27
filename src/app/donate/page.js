// src/app/donate/DonateForm.js
"use client";

import { useState } from "react";

export default function DonateForm({ session }) {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("General");
  const [district, setDistrict] = useState("");
  const [locationType, setLocationType] = useState("kerala"); // kerala or others
  const [panchayat, setPanchayat] = useState("");

  // Kerala districts
  const keralaDistricts = [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod",
    "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
    "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"
  ];

  // Sample panchayats/municipalities (this could be expanded based on district)
  const panchayatsByDistrict = {
    "Alappuzha": ["Ambalapuzha", "Cherthala", "Kayamkulam"],
    "Ernakulam": ["Aluva", "Kochi", "Muvattupuzha"],
    // Add more districts and their panchayats/municipalities as needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/donations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          name,
          phone,
          type,
          district: locationType === "kerala" ? district : "Other",
          panchayat: locationType === "kerala" ? panchayat : null,
          userId: session?.user?.id || "guest",
        }),
      });
      if (!response.ok) throw new Error("Donation failed");
      setAmount("");
      setName("");
      setPhone("");
      setDistrict("");
      setPanchayat("");
    } catch (error) {
      console.error("Error submitting donation:", error);
      alert("An error occurred while submitting your donation. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Make a Donation</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Donation Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Donation Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Donation Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="General">General</option>
            <option value="Yatheem">Yatheem</option>
            <option value="Hifz">Hifz</option>
            <option value="Building">Building</option>
          </select>
        </div>

        {/* Location Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="flex space-x-4 mb-3">
            <button
              type="button"
              onClick={() => setLocationType("kerala")}
              className={`px-4 py-2 rounded-md ${
                locationType === "kerala"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Kerala
            </button>
            <button
              type="button"
              onClick={() => setLocationType("others")}
              className={`px-4 py-2 rounded-md ${
                locationType === "others"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Others
            </button>
          </div>

          {/* District Dropdown (visible only for Kerala) */}
          {locationType === "kerala" && (
            <div className="space-y-4">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select District</option>
                {keralaDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>

              {/* Panchayat/Municipality Dropdown (visible when district is selected) */}
              {district && (
                <select
                  value={panchayat}
                  onChange={(e) => setPanchayat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Panchayat/Municipality</option>
                  {(panchayatsByDistrict[district] || []).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Donate Now
        </button>
      </form>
    </div>
  );
}