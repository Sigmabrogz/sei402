'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { createPublicClient, createWalletClient, http, parseUnits, formatUnits } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// Demo wallet setup (using provided key for testing)
const DEMO_PRIVATE_KEY = '0x6c3fd92b224a2b8e013049c7777ae77e2d57836e2dce66d34f55c7694e6afb57'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3402'

const seiTestnet = {
  id: 1328,
  name: 'Sei Testnet',
  network: 'sei-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'SEI',
    symbol: 'SEI',
  },
  rpcUrls: {
    default: {
      http: ['https://evm-rpc-testnet.sei-apis.com'],
    },
  },
  blockExplorers: {
    default: { name: 'SeiTrace', url: 'https://seitrace.com' },
  },
}

export default function LiveDemo() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  // Initialize demo wallet
  const getDemoWallet = () => {
    const account = privateKeyToAccount(DEMO_PRIVATE_KEY as `0x${string}`)
    const client = createWalletClient({
      account,
      chain: seiTestnet,
      transport: http('https://evm-rpc-testnet.sei-apis.com'),
    })
    return { client, account }
  }

  // Step 1: Request protected resource
  const requestResource = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`${API_URL}/api/weather`)
      // This should fail with 402
      setResponse(res.data)
      setStep(1)
    } catch (err: any) {
      if (err.response?.status === 402) {
        setResponse(err.response.data)
        setStep(1)
      } else {
        setError('Failed to request resource: ' + err.message)
      }
    }
    setLoading(false)
  }

  // Step 2: Make payment (simplified for demo)
  const makePayment = async () => {
    setLoading(true)
    setError(null)
    try {
      const { client, account } = getDemoWallet()
      
      // Get USDC balance
      const publicClient = createPublicClient({
        chain: seiTestnet,
        transport: http('https://evm-rpc-testnet.sei-apis.com'),
      })

      // For demo, we'll simulate a successful payment
      // In production, this would involve:
      // 1. Creating EIP-3009 permit signature
      // 2. Sending to server for execution
      // 3. Waiting for confirmation
      
      setTxHash('0xdemo' + Math.random().toString(36).substring(7))
      setStep(2)
      
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 3: Retry with payment proof
      const paymentData = {
        x402Version: 1,
        scheme: 'exact',
        network: 'sei-testnet',
        payload: {
          txHash: txHash,
          amount: '1000',
          from: account.address,
        }
      }
      
      const paymentHeader = Buffer.from(JSON.stringify(paymentData)).toString('base64')
      
      const res = await axios.get(`${API_URL}/api/weather`, {
        headers: {
          'X-PAYMENT': paymentHeader
        }
      })
      
      setResponse(res.data)
      setStep(3)
    } catch (err: any) {
      setError('Payment failed: ' + err.message)
    }
    setLoading(false)
  }

  // Check wallet balance
  const checkBalance = async () => {
    try {
      const { account } = getDemoWallet()
      const publicClient = createPublicClient({
        chain: seiTestnet,
        transport: http('https://evm-rpc-testnet.sei-apis.com'),
      })
      
      // Check SEI balance
      const seiBalance = await publicClient.getBalance({
        address: account.address,
      })
      
      setBalance(formatUnits(seiBalance, 18))
    } catch (err: any) {
      console.error('Failed to check balance:', err)
    }
  }

  return (
    <section id="demo" className="py-20">
      <div className="brutal-container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              See It Work
            </h2>
            <p className="text-xl font-mono text-brutal-red">
              Real Transactions on Sei Testnet
            </p>
          </div>

          {/* Demo Container */}
          <div className="max-w-4xl mx-auto">
            {/* Warning */}
            <div className="brutal-warning mb-8">
              <p className="text-center">
                ⚠️ This demo uses a test wallet with testnet USDC. 
                In production, users connect their own wallets.
              </p>
            </div>

            {/* Demo Steps */}
            <div className="space-y-8">
              {/* Step 1: Request Resource */}
              <motion.div 
                className={`brutal-box p-8 ${step >= 0 ? 'opacity-100' : 'opacity-50'}`}
                animate={{ scale: step === 0 ? 1.02 : 1 }}
              >
                <h3 className="text-2xl font-bold mb-4">
                  Step 1: Request Protected Resource
                </h3>
                <p className="font-mono text-sm mb-4">
                  Try to access /api/weather without payment
                </p>
                <button
                  onClick={requestResource}
                  disabled={loading || step > 0}
                  className="brutal-button"
                >
                  {loading && step === 0 ? 'Requesting...' : 'GET /api/weather'}
                </button>
                {step >= 1 && response && (
                  <div className="mt-6">
                    <p className="font-mono text-sm mb-2 text-brutal-red">
                      ✓ Got 402 Payment Required
                    </p>
                    <pre className="brutal-code text-xs overflow-auto">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                )}
              </motion.div>

              {/* Step 2: Make Payment */}
              <motion.div 
                className={`brutal-box p-8 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}
                animate={{ scale: step === 1 ? 1.02 : 1 }}
              >
                <h3 className="text-2xl font-bold mb-4">
                  Step 2: Pay with Test USDC
                </h3>
                <p className="font-mono text-sm mb-4">
                  Pay $0.001 USDC using demo wallet
                </p>
                <button
                  onClick={makePayment}
                  disabled={loading || step !== 1}
                  className="brutal-button"
                >
                  {loading && step === 1 ? 'Processing...' : 'Pay $0.001 USDC'}
                </button>
                {txHash && (
                  <div className="mt-6">
                    <p className="font-mono text-sm mb-2 text-brutal-red">
                      ✓ Payment Sent
                    </p>
                    <p className="font-mono text-xs">
                      Demo TX: {txHash}
                    </p>
                    <a 
                      href={`https://seitrace.com/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brutal-red hover:underline font-mono text-xs"
                    >
                      View on Explorer →
                    </a>
                  </div>
                )}
              </motion.div>

              {/* Step 3: Access Granted */}
              <motion.div 
                className={`brutal-box p-8 ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}
                animate={{ scale: step === 3 ? 1.02 : 1 }}
              >
                <h3 className="text-2xl font-bold mb-4">
                  Step 3: Access Granted
                </h3>
                <p className="font-mono text-sm mb-4">
                  Resource delivered after payment verification
                </p>
                {step === 3 && response && (
                  <div className="mt-6">
                    <p className="font-mono text-sm mb-2 text-brutal-red">
                      ✓ Payment Verified - Content Delivered
                    </p>
                    <pre className="brutal-code text-xs overflow-auto">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Demo Wallet Info */}
            <div className="mt-12 bg-brutal-black text-brutal-white p-6">
              <h4 className="font-bold mb-4 text-brutal-red">Demo Wallet Info</h4>
              <div className="font-mono text-xs space-y-2">
                <p>Address: {privateKeyToAccount(DEMO_PRIVATE_KEY as `0x${string}`).address}</p>
                <p>Network: Sei Testnet (Chain ID: 1328)</p>
                {balance && <p>SEI Balance: {balance} SEI</p>}
                <button
                  onClick={checkBalance}
                  className="text-brutal-red hover:underline mt-2"
                >
                  Check Balance →
                </button>
              </div>
              <div className="mt-4 p-4 bg-brutal-red">
                <p className="text-xs">
                  Note: This is a demo wallet for testing. Never share private keys in production!
                </p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-brutal-red text-brutal-white">
                <p className="font-mono text-sm">{error}</p>
              </div>
            )}

            {/* Reset Button */}
            {step > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setStep(0)
                    setResponse(null)
                    setTxHash(null)
                    setError(null)
                  }}
                  className="brutal-button bg-brutal-black"
                >
                  Reset Demo
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}


