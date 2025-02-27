"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Upload, 
  Save, 
  X, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Banknote 
} from "lucide-react";

export default function CreateCampaignPage() {
  // Define the form data type
  interface FormData {
    name: string;
    type: string;
    goal: string;
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
    name: "",
    type: "",
    goal: "",
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("basic");

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
      
      setFormData(prev => ({ ...prev, featuredImage: file }));
      
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
    
    // Image validation (optional for demo)
    // if (!formData.featuredImage) newErrors.featuredImage = "Campaign image is required";
    
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
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send the form data to your API
      console.log("Form submitted:", formData);
      
      // Show success message or redirect
      alert("Campaign created successfully!");
      // You can redirect using Next.js router here
      
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
            Create New Campaign
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Set up your fundraising campaign details, goals, and timeline
          </p>
        </div>
        
        <Link 
          href="/campaigns/ongoing" 
          className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-sm font-medium hover:bg-white/20 transition-all duration-300 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Campaigns
        </Link>
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
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300 flex items-start">
                <Info className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <p>Start by providing the basic information about your campaign. You can edit these details later if needed.</p>
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
                <p>Add visual content and additional details to make your campaign more appealing to potential donors.</p>
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
                      Creating Campaign...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Campaign
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      
      {/* Tips Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-emerald-500" />
          Tips for Creating Successful Campaigns
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex">
            <div className="mr-4 flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-1">Set Clear Goals</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Define specific and realistic fundraising targets with a clear purpose.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="mr-4 flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-1">Tell Your Story</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share compelling stories about the impact donors will make.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="mr-4 flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-1">Use Quality Images</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                High-quality visuals increase engagement and donation likelihood.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="mr-4 flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-1">Engage Regularly</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep donors updated on progress and the impact of their contributions.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="mr-4 flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-1">Show Transparency</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Be open about how funds will be used to build trust with donors.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="mr-4 flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-1">Express Gratitude</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Always thank your donors promptly and acknowledge their support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}