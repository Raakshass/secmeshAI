'use client';

import React, { useState } from 'react';
import Web3 from 'web3';
import { useRouter } from 'next/navigation'; // Use useRouter for redirecting
import './globals.css'

// MetaMask and smart contract interaction logic
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [account, setAccount] = useState('');  // State to store connected account
  const [signInMessage, setSignInMessage] = useState('');  // State for MetaMask messages
  const router = useRouter();  // For navigation

  // MetaMask connection function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
        setSignInMessage('Connected to MetaMask');
      } catch (error) {
        setSignInMessage('Failed to connect to MetaMask');
      }
    } else {
      setSignInMessage('MetaMask not detected');
    }
  };

  // Handle button click to proceed
  const handleProceed = () => {
    if (account) {
      // If connected to MetaMask, proceed to the models page
      router.push('/models');
    } else {
      setSignInMessage('Please connect MetaMask before proceeding.');
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="area absolute top-0 left-0 w-full h-full z-0">
          <ul className="circles">
            {[...Array(10)].map((_, index) => (
              <li key={index}></li>
            ))}
          </ul>
        </div>

        {/* Large Heading at the Top */}
        <div className="flex flex-col items-center mb-16 z-10">
        <h1 className="text-9xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-black to-gray-800">
  SecMesh AI
</h1>

        </div>

        {/* Content */}
        <div className="flex flex-col items-center space-y-10 z-10 text-black w-full max-w-md px-12 py-20 rounded-3xl bg-opacity-50 backdrop-blur-md bg-gradient-to-r from-purple-600 to-blue-700 shadow-2xl">
          

          {/* MetaMask Connect Button */}
          <div className="w-full space-y-10">
            <button
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold text-2xl py-6 px-12 rounded-full shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
              onClick={connectWallet}
            >
              {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Sign In with MetaMask'}
            </button>
            {signInMessage && (
              <p className="text-xl font-semibold text-center bg-gradient-to-r from-purple-500 to-cyan-500 py-5 px-7 rounded-lg shadow-lg">
                {signInMessage}
              </p>
            )}
          </div>

          {/* Proceed Button */}
          <div className="w-full">
            <button
              onClick={handleProceed}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold text-2xl py-6 px-12 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
            >
              Proceed to Models
            </button>
          </div>
        </div>

        {/* Styles for the animated background */}
        <style jsx>{`
          .area {
            background: linear-gradient(135deg, #8f94fb 0%, #4e54c8 100%);
            width: 100%;
            height: 100vh;
            position: absolute;
            z-index: -1;
            top: 0;
            left: 0;
            overflow: hidden;
          }

          .circles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
          }

          .circles li {
            position: absolute;
            display: block;
            list-style: none;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.2);
            animation: animate 25s linear infinite;
            bottom: -150px;
            border-radius: 50%;
          }

          .circles li:nth-child(1) {
            left: 25%;
            width: 80px;
            height: 80px;
            animation-delay: 0s;
          }

          .circles li:nth-child(2) {
            left: 10%;
            width: 20px;
            height: 20px;
            animation-delay: 2s;
            animation-duration: 12s;
          }

          .circles li:nth-child(3) {
            left: 70%;
            width: 20px;
            height: 20px;
            animation-delay: 4s;
          }

          .circles li:nth-child(4) {
            left: 40%;
            width: 60px;
            height: 60px;
            animation-delay: 0s;
            animation-duration: 18s;
          }

          .circles li:nth-child(5) {
            left: 65%;
            width: 20px;
            height: 20px;
            animation-delay: 0s;
          }

          .circles li:nth-child(6) {
            left: 75%;
            width: 110px;
            height: 110px;
            animation-delay: 3s;
          }

          .circles li:nth-child(7) {
            left: 35%;
            width: 150px;
            height: 150px;
            animation-delay: 7s;
          }

          .circles li:nth-child(8) {
            left: 50%;
            width: 25px;
            height: 25px;
            animation-delay: 15s;
            animation-duration: 45s;
          }

          .circles li:nth-child(9) {
            left: 20%;
            width: 15px;
            height: 15px;
            animation-delay: 2s;
            animation-duration: 35s;
          }

          .circles li:nth-child(10) {
            left: 85%;
            width: 150px;
            height: 150px;
            animation-delay: 0s;
            animation-duration: 11s;
          }

          @keyframes animate {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
              border-radius: 0;
            }
            100% {
              transform: translateY(-1000px) rotate(720deg);
              opacity: 0;
              border-radius: 50%;
            }
          }
        `}</style>
      </div>
    </>
  );
}
