import React from "react";
import { Link } from "react-router-dom";

const PaymentFailurePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <svg className="mx-auto mb-4 w-16 h-16 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9l6 6m0-6l-6 6" />
          </svg>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h1>
          <p className="text-gray-700 mb-4">Your payment could not be processed.<br/>Please try again later.</p>
        </div>
        <Link to="/blog/pricing/register" className="inline-block px-6 py-2 bg-black text-white rounded hover:bg-gray-900 transition-colors font-semibold">Try Again</Link>
        <div className="mt-4">
          <Link to="/blog" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;

