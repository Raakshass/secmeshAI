'use client';

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import usePromptStore from '../promptStore';  // Zustand store for global state

// Access contract address and API URL from environment variables
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Contract ABI (you can store this externally or leave it hardcoded)
const contractABI: AbiItem[] = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "uploader", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "cid", "type": "string" }
    ],
    "name": "CIDStored",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "string", "name": "processedContent", "type": "string" }
    ],
    "name": "PredictionProcessed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "requester", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "content", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "content2", "type": "string" }
    ],
    "name": "PredictionRequested",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "string", "name": "content1", "type": "string" }, { "internalType": "string", "name": "content2", "type": "string" }],
    "name": "requestPrediction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "cid", "type": "string" }],
    "name": "storeCID",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Function to interact with the smart contract and listen for output event
async function interactWithContract(query: string, prompt: string, setOutput: React.Dispatch<React.SetStateAction<string>>) {
  try {
    const { ethereum } = window as any;
    if (!ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    // Request MetaMask connection
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please ensure MetaMask is connected.");
    }

    const web3 = new Web3(ethereum);
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Send transaction to the smart contract
    await contract.methods.requestPrediction(query, prompt).send({
      from: accounts[0],
    });

    // Listen for the PredictionProcessed event to get the prediction output
    contract.events
      .PredictionProcessed({ fromBlock: 'latest' })
      .on('data', (event: { returnValues: { processedContent: string } }) => {
        const processedContent = event.returnValues.processedContent;
        setOutput(`Prediction: ${processedContent}`);
      })
      .on('error', (error: any) => {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        setOutput(`Error fetching prediction output: ${errorMessage}`);
      });
  } catch (error) {
    console.error("Error sending prediction request:", error);
  }
}

// Function to upload model file to the backend
async function uploadModelFile(file: File, setOutput: React.Dispatch<React.SetStateAction<string>>) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', '123');  // Example user ID

  try {
    const response = await fetch(`${apiUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    const result = await response.json();
    setOutput(`File uploaded successfully! Response: ${JSON.stringify(result)}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during file upload";
    setOutput(`Error uploading file: ${errorMessage}`);
  }
}

// Component to handle user inputs and interaction
export default function ModelsPage() {
  const [model, setModel] = useState('');  // Local state for model
  const [prompt, setPrompt] = useState('');  // Local state for prompt
  const [file, setFile] = useState<File | null>(null);  // State to handle file upload
  const [output, setOutput] = useState('');  // State to store the output of the transaction
  const { setQuery, setUserInput } = usePromptStore();  // Zustand store for global state

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!model.trim() && !file) {
      alert("Either model text or file is required.");
      return;
    }

    if (!prompt.trim()) {
      alert("Prompt is required.");
      return;
    }

    try {
      // Handle file upload if file is provided
      if (file) {
        await uploadModelFile(file, setOutput);
      }

      // Set query and user input in Zustand
      setQuery(model);
      setUserInput(prompt);

      // Interact with smart contract to submit queries
      await interactWithContract(model, prompt, setOutput);

    } catch (error) {
      console.error("Submission error:", error);
      setOutput(`Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 text-gray-800 mydiv">
      <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
        Enter Your Model and Prompt
      </h2>

      {/* Model Input */}
      <div className="w-full max-w-md mb-4">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="Enter the model you want (optional if uploading file)..."
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
      </div>

      {/* Prompt Input */}
      <div className="w-full max-w-md mb-8">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button
        id="submitButton"
        className="bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white font-bold py-3 px-10 rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
        onClick={handleSubmit}
      >
        Submit Model and Prompt
      </button>

      {/* File Upload Option - Moved to the bottom */}
      <div className="w-full max-w-md mt-8">
        <input
          type="file"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleFileChange}
        />
      </div>

      {/* Output Section */}
      {output && (
        <div id="output" className="mt-8 w-full max-w-md p-4 bg-white border border-gray-300 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Output:</h3>
          <p className="text-gray-600">{output}</p>
        </div>
      )}
    </div>
  );
}
