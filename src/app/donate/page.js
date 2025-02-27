// src/app/donate/DonateForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../../components/loading/Loading"

export default function DonateForm({ session }) {
  const router = useRouter(); // Initialize router
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("General");
  const [district, setDistrict] = useState("");
  const [locationType, setLocationType] = useState("kerala");
  const [panchayat, setPanchayat] = useState("");
  const [loading, setLoading] = useState(false);
  

  const keralaDistricts = [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod",
    "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
    "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"
  ];

  const panchayatsByDistrict = {
    Alappuzha: ["Ambalapuzha", "Cherthala", "Kayamkulam"],
    Ernakulam: ["Aluva", "Kochi", "Muvattupuzha"],
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK.");
      setLoading(false);
      return;
    }

   
    try {
      const response = await fetch("/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseInt(amount) * 100 }),
      });

      const orderData = await response.json();
      if (!response.ok) throw new Error(orderData.error || "Order creation failed");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourKeyIDHere",
        amount: parseInt(amount) * 100,
        currency: "INR",
        name: "Your Organization Name",
        description: `Donation for ${type}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          const paymentData = {
            amount,
            name,
            phone,
            type,
            district: locationType === "kerala" ? district : "Other",
            panchayat: locationType === "kerala" ? panchayat : null,
            userId: session?.user?.id || "guest",
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const saveResponse = await fetch("/api/donations/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData),
          });

          setLoading(true)
          const saveData = await saveResponse.json();
          if (!saveResponse.ok) throw new Error(saveData.error || "Failed to save donation");

          // Redirect to success page with payment and donor details
          router.push(
            `/donate/success?donationId=${saveData.id}&amount=${amount}&name=${encodeURIComponent(name)}&phone=${phone}&type=${type}&district=${district || "Other"}&panchayat=${panchayat || ""}&paymentId=${response.razorpay_payment_id}&orderId=${response.razorpay_order_id}`
          );
        },
        prefill: { name, contact: phone },
        theme: { color: "#3B82F6" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert(`Payment initiation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return loading ? <Loading/> : (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Make a Donation</h1>
      <form onSubmit={handleDonate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Donation Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Donation Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="General">General</option>
            <option value="Yatheem">Yatheem</option>
            <option value="Hifz">Hifz</option>
            <option value="Building">Building</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="flex space-x-4 mb-3">
            <button
              type="button"
              onClick={() => setLocationType("kerala")}
              className={`px-4 py-2 rounded-md ${locationType === "kerala" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              Kerala
            </button>
            <button
              type="button"
              onClick={() => setLocationType("others")}
              className={`px-4 py-2 rounded-md ${locationType === "others" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              Others
            </button>
          </div>
          {locationType === "kerala" && (
            <div className="space-y-4">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select District</option>
                {keralaDistricts.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
              {district && (
                <select
                  value={panchayat}
                  onChange={(e) => setPanchayat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Panchayat/Municipality</option>
                  {(panchayatsByDistrict[district] || []).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {loading ? "Processing..." : "Donate Now"}
        </button>
      </form>
    </div>
  );
}