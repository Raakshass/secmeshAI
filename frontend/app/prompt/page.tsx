'use client';

import Web3 from 'web3';
import { AbiItem } from 'web3-utils';  // Importing AbiItem for type checking
import usePromptStore from '../promptStore';  // Ensure the correct path to the Zustand store
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Use useRouter from next/navigation

// Smart Contract Address and ABI
const contractAddress = "0x5f40d02e2c9a39c68FaAb5e21715455089026a91"; // Sepolia contract address
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
    "inputs": [
      { "internalType": "string", "name": "content1", "type": "string" },
      { "internalType": "string", "name": "content2", "type": "string" }
    ],
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
  },
  {
    "inputs": [{ "internalType": "string", "name": "processedContent", "type": "string" }],
    "name": "storePrediction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCIDs",
    "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "cids",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// Function to interact with the smart contract
async function interactWithContract(query: string, userInput: string) {
  try {
    // Check if MetaMask (Ethereum provider) is available
    const { ethereum } = window as any;
    if (!ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    // Request account access from MetaMask
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const web3 = new Web3(ethereum);

    // Initialize the contract with ABI and address
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Send the transaction to the smart contract
    await contract.methods.requestPrediction(query, userInput).send({
      from: accounts[0],  // The address of the MetaMask account
    });

    console.log("Transaction successfully sent!");

  } catch (error) {
    console.error("Error interacting with the contract:", error);
  }
}

// Component to handle user inputs and interaction
export default function PromptPage() {
  const { query, userInput } = usePromptStore();  // Use Zustand store to get query and user input
  const router = useRouter();  // useRouter for redirecting

  // Run the contract interaction on page load
  useEffect(() => {
    if (!query || !userInput) {
      // If no query or userInput, redirect to models page
      router.push('/models');
    } else {
      interactWithContract(query, userInput);
    }
  }, [query, userInput, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-100 via-blue-100 to-indigo-100 text-gray-800">
      <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">
        Processing Your Prediction Request...
      </h2>
      <p className="text-lg">Query: {query}</p>
      <p className="text-lg">User Input: {userInput}</p>
    </div>
  );
}
