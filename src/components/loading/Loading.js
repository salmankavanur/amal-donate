// src/components/Loading.js
"use client"; // Since this is a client-side component

import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Spinner */}
      <div className="w-8 h-8 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin border-t-transparent"></div>
      {/* Text */}
      <span className="text-lg text-gray-700 font-semibold">Loading...</span>
    </div>
  );
};

export default Loading;