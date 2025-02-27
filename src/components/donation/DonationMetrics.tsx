"use client";
import React from "react";

const DonationMetrics = () => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Donation Metrics</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 backdrop-blur-sm p-5 rounded-xl hover:bg-white/30 transition-all duration-300 text-center shadow-lg">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Total Donations</h4>
          <p className="text-2xl font-bold text-brand-600 dark:text-white">₹50,000</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 backdrop-blur-sm p-5 rounded-xl hover:bg-white/30 transition-all duration-300 text-center shadow-lg">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Active Campaigns</h4>
          <p className="text-2xl font-bold text-brand-600 dark:text-white">3</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 backdrop-blur-sm p-5 rounded-xl hover:bg-white/30 transition-all duration-300 text-center shadow-lg">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">New Donations</h4>
          <p className="text-2xl font-bold text-brand-600 dark:text-white">5</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 backdrop-blur-sm p-5 rounded-xl hover:bg-white/30 transition-all duration-300 text-center shadow-lg">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Recurring Donors</h4>
          <p className="text-2xl font-bold text-brand-600 dark:text-white">20</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 backdrop-blur-sm p-5 rounded-xl hover:bg-white/30 transition-all duration-300 text-center shadow-lg">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Total Volunteers</h4>
          <p className="text-2xl font-bold text-brand-600 dark:text-white">50</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 backdrop-blur-sm p-5 rounded-xl hover:bg-white/30 transition-all duration-300 text-center shadow-lg">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Donations This Month</h4>
          <p className="text-2xl font-bold text-brand-600 dark:text-white">₹15,000</p>
        </div>
      </div>
    </div>
  );
};

export default DonationMetrics;