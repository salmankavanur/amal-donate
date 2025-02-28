"use client";
import { useEffect, useState } from "react";
import Link from "next/link";




export default function Transactions() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch donations from your API (uncomment and customize)
  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/donations/list");
        if (!response.ok) throw new Error("Failed to fetch donations");
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            All Transactions
          </h1>
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
              Loading...
            </div>
          ) : donations.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
              No transactions found
            </div>
          ) : (
            donations.map((donation) => (
              <div
                key={donation._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-4">
                  {/* ID and Status */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {donation._id.slice(-6)}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        donation.status === "Completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </div>

                  {/* Donor Name */}
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {donation.name || "N/A"}
                  </h2>

                  {/* Amount */}
                  <p className="text-xl text-gray-700 dark:text-gray-300">
                    ₹{parseFloat(donation.amount).toFixed(2)}
                  </p>

                  {/* Type */}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Type:</span> {donation.type || "N/A"}
                  </p>

                  {/* District and Panchayat */}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Location:</span>{" "}
                    {donation.district || "N/A"}, {donation.panchayat || "N/A"}
                  </p>

                  {/* Phone */}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Phone:</span> {donation.phone || "N/A"}
                  </p>

                  {/* Payment ID */}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Payment ID:</span>{" "}
                    {donation.razorpayPaymentId || "N/A"}
                  </p>

                  {/* Date */}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(donation.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}