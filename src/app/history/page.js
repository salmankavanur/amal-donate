"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function History() {
  const [showPopup, setShowPopup] = useState(true); // Popup visible by default
  const [phone, setPhone] = useState("");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFindTransactions = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDonations([]);

    try {
      const response = await fetch(`/api/donations/list?phone=${phone}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }
      const data = await response.json();
      setDonations(data);
      setShowPopup(false); // Close popup on successful fetch
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            My Transaction History
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

        {/* Popup Form */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Find Your Transactions
              </h2>
              <form onSubmit={handleFindTransactions}>
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., 9645934561"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 mb-4">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                >
                  {loading ? "Searching..." : "Find My Transactions"}
                </button>
              </form>
              <button
                onClick={() => setShowPopup(false)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && !showPopup && (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
              Loading...
            </div>
          )}
          {donations.length === 0 && !loading && !showPopup && (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
              No transactions found for this phone number
            </div>
          )}
          {donations.map((donation) => (
            <div
              key={donation._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
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
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {donation.name || "N/A"}
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-300">
                  ₹{parseFloat(donation.amount).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Type:</span> {donation.type || "N/A"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Location:</span>{" "}
                  {donation.district || "N/A"}, {donation.panchayat || "N/A"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Phone:</span> {donation.phone || "N/A"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Payment ID:</span>{" "}
                  {donation.razorpayPaymentId || "N/A"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(donation.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}