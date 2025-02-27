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
  AlertCircle,
  CalendarRange
} from "lucide-react";

export default function UpcomingCampaignsPage() {
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("startDate");
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
      id: "CAM-007",
      name: "Ramadan Iftar Program",
      type: "Fundraising",
      goal: "₹65,000",
      targetAudience: "Needy Families",
      startDate: "2024-02-10",
      launchIn: 45,
      scheduledDate: "Feb 10, 2024",
      description: "Program to provide Iftar meals during Ramadan to families in need.",
      image: "/images/campaigns/ramadan-iftar.jpg",
      status: "Planning"
    },
    {
      id: "CAM-008",
      name: "Bright Public Nursery School Expansion",
      type: "Education",
      goal: "₹120,000",
      targetAudience: "Children",
      startDate: "2024-03-15",
      launchIn: 79,
      scheduledDate: "Mar 15, 2024",
      description: "Expanding facilities for the nursery school to accommodate more children.",
      image: "/images/campaigns/school-expansion.jpg",
      status: "Preparation"
    },
    {
      id: "CAM-009",
      name: "Islamic Dawa Academy Scholarship Fund",
      type: "Education",
      goal: "₹85,000",
      targetAudience: "Students",
      startDate: "2024-01-15",
      launchIn: 19,
      scheduledDate: "Jan 15, 2024",
      description: "Providing scholarships for deserving students at Islamic Dawa Academy.",
      image: "/images/campaigns/scholarship-fund.jpg",
      status: "Final Review"
    },
    {
      id: "CAM-010",
      name: "Ayaadi Life Education Skills Program",
      type: "Orphan Care",
      goal: "₹90,000",
      targetAudience: "Orphans",
      startDate: "2024-02-01",
      launchIn: 36,
      scheduledDate: "Feb 1, 2024",
      description: "Skills development program exclusively for upskilling orphans.",
      image: "/images/campaigns/life-skills.jpg",
      status: "Planning"
    },
    {
      id: "CAM-011",
      name: "Winter Blanket Drive",
      type: "Emergency Relief",
      goal: "₹55,000",
      targetAudience: "Poor Families",
      startDate: "2023-12-20",
      launchIn: 7,
      scheduledDate: "Dec 20, 2023",
      description: "Distribution of warm blankets to underprivileged families during winter.",
      image: "/images/campaigns/blanket-drive.jpg",
      status: "Final Review"
    },
    {
      id: "CAM-012",
      name: "Daiya Islamic Academy Library Project",
      type: "Education",
      goal: "₹70,000",
      targetAudience: "Students",
      startDate: "2024-01-30",
      launchIn: 34,
      scheduledDate: "Jan 30, 2024",
      description: "Establishing a comprehensive library at Daiya Islamic Academy.",
      image: "/images/campaigns/library-project.jpg",
      status: "Preparation"
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
        case "status":
          return a.status.localeCompare(b.status);
        case "goal":
          // Parse amount string to number (remove currency symbol and commas)
          const goalA = parseFloat(a.goal.replace(/[₹,]/g, ''));
          const goalB = parseFloat(b.goal.replace(/[₹,]/g, ''));
          return goalB - goalA; // Higher amount first
        case "startDate":
        default:
          // Sort by launch in days (soonest first)
          return a.launchIn - b.launchIn;
      }
    });

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Define campaign status type
  type CampaignStatus = "Planning" | "Preparation" | "Final Review" | string;

  // Helper function to get status badge color
  const getStatusColor = (status: CampaignStatus): string => {
    switch (status) {
      case "Planning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Preparation":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "Final Review":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            Upcoming Campaigns
            <span className="text-sm font-normal bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 py-0.5 px-2 rounded-full">
              {filteredCampaigns.length} Planned
            </span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View and prepare campaigns scheduled to launch in the future
          </p>
        </div>
        
        <Link 
          href="/campaigns/create" 
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center shadow-lg"
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
              placeholder="Search upcoming campaigns..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white/10 backdrop-blur-md rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
            />
          </div>
          
          {/* Filter and sort controls */}
          <div className="flex flex-wrap gap-2">
            {/* Category filter */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
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
                className="appearance-none pl-3 pr-8 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
              >
                <option value="startDate">Launch Date (Soonest First)</option>
                <option value="name">Campaign Name</option>
                <option value="status">Status</option>
                <option value="goal">Target Amount</option>
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
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
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
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
              >
                <option value="startDate">Launch Date (Soonest First)</option>
                <option value="name">Campaign Name</option>
                <option value="status">Status</option>
                <option value="goal">Target Amount</option>
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
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && filteredCampaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
            <AlertCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No upcoming campaigns found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
            No upcoming campaigns match your current search or filter criteria. Try adjusting your filters or plan a new campaign.
          </p>
          <Link 
            href="/campaigns/create" 
            className="mt-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Plan New Campaign
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
              <div className="h-48 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 relative">
                {/* Imaginary overlay for design */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Campaign type badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full text-xs font-medium text-blue-800 dark:text-blue-400 shadow-lg">
                    {campaign.type}
                  </span>
                </div>
                
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
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
                
                {/* Launch info */}
                <div className="mb-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3">
                  <div className="flex items-center text-blue-700 dark:text-blue-400 mb-1">
                    <CalendarRange className="h-4 w-4 mr-2" /> 
                    <span className="text-sm font-medium">Scheduled Launch</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{campaign.scheduledDate}</span>
                    <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                      In {campaign.launchIn} days
                    </span>
                  </div>
                </div>
                
                {/* Campaign stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/20 dark:bg-gray-800/20 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <Users className="h-3 w-3 mr-1" /> Target Audience
                    </div>
                    <p className="font-semibold text-gray-800 dark:text-white">{campaign.targetAudience}</p>
                  </div>
                  
                  <div className="bg-white/20 dark:bg-gray-800/20 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <Heart className="h-3 w-3 mr-1" /> Target Goal
                    </div>
                    <p className="font-semibold text-blue-600 dark:text-blue-400">{campaign.goal}</p>
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
                  href={`/campaigns/edit?id=${campaign.id}`}
                  className="px-3 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-sm font-medium hover:bg-white/20 transition-all duration-300 flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit Details
                </Link>
                
                <div className="flex space-x-2">
                  <Link 
                    href={`/campaigns/detail?id=${campaign.id}`}
                    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button 
                    className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
                    onClick={() => {
                      if (confirm(`Are you sure you want to launch campaign "${campaign.name}" now?`)) {
                        // Launch campaign logic would go here
                        alert(`Campaign ${campaign.id} launched!`);
                      }
                    }}
                  >
                    <Calendar className="h-4 w-4" />
                  </button>
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