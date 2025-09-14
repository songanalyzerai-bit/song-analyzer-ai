import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/80 rounded-2xl backdrop-blur-sm z-10">
      <div className="w-16 h-16 border-4 border-t-transparent border-fuchsia-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-slate-200">AI is analyzing your song...</p>
    </div>
  );
};

export default LoadingSpinner;
