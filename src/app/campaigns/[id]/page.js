// src/app/campaigns/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Loading from "../../../components/loading/Loading"; // Adjust path
import { useRouter } from "next/navigation";
import { Link } from "lucide-react";

export default function CampaignDetail() {
  const { id } = useParams(); // Get campaign ID from URL
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/campaigns/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch campaign");
        setCampaign(data);
      } catch (err) {
        console.error("Error fetching campaign:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid donation amount");
      return;
    }

    setLoading(true);
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Failed to load payment gateway");

      // Create order
      const orderResponse = await fetch("/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseInt(amount) * 100, campaignId: id }),
      });
      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.error || "Order creation failed");

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourKeyIDHere",
        amount: parseInt(amount) * 100,
        currency: "INR",
        name: "AIC Alumni Donation",
        description: `Donation for ${campaign.title}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          const paymentData = {
            amount,
            campaignId: id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const saveResponse = await fetch("/api/donations/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData),
          });
          const saveData = await saveResponse.json();
          if (!saveResponse.ok) throw new Error(saveData.error || "Failed to save donation");

          router.push(`/donate/success?donationId=${saveData.id}&amount=${amount}&campaignId=${id}`);
        },
        theme: { color: "#3B82F6" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Donation error:", err);
      alert(`Failed to process donation: ${err.message}`);
    } finally {
      setLoading(false);
    }
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

  if (loading) return <div className="flex justify-center mt-10"><Loading /></div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!campaign) return <div className="text-center text-gray-600 mt-10">Campaign not found</div>;

  return (
    <div className="container mx-auto p-6">
      <Link href="/" className="text-indigo-600 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {campaign.image && (
            <div className="relative w-full md:w-1/2 h-64">
              <Image src={campaign.image} alt={campaign.title} fill className="object-cover rounded-lg" />
            </div>
          )}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold text-indigo-900 mb-4">{campaign.title}</h1>
            <p className="text-gray-600 mb-4">{campaign.description}</p>
            <p><strong>Goal:</strong> ₹{campaign.goal.toLocaleString()}</p>
            <p><strong>Raised:</strong> ₹{campaign.raised.toLocaleString()}</p>
            <p><strong>End Date:</strong> {campaign.endDate}</p>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-indigo-900 mb-2">Contribute Now</h2>
              <form onSubmit={handleDonate} className="space-y-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (₹)"
                  className="w-full p-2 border rounded"
                  min="1"
                  required
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white p-3 rounded-full font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Donate"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}