"use client";

import { useState } from "react";
import { getServerSession } from "next-auth";

export default async function HafizSponsorPage() {
  const session = await getServerSession();
  const [amount, setAmount] = useState("2500");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/sponsorships/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "Hafiz", amount, userId: session?.user.id || "guest" }),
    });
    setAmount("2500");
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Sponsor a Hafiz</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="2500">1 Month - ₹2,500</option>
          <option value="7500">3 Months - ₹7,500</option>
          <option value="15000">6 Months - ₹15,000</option>
          <option value="30000">1 Year - ₹30,000</option>
          <option value="50000">1 Year (with education) - ₹50,000</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Sponsor</button>
      </form>
    </div>
  );
}