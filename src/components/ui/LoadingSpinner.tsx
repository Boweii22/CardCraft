import React from 'react';

export const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 24 }) => {
  return (
    <div 
      className="animate-spin rounded-full border-2 border-gray-600 border-t-cyan-400"
      style={{ width: size, height: size }}
    />
  );
};