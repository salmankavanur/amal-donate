// src/app/donate/success/page.js
"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();

  const donationId = searchParams.get("donationId");
  const amount = searchParams.get("amount");
  const name = decodeURIComponent(searchParams.get("name") || "");
  const phone = searchParams.get("phone");
  const type = searchParams.get("type");
  const district = searchParams.get("district");
  const panchayat = searchParams.get("panchayat");
  const paymentId = searchParams.get("paymentId");
  const orderId = searchParams.get("orderId");

  const handleDownloadReceipt = async () => {
    try {
      const response = await fetch("/api/donations/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationId,
          amount,
          name,
          phone,
          type,
          district,
          panchayat,
          paymentId,
          orderId,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate receipt");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Donation_Receipt_${donationId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert("Failed to download receipt. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-4">
        Thank you for your donation! Below are the details of your contribution.
      </p>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Donor Details</h2>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Amount:</strong> ₹{amount}</p>
        <p><strong>Donation Type:</strong> {type}</p>
        <p><strong>District:</strong> {district}</p>
        {panchayat && <p><strong>Panchayat:</strong> {panchayat}</p>}

        <h2 className="text-xl font-semibold text-gray-800">Transaction Details</h2>
        <p><strong>Payment ID:</strong> {paymentId}</p>
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Donation ID:</strong> {donationId}</p>
      </div>

      <button
        onClick={handleDownloadReceipt}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Download Receipt
      </button>
    </div>
  );
}