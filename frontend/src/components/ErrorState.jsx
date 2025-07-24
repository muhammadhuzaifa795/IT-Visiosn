import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="flex items-center justify-center mb-4">
        <AlertCircle className="text-red-500" size={48} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;