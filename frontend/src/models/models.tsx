'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import usePromptStore from '../../app/promptStore';  // Make sure the path to promptStore is correct

export default function Models() {
  const [localQuery, setLocalQuery] = useState('');  // Local state for query
  const { setQuery } = usePromptStore();  // Zustand store to set query globally
  const router = useRouter();

  const handleSubmit = () => {
    if (localQuery.trim()) {
      try {
        // Store the query in Zustand instead of localStorage
        setQuery(localQuery);

        // Navigate to the next page (prompt page)
        router.push('/prompt');
      } catch (error) {
        console.error("Error during submission:", error);
        alert('An error occurred. Please try again.');
      }
    } else {
      alert('Please enter a query.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 text-gray-800">
      <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
        Enter Your Type of Model
      </h2>

      {/* Query Input */}
      <div className="w-full max-w-md mb-8">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Enter your query here..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        className="bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white font-bold py-3 px-10 rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
        onClick={handleSubmit}
      >
        Proceed to Enter Prompt
      </button>
    </div>
  );
}
