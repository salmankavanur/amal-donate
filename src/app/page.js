// src/app/page.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Loading from "../components/loading/Loading"; 

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch published campaigns on mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/campaigns/published');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch campaigns');
        }

        setCampaigns(data);
       
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Predefined donation amounts
  const donationAmounts = [10, 300, 1000];

  const handleDonateClick = (amount) => {
    router.push(`/donate?amount=${amount}`);
  };

  const handleDonateCustom = () => {
    router.push('/donate');
  };

  // Sample data for sponsorship options (unchanged)
  const sponsorshipOptions = [
    {
      id: 1,
      title: "Student Notebooks",
      description: "Provide notebooks and stationery for 100 students for the entire academic year.",
      image: "/images/cards/card-03.jpg",
      amount: 5000,
    },
    {
      id: 2,
      title: "Computer Lab Equipment",
      description: "Help upgrade the computer lab with new machines and software.",
      image: "/images/cards/card-02.jpg",
      amount: 15000,
    },
    {
      id: 3,
      title: "Sports Equipment",
      description: "Support athletics by providing new sports equipment for various teams.",
      image: "/images/cards/card-03.jpg",
      amount: 8000,
    },
  ];

  // Sample data for institution branches (unchanged)
  const institutions = [
    {
      id: 1,
      name: "AIC Main Campus",
      image: "/images/grid-image/image-01.png",
      location: "Downtown",
    },
    {
      id: 2,
      name: "AIC Engineering Wing",
      image: "/images/grid-image/image-02.png",
      location: "North District",
    },
    {
      id: 3,
      name: "AIC Medical School",
      image: "/images/grid-image/image-03.png",
      location: "East Campus",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/cards/ramzan.jpg" alt="AIC Alumni Donation Banner" fill className="object-cover opacity-70" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-indigo-700/70 to-transparent"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-4xl px-6"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Empower the Future
            <br />
            with AIC Alumni
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-8 font-light">
            Your generosity fuels a thriving community and shapes tomorrow’s leaders.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/donate" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:scale-105 transition-transform duration-300">
              Donate Now
            </Link>
            <Link href="/about" className="border-2 border-indigo-300 text-indigo-100 px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-500/20 transition-colors duration-300">
              Discover More
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Quick Donation Amount Buttons */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-4xl font-extrabold text-indigo-900 mb-10">Give Today, Impact Tomorrow</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {donationAmounts.map((amount) => (
            <motion.button
              key={amount}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white text-xl font-bold px-10 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
              onClick={() => handleDonateClick(amount)}
            >
              ₹ {amount}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border-2 border-indigo-600 text-indigo-600 text-xl font-bold px-10 py-5 rounded-xl hover:bg-indigo-50 transition-all duration-300 min-w-[200px]"
            onClick={handleDonateCustom}
          >
            Custom Gift
          </motion.button>
        </div>
      </section>

      {/* Active Campaigns Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-indigo-900">Active Campaigns</h2>
            <Link href="/campaigns" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
              Explore All Campaigns
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <Loading />
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : campaigns.length === 0 ? (
            <div className="text-center text-gray-600">No active campaigns found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign) => (
                <motion.div
                  key={campaign.id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300"
                >
                  <div className="relative h-56">
                    {campaign.image ? (
                      <Image src={campaign.image} alt={campaign.title} fill className="object-cover" />
                    ) : (
                      <Image src="/images/placeholder.jpg" alt="Placeholder" fill className="object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-indigo-900 mb-3">{campaign.title}</h3>
                    <p className="text-gray-600 mb-4">{campaign.description}</p>
                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                          transition={{ duration: 1.5 }}
                          className="h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                        ></motion.div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>₹{campaign.raised.toLocaleString()} raised</span>
                        <span>Goal: ₹{campaign.goal.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Ends: {campaign.endDate}</span>
                      <Link href={`/campaigns/${campaign.id}`} className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors">
                        Contribute
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sponsorship Options Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-indigo-900">Sponsorship Opportunities</h2>
            <Link href="/sponsorships" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
              See All Options
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sponsorshipOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image src={option.image} alt={option.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-3">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-indigo-700 text-lg">₹{option.amount.toLocaleString()}</span>
                    <Link href={`/sponsorships/${option.id}`} className="bg-purple-600 text-white px-5 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors">
                      Sponsor Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Institution Branches Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-extrabold text-indigo-900 mb-10 text-center">Support Our Institutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {institutions.map((institution) => (
              <motion.div
                key={institution.id}
                whileHover={{ scale: 1.03 }}
                className="relative bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="relative h-48">
                  <Image src={institution.image} alt={institution.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-2">{institution.name}</h3>
                  <p className="text-gray-600 mb-4">Location: {institution.location}</p>
                  <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300">
                    Support This Campus
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/volunteer" className="relative bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
            <h3 className="text-2xl font-bold mb-3 relative z-10">Volunteer</h3>
            <p className="relative z-10">Join us to create lasting change</p>
          </Link>
          <Link href="/transactions" className="relative bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
            <h3 className="text-2xl font-bold mb-3 relative z-10">All Transactions</h3>
            <p className="relative z-10">Track every donation’s impact</p>
          </Link>
          <Link href="/history" className="relative bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
            <h3 className="text-2xl font-bold mb-3 relative z-10">My History</h3>
            <p className="relative z-10">See your personal legacy</p>
          </Link>
        </div>
      </section>
    </div>
  );
}