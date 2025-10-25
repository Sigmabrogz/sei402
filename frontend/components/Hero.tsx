'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 relative bg-brutal-white">
      <div className="brutal-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Professional Hero */}
          <div className="mb-12">
            <h1 className="text-7xl md:text-9xl font-black text-brutal-black mb-4">
              s402
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-2 w-32 bg-brutal-red"></div>
              <span className="text-2xl font-bold">FOR SEI</span>
              <div className="h-2 w-32 bg-brutal-red"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              HTTP-402 Payments on the Fastest EVM
            </h2>
          </div>

          {/* Sei Advantages - REAL DATA */}
          <div className="bg-brutal-black text-brutal-white p-12 border-8 border-brutal-red mb-12">
            <h3 className="text-3xl font-bold mb-8 text-brutal-red">Why Sei Dominates</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-5xl font-black text-brutal-red mb-2">400ms</h4>
                <p className="text-xl font-bold">Time to Finality</p>
                <p className="text-sm opacity-80">Fastest finality in crypto. Not 2 seconds. 400 milliseconds.</p>
              </div>
              <div>
                <h4 className="text-5xl font-black text-brutal-red mb-2">12,500</h4>
                <p className="text-xl font-bold">TPS Capacity</p>
                <p className="text-sm opacity-80">Parallel processing. Real throughput.</p>
              </div>
              <div>
                <h4 className="text-5xl font-black text-brutal-red mb-2">$0.00001</h4>
                <p className="text-xl font-bold">Transaction Cost</p>
                <p className="text-sm opacity-80">Actual gas cost on Sei. Micropayments finally work.</p>
              </div>
              <div>
                <h4 className="text-5xl font-black text-brutal-red mb-2">Native</h4>
                <p className="text-xl font-bold">USDC Integration</p>
                <p className="text-sm opacity-80">No bridges. No wrapping. Direct USDC.</p>
              </div>
            </div>
          </div>

          {/* Professional Attribution */}
          <div className="bg-brutal-white border-4 border-brutal-black p-8 mb-12">
            <p className="text-xl font-mono mb-4">
              Built on <span className="font-bold">x402 by Coinbase</span>
            </p>
            <p className="text-lg">
              We adapted their protocol for Sei&apos;s superior performance. 
              The innovation is theirs. The optimization is ours.
            </p>
          </div>

          {/* Real Integration Code */}
          <div className="bg-brutal-black text-brutal-white p-8 mb-12">
            <h3 className="text-2xl font-bold mb-4 text-brutal-red">Actual Integration</h3>
            <pre className="font-mono text-sm overflow-x-auto">
{`// Real code. No abstractions.
import { paymentMiddleware } from 's402-express';

app.use(paymentMiddleware(
  "0x38A3cba9B40b84a95A94d2B9F6ad6b5457C1317C", // Your Sei address
  { "/api/data": "0.001" } // $0.001 USDC per request
));

// That's it. Your API accepts payments on Sei.`}
            </pre>
          </div>

          {/* CTAs */}
          <div className="flex flex-col md:flex-row gap-6">
            <motion.a
              href="#demo"
              className="px-12 py-6 bg-brutal-red text-brutal-white font-black text-xl border-4 border-brutal-black text-center"
              style={{ boxShadow: '8px 8px 0 #000' }}
              whileHover={{ 
                transform: 'translate(-4px, -4px)',
                boxShadow: '12px 12px 0 #000'
              }}
              whileTap={{ 
                transform: 'translate(2px, 2px)',
                boxShadow: '4px 4px 0 #000'
              }}
            >
              TEST WITH REAL USDC
            </motion.a>

            <motion.a
              href="https://github.com/Sigmabrogz/sei402"
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-6 bg-brutal-white text-brutal-black font-black text-xl border-4 border-brutal-black text-center"
              style={{ boxShadow: '8px 8px 0 #000' }}
              whileHover={{ 
                transform: 'translate(-4px, -4px)',
                boxShadow: '12px 12px 0 #000'
              }}
              whileTap={{ 
                transform: 'translate(2px, 2px)',
                boxShadow: '4px 4px 0 #000'
              }}
            >
              VIEW SOURCE
            </motion.a>
          </div>

          {/* Sei Network Stats */}
          <div className="mt-16 p-8 bg-brutal-red text-brutal-white">
            <h3 className="text-2xl font-bold mb-4">Sei Network Reality Check</h3>
            <ul className="space-y-2 font-mono">
              <li>• Twin-turbo consensus: Optimistic + Pessimistic paths</li>
              <li>• Parallelized EVM: Not sequential like others</li>
              <li>• SeiDB: Purpose-built state storage</li>
              <li>• Native order matching: DEX performance built-in</li>
              <li>• $5B+ TVL ecosystem growing fast</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}