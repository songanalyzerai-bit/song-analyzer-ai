import React from 'react';

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-6 py-4 rounded-lg shadow-lg flex items-center max-w-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
                <h3 className="font-bold">An Error Occurred</h3>
                <p className="text-sm">{message}</p>
            </div>
        </div>
    </div>
  );
};

export default ErrorAlert;
