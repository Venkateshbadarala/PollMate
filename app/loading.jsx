// components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="loader relative w-12 h-12 border-4 border-gray-500
       rounded-full"></div>
    </div>
  );
};

export default LoadingSpinner;
