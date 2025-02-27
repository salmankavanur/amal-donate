"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Upload, 
  Save, 
  X, 
  Info, 
  AlertCircle, 
  Banknote,
  Clock,
  Users,
  Heart,
  CheckCircle2
} from "lucide-react";

export default function EditCampaignPage() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('id');
  
  // Define the form data type
  interface FormData {
    id: string;
    name: string;
    type: string;
    goal: string;
    raised: string;
    description: string;
    startDate: string;
    endDate: string;
    targetAudience: string;
    featuredImage: File | null;
    allowRecurringDonations: boolean;
    enableEmailReminders: boolean;
    showProgressBar: boolean;
    sendThankYouMessages: boolean;
    notes: string;
  }
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    type: "",
    goal: "",
    raised: "",
    description: "",
    startDate: "",
    endDate: "",
    targetAudience: "",
    featuredImage: null,
    allowRecurringDonations: false,
    enableEmailReminders: true,
    showProgressBar: true,
    sendThankYouMessages: true,
    notes: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Campaign categories
  const campaignTypes = [
    { value: "", label: "Select a category" },
    { value: "fundraising", label: "Fundraising" },
    { value: "building", label: "Building" },
    { value: "orphan-care", label: "Orphan Care" },
    { value: "education", label: "Education" },
    { value: "emergency-relief", label: "Emergency Relief" },
    { value: "zakat", label: "Zakat" }
  ];

  // Fetch campaign data when component loads
  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!campaignId) return;
      
      setIsLoading(true);
      try {
        // In a real app, you would fetch the data from your API
        // This is mock data for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data based on the campaign ID
        const campaignData: Omit<FormData, 'featuredImage'> = {
          id: campaignId,
          name: campaignId === "CAM-001" ? "Dates Challenge" : "She-Fine Campus Masjid Construction",
          type: campaignId === "CAM-001" ? "fundraising" : "building",
          goal: campaignId === "CAM-001" ? "50000" : "100000",
          raised: campaignId === "CAM-001" ? "20000" : "30000",
          description: campaignId === "CAM-001" 
            ? "Special campaign focused on fundraising during specific periods."
            : "An ongoing project for the construction of a campus mosque.",
          startDate: campaignId === "CAM-001" ? "2023-11-01" : "2023-10-15",
          endDate: campaignId === "CAM-001" ? "2023-12-15" : "2024-02-28",
          targetAudience: campaignId === "CAM-001" ? "General" : "Students",
          allowRecurringDonations: true,
          enableEmailReminders: true,
          showProgressBar: true,
          sendThankYouMessages: true,
          notes: "Campaign imported from previous system."
        };
        
        // Set form data with null for the file since we can't mock a real File object
        setFormData({ ...campaignData, featuredImage: null });
        
        // Simulate loading campaign image
        setPreviewImage("/api/placeholder/500/300");
        
      } catch (error) {
        console.error("Error loading campaign data:", error);
        alert("Failed to load campaign data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCampaignData();
  }, [campaignId]);

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // For checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      
      setFormData((prev: FormData) => ({ ...prev, featuredImage: file }));
      
      // Clear any error for the image field
      if (errors.featuredImage) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.featuredImage;
          return newErrors;
        });
      }
      
      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.name.trim()) newErrors.name = "Campaign name is required";
    if (!formData.type) newErrors.type = "Campaign type is required";
    if (!formData.goal.trim()) newErrors.goal = "Fundraising goal is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    
    // Check if end date is after start date
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }
    }
    
    // Goal should be a valid number
    if (formData.goal && !/^\d+$/.test(formData.goal.replace(/[₹,]/g, ''))) {
      newErrors.goal = "Goal amount must be a valid number";
    }
    
    // Raised amount should be a valid number if provided
    if (formData.raised && !/^\d+$/.test(formData.raised.replace(/[₹,]/g, ''))) {
      newErrors.raised = "Raised amount must be a valid number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send the form data to your API
      console.log("Form submitted:", formData);
      
      // Show success message
      setSuccessMessage("Campaign updated successfully!");
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (error) {
      console.error("Error updating campaign:", error);
      alert("Failed to update campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = formData.raised && formData.goal 
    ? Math.round((parseInt(formData.raised.replace(/[₹,]/g, '')) / parseInt(formData.goal.replace(/[₹,]/g, ''))) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 flex justify-center items-center min-h-[400px]">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-emerald-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Success message banner */}
      {successMessage && (
        <div className="fixed top-6 right-6 max-w-md z-50 animate-slideInRight">
          <div className="bg-emerald-50 dark:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 p-4 rounded-lg shadow-lg flex items-start">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium">{successMessage}</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">Your changes have been saved successfully.</p>
            </div>
            <button 
              className="ml-4 text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300"
              onClick={() => setSuccessMessage(null)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
            Edit Campaign <span className="text-emerald-600 dark:text-emerald-400">{formData.id}</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update your campaign details, goals, and settings
          </p>
        </div>
        
        <div className="flex gap-2">
          <Link 
            href={`/campaigns/track?id=${campaignId}`}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center shadow-lg"
          >
            <Clock className="h-4 w-4 mr-2" /> Track Progress
          </Link>
          
          <Link 
            href="/campaigns/ongoing" 
            className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-sm font-medium hover:bg-white/20 transition-all duration-300 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Campaigns
          </Link>
        </div>
      </div>
      
      {/* Campaign Stats Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 p-4 border-b border-white/10">
          <h3 className="text-sm font-medium text-gray-800 dark:text-white">Campaign Overview</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">Active</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Goal</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                ₹{parseInt(formData.goal.replace(/[₹,]/g, '') || "0").toLocaleString()}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Raised</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                ₹{parseInt(formData.raised.replace(/[₹,]/g, '') || "0").toLocaleString()}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {progressPercentage}%
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200/30 dark:bg-gray-700/30 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-green-500 h-2.5 rounded-full"
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form container */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        {/* Progress Steps */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 p-4 border-b border-white/10">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <button 
              onClick={() => setActiveSection("basic")}
              className={`flex-1 text-center relative ${
                activeSection === "basic" 
                  ? "text-emerald-600 dark:text-emerald-400 font-medium" 
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${
                activeSection === "basic" 
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500 dark:ring-emerald-400" 
                  : "bg-white/20 dark:bg-gray-800/50"
              }`}>
                1
              </div>
              <span className="text-xs hidden sm:inline">Basic Info</span>
              {activeSection === "basic" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 dark:bg-emerald-400"></div>
              )}
            </button>
            
            <div className="w-12 h-px bg-gray-300 dark:bg-gray-700"></div>
            
            <button 
              onClick={() => setActiveSection("details")}
              className={`flex-1 text-center relative ${
                activeSection === "details" 
                  ? "text-emerald-600 dark:text-emerald-400 font-medium" 
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${
                activeSection === "details" 
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500 dark:ring-emerald-400" 
                  : "bg-white/20 dark:bg-gray-800/50"
              }`}>
                2
              </div>
              <span className="text-xs hidden sm:inline">Campaign Details</span>
              {activeSection === "details" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 dark:bg-emerald-400"></div>
              )}
            </button>
            
            <div className="w-12 h-px bg-gray-300 dark:bg-gray-700"></div>
            
            <button 
              onClick={() => setActiveSection("settings")}
              className={`flex-1 text-center relative ${
                activeSection === "settings" 
                  ? "text-emerald-600 dark:text-emerald-400 font-medium" 
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${
                activeSection === "settings" 
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500 dark:ring-emerald-400" 
                  : "bg-white/20 dark:bg-gray-800/50"
              }`}>
                3
              </div>
              <span className="text-xs hidden sm:inline">Settings</span>
              {activeSection === "settings" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 dark:bg-emerald-400"></div>
              )}
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          {/* Basic Info Section */}
          {activeSection === "basic" && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-300 flex items-start">
                <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <p>You're editing an active campaign. Changes will be visible to donors immediately.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campaign Name */}
                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Campaign Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Ramadan Food Distribution"
                    className={`w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border ${
                      errors.name ? 'border-red-300 dark:border-red-500' : 'border-white/20'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>
                
                {/* Campaign Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category*
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border ${
                      errors.type ? 'border-red-300 dark:border-red-500' : 'border-white/20'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200`}
                  >
                    {campaignTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type}</p>
                  )}
                </div>
                
                {/* Fundraising Goal */}
                <div>
                  <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fundraising Goal (₹)*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Banknote className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="goal"
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      placeholder="e.g., 50000"
                      className={`w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border ${
                        errors.goal ? 'border-red-300 dark:border-red-500' : 'border-white/20'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200`}
                    />
                  </div>
                  {errors.goal && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.goal}</p>
                  )}
                </div>
                
                {/* Amount Raised */}
                <div>
                  <label htmlFor="raised" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount Raised (₹)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Banknote className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="raised"
                      name="raised"
                      value={formData.raised}
                      onChange={handleInputChange}
                      placeholder="e.g., 20000"
                      className={`w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border ${
                        errors.raised ? 'border-red-300 dark:border-red-500' : 'border-white/20'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200`}
                    />
                  </div>
                  {errors.raised && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.raised}</p>
                  )}
                </div>
                
                {/* Start Date */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border ${
                        errors.startDate ? 'border-red-300 dark:border-red-500' : 'border-white/20'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200`}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startDate}</p>
                  )}
                </div>
                
                {/* End Date */}
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border ${
                        errors.endDate ? 'border-red-300 dark:border-red-500' : 'border-white/20'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200`}
                    />
                  </div>
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endDate}</p>
                  )}
                </div>
                
                {/* Target Audience */}
                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Audience <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    placeholder="e.g., Orphans, Students, Needy Families"
                    className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200"
                  />
                </div>
                
                {/* Description */}
                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Campaign Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe your campaign, its goals, and impact..."
                    className={`w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border ${
                      errors.description ? 'border-red-300 dark:border-red-500' : 'border-white/20'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveSection("details")}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-300 flex items-center shadow-lg"
                >
                  Next: Campaign Details
                </button>
              </div>
            </div>
          )}
          
          {/* Campaign Details Section */}
          {activeSection === "details" && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
              <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4 text-sm text-purple-800 dark:text-purple-300 flex items-start">
                <Info className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <p>Update visual content and additional details to make your campaign more appealing to potential donors.</p>
              </div>
              
              {/* Campaign Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Campaign Image
                </label>
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-2xl">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center">
                      {previewImage ? (
                        <div className="relative w-full">
                          <img 
                            src={previewImage} 
                            alt="Campaign preview" 
                            className="mx-auto max-h-40 object-contain rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImage(null);
                              setFormData(prev => ({ ...prev, featuredImage: null }));
                            }}
                            className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                            Drag and drop an image, or <span className="text-emerald-600 dark:text-emerald-400">browse</span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                            Recommended size: 1200x630px, JPG or PNG
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        id="featuredImage"
                        name="featuredImage"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${
                          previewImage ? 'pointer-events-none' : ''
                        }`}
                      />
                    </div>
                    {errors.featuredImage && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.featuredImage}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Donor Statistics */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Donor Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <Users className="h-4 w-4 mr-2" /> Total Donors
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {campaignId === "CAM-001" ? "45" : "67"}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <Heart className="h-4 w-4 mr-2" /> Average Donation
                    </div>
                    <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{campaignId === "CAM-001" ? "444" : "448"}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <Clock className="h-4 w-4 mr-2" /> Daily Average
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      ₹{campaignId === "CAM-001" ? "769" : "698"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Additional Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Additional Notes <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any additional information or special requirements..."
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 dark:text-gray-200"
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveSection("basic")}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-sm font-medium hover:bg-white/20 transition-all duration-300 flex items-center"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("settings")}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-300 flex items-center shadow-lg"
                >
                  Next: Campaign Settings
                </button>
              </div>
            </div>
          )}
          
          {/* Campaign Settings Section */}
          {activeSection === "settings" && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-300 flex items-start">
                <Info className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <p>Configure how your campaign will behave and interact with donors. These settings can be changed later.</p>
              </div>
              
              <div className="space-y-4">
                {/* Recurring Donations */}
                <div className="flex items-start bg-white/5 p-4 rounded-lg">
                  <div className="flex h-5 items-center">
                    <input
                      id="allowRecurringDonations"
                      name="allowRecurringDonations"
                      type="checkbox"
                      checked={formData.allowRecurringDonations}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="allowRecurringDonations" className="font-medium text-gray-700 dark:text-gray-300">
                      Allow Recurring Donations
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Let donors set up recurring monthly contributions to this campaign
                    </p>
                  </div>
                </div>
                
                {/* Email Reminders */}
                <div className="flex items-start bg-white/5 p-4 rounded-lg">
                  <div className="flex h-5 items-center">
                    <input
                      id="enableEmailReminders"
                      name="enableEmailReminders"
                      type="checkbox"
                      checked={formData.enableEmailReminders}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enableEmailReminders" className="font-medium text-gray-700 dark:text-gray-300">
                      Enable Email Reminders
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Send automatic email reminders to donors about campaign progress
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-start bg-white/5 p-4 rounded-lg">
                  <div className="flex h-5 items-center">
                    <input
                      id="showProgressBar"
                      name="showProgressBar"
                      type="checkbox"
                      checked={formData.showProgressBar}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="showProgressBar" className="font-medium text-gray-700 dark:text-gray-300">
                      Display Progress Bar
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Show a visual indicator of campaign progress to donors
                    </p>
                  </div>
                </div>
                
                {/* Thank You Messages */}
                <div className="flex items-start bg-white/5 p-4 rounded-lg">
                  <div className="flex h-5 items-center">
                    <input
                      id="sendThankYouMessages"
                      name="sendThankYouMessages"
                      type="checkbox"
                      checked={formData.sendThankYouMessages}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="sendThankYouMessages" className="font-medium text-gray-700 dark:text-gray-300">
                      Send Thank You Messages
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Automatically send thank you messages to donors after contributions
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Summary Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 px-4 py-3 border-b border-white/10">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white">Campaign Summary</h3>
                </div>
                <div className="p-4 text-sm">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    <div className="sm:col-span-2 flex justify-between py-1 border-b border-dashed border-gray-200 dark:border-gray-700">
                      <dt className="text-gray-500 dark:text-gray-400">Campaign Name</dt>
                      <dd className="text-gray-700 dark:text-gray-300 font-medium">
                        {formData.name || "Not specified"}
                      </dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-dashed border-gray-200 dark:border-gray-700">
                      <dt className="text-gray-500 dark:text-gray-400">Category</dt>
                      <dd className="text-gray-700 dark:text-gray-300 font-medium">
                        {formData.type ? campaignTypes.find(t => t.value === formData.type)?.label : "Not specified"}
                      </dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-dashed border-gray-200 dark:border-gray-700">
                      <dt className="text-gray-500 dark:text-gray-400">Goal Amount</dt>
                      <dd className="text-gray-700 dark:text-gray-300 font-medium">
                        {formData.goal ? `₹${formData.goal}` : "Not specified"}
                      </dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-dashed border-gray-200 dark:border-gray-700">
                      <dt className="text-gray-500 dark:text-gray-400">Start Date</dt>
                      <dd className="text-gray-700 dark:text-gray-300 font-medium">
                        {formData.startDate || "Not specified"}
                      </dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-dashed border-gray-200 dark:border-gray-700">
                      <dt className="text-gray-500 dark:text-gray-400">End Date</dt>
                      <dd className="text-gray-700 dark:text-gray-300 font-medium">
                        {formData.endDate || "Not specified"}
                      </dd>
                    </div>
                    <div className="sm:col-span-2 flex justify-between py-1">
                      <dt className="text-gray-500 dark:text-gray-400">Target Audience</dt>
                      <dd className="text-gray-700 dark:text-gray-300 font-medium text-right">
                        {formData.targetAudience || "General"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveSection("details")}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-sm font-medium hover:bg-white/20 transition-all duration-300 flex items-center"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg text-sm font-medium shadow-lg flex items-center ${
                    isSubmitting 
                      ? 'opacity-70 cursor-not-allowed' 
                      : 'hover:from-emerald-600 hover:to-green-600'
                  } transition-all duration-300`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Campaign
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      
      {/* Activity Log Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-emerald-500" />
          Recent Campaign Activity
        </h3>
        <div className="space-y-4">
          <div className="border-l-2 border-emerald-500 pl-4 pb-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-white">Campaign Details Updated</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday at 5:30 PM • Admin: Salman</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Changed campaign end date from 15 Feb 2024 to 28 Feb 2024</p>
          </div>
          
          <div className="border-l-2 border-blue-500 pl-4 pb-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-white">New Donation Received</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago at 9:15 AM</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Received ₹5,000 donation from Ahmed K.</p>
          </div>
          
          <div className="border-l-2 border-purple-500 pl-4 pb-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-white">Campaign Created</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">15 Nov 2023 at 10:00 AM • Admin: Salman</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Campaign was created with an initial goal of ₹{formData.goal}</p>
          </div>
        </div>
        
        <button className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-2 flex items-center">
          View Full Activity Log
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}