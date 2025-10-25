'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { createPublicClient, createWalletClient, http, parseUnits, formatUnits } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// Using provided private key for demo - NEVER do this in production
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
  const [balance, setBalance] = useState<{ sei: string, usdc: string } | null>(null)

  // Initialize wallet
  const getWallet = () => {
    const account = privateKeyToAccount(DEMO_PRIVATE_KEY as `0x${string}`)
    const client = createWalletClient({
      account,
      chain: seiTestnet,
      transport: http('https://evm-rpc-testnet.sei-apis.com'),
    })
    const publicClient = createPublicClient({
      chain: seiTestnet,
      transport: http('https://evm-rpc-testnet.sei-apis.com'),
    })
    return { client, publicClient, account }
  }

  // Step 1: Request protected resource
  const requestResource = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`${API_URL}/api/weather`)
      setResponse(res.data)
      setStep(1)
    } catch (err: any) {
      if (err.response?.status === 402) {
        setResponse(err.response.data)
        setStep(1)
      } else {
        setError('Failed to connect: ' + err.message)
      }
    }
    setLoading(false)
  }

  // Step 2: Make REAL payment
  const makePayment = async () => {
    setLoading(true)
    setError(null)
    try {
      const { client, publicClient, account } = getWallet()
      
      if (!response?.accepts?.[0]) {
        throw new Error('No payment requirements found')
      }

      const paymentReq = response.accepts[0]
      
      // Create EIP-3009 transferWithAuthorization data
      const nonce = `0x${Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex')}`
      const validBefore = Math.floor(Date.now() / 1000) + 3600 // 1 hour
      
      const domain = {
        name: 'USDC',
        version: '2',
        chainId: seiTestnet.id,
        verifyingContract: paymentReq.asset as `0x${string}`,
      }

      const types = {
        TransferWithAuthorization: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'validAfter', type: 'uint256' },
          { name: 'validBefore', type: 'uint256' },
          { name: 'nonce', type: 'bytes32' },
        ],
      }

      const message = {
        from: account.address,
        to: paymentReq.payTo,
        value: BigInt(paymentReq.maxAmountRequired),
        validAfter: BigInt(0),
        validBefore: BigInt(validBefore),
        nonce: nonce as `0x${string}`,
      }

      // Sign the permit
      const signature = await client.signTypedData({
        domain,
        types,
        primaryType: 'TransferWithAuthorization',
        message,
      })

      // Create payment payload
      const paymentData = {
        x402Version: 1,
        scheme: 'exact',
        network: 'sei-testnet',
        payload: {
          type: 'eip3009',
          from: account.address,
          to: paymentReq.payTo,
          value: paymentReq.maxAmountRequired,
          validAfter: 0,
          validBefore: validBefore,
          nonce,
          signature,
        }
      }
      
      const paymentHeader = Buffer.from(JSON.stringify(paymentData)).toString('base64')
      
      // Send payment and get resource
      const res = await axios.get(`${API_URL}/api/weather`, {
        headers: {
          'X-PAYMENT': paymentHeader
        }
      })
      
      // If we get here, payment was successful
      setResponse(res.data)
      if (res.headers['x-payment-response']) {
        const paymentResponse = JSON.parse(
          Buffer.from(res.headers['x-payment-response'], 'base64').toString()
        )
        setTxHash(paymentResponse.txHash)
      }
      setStep(3)
    } catch (err: any) {
      setError('Payment failed: ' + err.message)
    }
    setLoading(false)
  }

  // Check wallet balances
  const checkBalance = async () => {
    try {
      const { publicClient, account } = getWallet()
      
      // Check SEI balance
      const seiBalance = await publicClient.getBalance({
        address: account.address,
      })
      
      // Check USDC balance
      const usdcAddress = '0x4fCF1784B31630811181f670Aea7A7bEF803eaED'
      const usdcBalance = await publicClient.readContract({
        address: usdcAddress as `0x${string}`,
        abi: [
          {
            name: 'balanceOf',
            type: 'function',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'view',
          },
        ],
        functionName: 'balanceOf',
        args: [account.address],
      })
      
      setBalance({
        sei: formatUnits(seiBalance, 18),
        usdc: formatUnits(usdcBalance as bigint, 6),
      })
    } catch (err: any) {
      console.error('Failed to check balance:', err)
      setError('Failed to check balance')
    }
  }

  return (
    <section id="demo" className="py-20 bg-brutal-white">
      <div className="brutal-container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-6xl md:text-7xl font-black mb-4">
              REAL PAYMENTS
            </h2>
            <p className="text-2xl font-bold text-brutal-red">
              No Mocks. Actual Sei Testnet Transactions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Steps */}
            <div className="space-y-8">
              {/* Step 1: Request Resource */}
              <motion.div 
                className={`bg-brutal-white border-4 border-brutal-black p-8 ${step >= 0 ? 'opacity-100' : 'opacity-50'}`}
                style={{ boxShadow: step === 0 ? '8px 8px 0 #FF0037' : '4px 4px 0 #000' }}
              >
                <h3 className="text-3xl font-bold mb-4">
                  Step 1: Request Protected Resource
                </h3>
                <button
                  onClick={requestResource}
                  disabled={loading || step > 0}
                  className="px-8 py-4 bg-brutal-red text-brutal-white font-bold text-xl border-4 border-brutal-black disabled:opacity-50"
                  style={{ boxShadow: '4px 4px 0 #000' }}
                >
                  {loading && step === 0 ? 'REQUESTING...' : 'GET /api/weather'}
                </button>
                {step >= 1 && response && (
                  <div className="mt-6">
                    <p className="font-bold text-brutal-red mb-2">
                      ✓ Got 402 Payment Required
                    </p>
                    <pre className="bg-brutal-black text-brutal-white p-4 text-xs overflow-auto">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                )}
              </motion.div>

              {/* Step 2: Make Payment */}
              <motion.div 
                className={`bg-brutal-white border-4 border-brutal-black p-8 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}
                style={{ boxShadow: step === 1 ? '8px 8px 0 #FF0037' : '4px 4px 0 #000' }}
              >
                <h3 className="text-3xl font-bold mb-4">
                  Step 2: Pay with REAL USDC
                </h3>
                <p className="mb-4 font-mono">
                  Sign EIP-3009 permit for gasless USDC transfer on Sei
                </p>
                <button
                  onClick={makePayment}
                  disabled={loading || step !== 1}
                  className="px-8 py-4 bg-brutal-red text-brutal-white font-bold text-xl border-4 border-brutal-black disabled:opacity-50"
                  style={{ boxShadow: '4px 4px 0 #000' }}
                >
                  {loading && step === 1 ? 'SIGNING...' : 'PAY $0.001 USDC'}
                </button>
                {txHash && (
                  <div className="mt-6">
                    <p className="font-bold text-brutal-red mb-2">
                      ✓ Payment Executed on Sei
                    </p>
                    <p className="font-mono text-sm break-all">
                      TX: {txHash}
                    </p>
                    <a 
                      href={`https://seitrace.com/tx/${txHash}?chain=atlantic-2`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brutal-red underline font-mono text-sm"
                    >
                      View on SeiTrace →
                    </a>
                  </div>
                )}
              </motion.div>

              {/* Step 3: Access Granted */}
              <motion.div 
                className={`bg-brutal-white border-4 border-brutal-black p-8 ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}
                style={{ boxShadow: step === 3 ? '8px 8px 0 #FF0037' : '4px 4px 0 #000' }}
              >
                <h3 className="text-3xl font-bold mb-4">
                  Step 3: Content Delivered
                </h3>
                {step === 3 && response && (
                  <div>
                    <p className="font-bold text-brutal-red mb-2">
                      ✓ Payment Verified - Resource Delivered
                    </p>
                    <pre className="bg-brutal-black text-brutal-white p-4 text-xs overflow-auto">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Wallet Info */}
            <div className="mt-12 bg-brutal-black text-brutal-white p-6 border-4 border-brutal-red">
              <h4 className="font-bold text-2xl mb-4 text-brutal-red">Test Wallet</h4>
              <div className="font-mono text-sm space-y-2">
                <p>Address: 0x38A3cba9B40b84a95A94d2B9F6ad6b5457C1317C</p>
                <p>Network: Sei Testnet (Atlantic-2)</p>
                {balance && (
                  <>
                    <p>SEI Balance: {balance.sei} SEI</p>
                    <p>USDC Balance: {balance.usdc} USDC</p>
                  </>
                )}
                <button
                  onClick={checkBalance}
                  className="text-brutal-red underline mt-2"
                >
                  Check Balance →
                </button>
              </div>
              <div className="mt-4 p-4 bg-brutal-red">
                <p className="text-xs font-bold">
                  This wallet has real USDC on Sei testnet. Transactions are real.
                </p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-brutal-red text-brutal-white font-bold">
                {error}
              </div>
            )}

            {/* Reset */}
            {step > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setStep(0)
                    setResponse(null)
                    setTxHash(null)
                    setError(null)
                  }}
                  className="px-8 py-4 bg-brutal-black text-brutal-white font-bold border-4 border-brutal-red"
                >
                  RESET DEMO
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}