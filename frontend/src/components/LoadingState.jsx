import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          <Sparkles className="text-purple-500 animate-pulse" size={48} />
          <Loader2 className="absolute inset-0 text-blue-500 animate-spin" size={48} />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Please Wait</h3>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState;