"use client";
import React, { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface SavedIndicatorProps {
  show: boolean;
}

export function SavedIndicator({ show }: SavedIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 3000); // Hide after 3 seconds
      
      return () => clearTimeout(timeout);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="
      fixed top-6 left-1/2 transform -translate-x-1/2
      flex items-center space-x-2
      bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md
      shadow-md
      animate-fade-in-out
    ">
      <FaCheckCircle className="text-green-500" />
      <span className="font-medium">Recording Saved!</span>
    </div>
  );
}