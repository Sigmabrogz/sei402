'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function DeveloperSection() {
  const [activeTab, setActiveTab] = useState('server')

  const codeExamples = {
    server: {
      title: 'Server Setup',
      language: 'javascript',
      code: `// 1. Install package
npm install s402-express viem

// 2. Add to your Express app
import express from 'express';
import { paymentMiddleware } from 's402-express';

const app = express();

// Your Sei address to receive payments
const RECIPIENT = "0xYourSeiAddress";

// Add payment middleware
app.use(paymentMiddleware(RECIPIENT, {
  "/api/premium": "0.01",  // $0.01 USDC
  "/api/data": "0.001"     // $0.001 USDC  
}));

// Your protected endpoints
app.get('/api/premium', (req, res) => {
  // Payment verified by middleware
  res.json({ data: "Premium content" });
});

app.listen(3000);`
    },
    client: {
      title: 'Client Integration',
      language: 'javascript',
      code: `// Using axios with s402 client
import axios from 'axios';
import { createPayment } from 's402/client';

async function fetchWithPayment(url) {
  try {
    // First request
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (error.response?.status === 402) {
      // Get payment requirements
      const requirements = error.response.data;
      
      // Create payment (user signs with wallet)
      const payment = await createPayment(requirements);
      
      // Retry with payment
      const response = await axios.get(url, {
        headers: {
          'X-PAYMENT': payment
        }
      });
      
      return response.data;
    }
    throw error;
  }
}`
    },
    config: {
      title: 'Configuration',
      language: 'javascript',
      code: `// Already configured for Sei in s402!
// But here's what's happening under the hood:

const seiConfig = {
  // Network settings
  network: 'sei-testnet',  // or 'sei' for mainnet
  chainId: 1328,           // 1329 for mainnet
  
  // USDC contract addresses (verified)
  usdcAddress: {
    testnet: '0x4fCF1784B31630811181f670Aea7A7bEF803eaED',
    mainnet: '0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392'
  },
  
  // RPC endpoints
  rpcUrl: {
    testnet: 'https://evm-rpc-testnet.sei-apis.com',
    mainnet: 'https://evm-rpc.sei-apis.com'
  },
  
  // Payment settings
  decimals: 6,        // USDC has 6 decimals
  minPayment: '1000', // 0.001 USDC minimum
};`
    }
  }

  return (
    <section id="developers" className="py-20">
      <div className="brutal-container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              For Developers
            </h2>
            <div className="inline-block bg-brutal-yellow px-6 py-3 transform -rotate-2">
              <p className="font-mono text-lg text-brutal-black">
                Integration takes ~30 minutes, not 30 seconds
              </p>
            </div>
            <p className="mt-4 text-lg font-mono">
              (We&apos;re honest about this)
            </p>
          </div>

          {/* Code Tabs */}
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-4 mb-8">
              {Object.keys(codeExamples).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-3 font-mono font-bold border-4 border-brutal-black transition-all ${
                    activeTab === key
                      ? 'bg-brutal-red text-brutal-white'
                      : 'bg-brutal-white text-brutal-black hover:bg-brutal-yellow'
                  }`}
                  style={{
                    boxShadow: activeTab === key ? '4px 4px 0 #000' : 'none',
                    transform: activeTab === key ? 'translate(-2px, -2px)' : 'none'
                  }}
                >
                  {codeExamples[key as keyof typeof codeExamples].title}
                </button>
              ))}
            </div>

            {/* Code Display */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <pre className="brutal-code overflow-auto">
                <code>{codeExamples[activeTab as keyof typeof codeExamples].code}</code>
              </pre>
            </motion.div>
          </div>

          {/* Real Integration Steps */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="brutal-box p-8">
              <h3 className="text-2xl font-bold mb-4 text-brutal-red">
                What You Actually Need
              </h3>
              <ul className="space-y-3 font-mono text-sm">
                <li className="flex items-start">
                  <span className="text-brutal-red mr-2">1.</span>
                  <span>A Sei wallet address to receive payments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brutal-red mr-2">2.</span>
                  <span>Node.js server (Express, Hono, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brutal-red mr-2">3.</span>
                  <span>Users with USDC on Sei</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brutal-red mr-2">4.</span>
                  <span>~30 minutes to integrate</span>
                </li>
              </ul>
            </div>

            <div className="brutal-box p-8 bg-brutal-black text-brutal-white">
              <h3 className="text-2xl font-bold mb-4 text-brutal-red">
                Common Issues (We&apos;ve Hit Them)
              </h3>
              <ul className="space-y-3 font-mono text-sm">
                <li className="flex items-start">
                  <span className="text-brutal-red mr-2">•</span>
                  <span><strong>CORS errors:</strong> Add proper headers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brutal-red mr-2">•</span>
                  <span><strong>No USDC:</strong> Get from faucet/DEX</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brutal-red mr-2">•</span>
                  <span><strong>Wrong network:</strong> Check chain ID</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brutal-red mr-2">•</span>
                  <span><strong>RPC limits:</strong> Use multiple endpoints</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Start Commands */}
          <div className="mt-12 bg-brutal-yellow p-8 border-4 border-brutal-black transform -rotate-1">
            <h3 className="text-2xl font-bold mb-4">Quick Start (Copy & Paste)</h3>
            <div className="bg-brutal-white p-4 font-mono text-sm">
              <div className="mb-4">
                <p className="text-brutal-red font-bold mb-2"># Clone and run locally:</p>
                <code className="block">git clone https://github.com/Sigmabrogz/sei402</code>
                <code className="block">cd sei402/server</code>
                <code className="block">npm install</code>
                <code className="block">npm start</code>
              </div>
              <div>
                <p className="text-brutal-red font-bold mb-2"># Test with curl:</p>
                <code className="block">curl http://localhost:3402/api/weather</code>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col md:flex-row gap-4">
              <a
                href="https://github.com/Sigmabrogz/sei402"
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-button"
              >
                View Full Documentation →
              </a>
              <a
                href="https://github.com/Sigmabrogz/sei402/tree/main/examples"
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-button bg-brutal-white text-brutal-black"
              >
                See More Examples →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


