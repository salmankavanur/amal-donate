// src/app/(admin)/campaigns/ongoing/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Calendar, 
  BarChart2, 
  Edit, 
  Trash2, 
  PlusCircle, 
  Filter, 
  ChevronDown, 
  Eye, 
  Clock, 
  Users, 
  Heart, 
  AlertCircle
} from "lucide-react";

export default function OngoingCampaignsPage() {
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("endDate");
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Campaign categories
  const categories = [
    "All Categories",
    "Fundraising",
    "Building",
    "Orphan Care",
    "Education",
    "Emergency Relief",
    "Zakat"
  ];

  // Mock campaign data
  const campaignsData = [
    {
      id: "CAM-001",
      name: "Dates Challenge",
      type: "Fundraising",
      goal: "₹50,000",
      raised: "₹20,000",
      progress: 40,
      donors: 45,
      startDate: "2023-11-01",
      endDate: "2023-12-15",
      daysRemaining: 22,
      description: "Special campaign focused on fundraising during specific periods.",
      image: "/images/campaigns/dates-challenge.jpg"
    },
    {
      id: "CAM-002",
      name: "She-Fine Campus Masjid Construction",
      type: "Building",
      goal: "₹100,000",
      raised: "₹30,000",
      progress: 30,
      donors: 67,
      startDate: "2023-10-15",
      endDate: "2024-02-28",
      daysRemaining: 97,
      description: "An ongoing project for the construction of a campus mosque.",
      image: "/images/campaigns/masjid-construction.jpg"
    },
    {
      id: "CAM-003",
      name: "Yatheem Winter Kit Distribution",
      type: "Orphan Care",
      goal: "₹35,000",
      raised: "₹28,000",
      progress: 80,
      donors: 53,
      startDate: "2023-11-10",
      endDate: "2023-12-25",
      daysRemaining: 32,
      description: "Provide warm clothing and essential items to orphans during winter.",
      image: "/images/campaigns/winter-kit.jpg"
    },
    {
      id: "CAM-004",
      name: "Hafiz Program Scholarship",
      type: "Education",
      goal: "₹75,000",
      raised: "₹45,000",
      progress: 60,
      donors: 38,
      startDate: "2023-09-01",
      endDate: "2024-01-31",
      daysRemaining: 69,
      description: "Support students memorizing the Quran with educational scholarships.",
      image: "/images/campaigns/hafiz-program.jpg"
    },
    {
      id: "CAM-005",
      name: "Oorkadavu Qasim College Expansion",
      type: "Building",
      goal: "₹200,000",
      raised: "₹120,000",
      progress: 60,
      donors: 95,
      startDate: "2023-08-15",
      endDate: "2024-03-15",
      daysRemaining: 113,
      description: "Expanding educational facilities to accommodate more students.",
      image: "/images/campaigns/college-expansion.jpg"
    },
    {
      id: "CAM-006",
      name: "Ramadan Food Distribution",
      type: "Emergency Relief",
      goal: "₹85,000",
      raised: "₹42,500",
      progress: 50,
      donors: 72,
      startDate: "2023-11-01",
      endDate: "2024-02-01",
      daysRemaining: 71,
      description: "Provide food packages to families in need during Ramadan.",
      image: "/images/campaigns/food-distribution.jpg"
    }
  ];

  // Filter and sort campaigns
  const filteredCampaigns = campaignsData
    .filter(campaign => {
      // Search filter
      const matchesSearch = campaign.name.toLowerCase().includes(searchText.toLowerCase()) ||
                           campaign.id.toLowerCase().includes(searchText.toLowerCase()) ||
                           campaign.description.toLowerCase().includes(searchText.toLowerCase());
      
      // Category filter
      const matchesCategory = filterCategory === "" || filterCategory === "All Categories" || 
                             campaign.type === filterCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "progress":
          return b.progress - a.progress; // Higher progress first
        case "raised":
          // Parse amount string to number (remove currency symbol and commas)
          const raisedA = parseFloat(a.raised.replace(/[₹,]/g, ''));
          const raisedB = parseFloat(b.raised.replace(/[₹,]/g, ''));
          return raisedB - raisedA; // Higher amount first
        case "endDate":
        default:
          // Sort by days remaining (urgent first)
          return a.daysRemaining - b.daysRemaining;
      }
    });

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            Ongoing Campaigns
            <span className="text-sm font-normal bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 py-0.5 px-2 rounded-full">
              {filteredCampaigns.length} Active
            </span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor and manage your organization's active fundraising campaigns
          </p>
        </div>
        
        <Link 
          href="/campaigns/create" 
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-300 flex items-center shadow-lg"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Create Campaign
        </Link>
      </div>
      
      {/* Filters section */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white/10 backdrop-blur-md rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200"
            />
          </div>
          
          {/* Filter and sort controls */}
          <div className="flex flex-wrap gap-2">
            {/* Category filter */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Sort control */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200"
              >
                <option value="endDate">Urgency (End Date)</option>
                <option value="name">Campaign Name</option>
                <option value="progress">Progress</option>
                <option value="raised">Amount Raised</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Filter button (mobile) */}
            <button 
              className="md:hidden px-3 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-sm font-medium hover:bg-white/20 transition-all duration-300 flex items-center"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Filter className="h-4 w-4 mr-2" /> Filters
            </button>
          </div>
        </div>
        
        {/* Mobile filters (conditionally shown) */}
        {showMobileFilters && (
          <div className="mt-4 md:hidden space-y-3 border-t border-white/10 pt-4 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200"
              >
                <option value="endDate">Urgency (End Date)</option>
                <option value="name">Campaign Name</option>
                <option value="progress">Progress</option>
                <option value="raised">Amount Raised</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="relative w-12 h-12">
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-emerald-500 animate-spin"></div>
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && filteredCampaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
            <AlertCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No campaigns found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
            No campaigns match your current search or filter criteria. Try adjusting your filters or create a new campaign.
          </p>
          <Link 
            href="/campaigns/create" 
            className="mt-6 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-300 flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Create Campaign
          </Link>
        </div>
      )}
      
      {/* Campaigns grid */}
      {!isLoading && filteredCampaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div 
              key={campaign.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden hover:translate-y-[-5px] transition-all duration-300 flex flex-col"
            >
              {/* Campaign header with image placeholder */}
              <div className="h-48 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 relative">
                {/* Imaginary overlay for design */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Campaign type badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full text-xs font-medium text-emerald-800 dark:text-emerald-400 shadow-lg">
                    {campaign.type}
                  </span>
                </div>
                
                {/* Days remaining badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                    campaign.daysRemaining < 30 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    <Clock className="h-3 w-3 mr-1" />
                    {campaign.daysRemaining} days left
                  </span>
                </div>
                
                {/* Campaign title */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white line-clamp-2">{campaign.name}</h3>
                </div>
              </div>
              
              {/* Campaign content */}
              <div className="p-4 flex-grow">
                {/* Campaign ID */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Campaign ID: {campaign.id}
                </div>
                
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Progress</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{campaign.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                      style={{ width: `${campaign.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Campaign stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/20 dark:bg-gray-800/20 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <Users className="h-3 w-3 mr-1" /> Donors
                    </div>
                    <p className="font-semibold text-gray-800 dark:text-white">{campaign.donors}</p>
                  </div>
                  
                  <div className="bg-white/20 dark:bg-gray-800/20 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <Heart className="h-3 w-3 mr-1" /> Raised
                    </div>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">{campaign.raised}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">of {campaign.goal}</p>
                  </div>
                </div>
                
                {/* Campaign description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                  {campaign.description}
                </p>
              </div>
              
              {/* Campaign actions */}
              <div className="p-4 pt-0 flex justify-between">
                <Link 
                  href={`/campaigns/track?id=${campaign.id}`}
                  className="px-3 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-sm font-medium hover:bg-white/20 transition-all duration-300 flex items-center"
                >
                  <BarChart2 className="h-4 w-4 mr-2" /> Track Progress
                </Link>
                
                <div className="flex space-x-2">
                  <Link 
                    href={`/campaigns/detail?id=${campaign.id}`}
                    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link 
                    href={`/campaigns/edit?id=${campaign.id}`}
                    className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button 
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete campaign "${campaign.name}"?`)) {
                        // Delete campaign logic would go here
                        alert(`Campaign ${campaign.id} deleted!`);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}