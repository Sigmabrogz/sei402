'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 relative">
      <div className="brutal-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Title */}
          <div className="mb-8">
            <h1 
              className="text-6xl md:text-8xl font-black text-brutal-red glitch-text"
              data-text="s402 for Sei"
            >
              s402 for Sei
            </h1>
            <div className="mt-4 transform -rotate-1">
              <h2 className="text-2xl md:text-3xl font-bold bg-brutal-yellow inline-block px-4 py-2 border-4 border-brutal-black">
                HTTP-402 Payments, Adapted for Sei&apos;s Speed
              </h2>
            </div>
          </div>

          {/* Honest Introduction */}
          <div className="brutal-box p-8 mb-12 max-w-4xl transform rotate-1">
            <p className="text-lg font-mono leading-relaxed">
              <span className="text-brutal-red font-bold">We didn&apos;t invent this.</span> Coinbase created x402 - 
              a brilliant protocol for HTTP payments. We adapted it for Sei because 
              Sei&apos;s parallel EVM and native USDC make it perfect for micropayments.
            </p>
            <p className="mt-4 text-lg font-mono">
              That&apos;s it. That&apos;s the story. No BS.
            </p>
          </div>

          {/* Real Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div 
              className="brutal-box p-6"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-4xl font-black text-brutal-red">~2s</h3>
              <p className="font-mono text-sm mt-2">Settlement Time</p>
              <p className="text-xs mt-1 opacity-70">Actual Sei speed</p>
            </motion.div>

            <motion.div 
              className="brutal-box p-6"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-4xl font-black text-brutal-red">$0.001</h3>
              <p className="font-mono text-sm mt-2">Min Payment</p>
              <p className="text-xs mt-1 opacity-70">Real USDC</p>
            </motion.div>

            <motion.div 
              className="brutal-box p-6"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-4xl font-black text-brutal-red">1 line</h3>
              <p className="font-mono text-sm mt-2">Integration</p>
              <p className="text-xs mt-1 opacity-70">Actually ~30 min setup</p>
            </motion.div>

            <motion.div 
              className="brutal-box p-6"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-4xl font-black text-brutal-red">MIT</h3>
              <p className="font-mono text-sm mt-2">License</p>
              <p className="text-xs mt-1 opacity-70">Open Source</p>
            </motion.div>
          </div>

          {/* What's Real */}
          <div className="bg-brutal-black text-brutal-white p-8 border-8 border-brutal-red transform -rotate-1">
            <h3 className="text-2xl font-bold mb-4 text-brutal-red">What&apos;s Actually Real:</h3>
            <ul className="space-y-2 font-mono">
              <li className="flex items-start">
                <span className="text-brutal-red mr-2">✓</span>
                <span>Working on Sei testnet & mainnet right now</span>
              </li>
              <li className="flex items-start">
                <span className="text-brutal-red mr-2">✓</span>
                <span>Uses actual USDC contracts (verified on-chain)</span>
              </li>
              <li className="flex items-start">
                <span className="text-brutal-red mr-2">✓</span>
                <span>~2 second settlement (Sei&apos;s actual speed)</span>
              </li>
              <li className="flex items-start">
                <span className="text-brutal-red mr-2">✓</span>
                <span>Open source, you can verify everything</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-6 mt-12">
            <motion.a
              href="#demo"
              className="brutal-button text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Real Demo
              <span className="block text-sm font-normal mt-1">
                (Uses Testnet USDC)
              </span>
            </motion.a>

            <motion.a
              href="https://github.com/YourOrg/s402-sei"
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-button bg-brutal-white text-brutal-black text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Source Code
              <span className="block text-sm font-normal mt-1">
                (Verify Everything)
              </span>
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-20 right-10 text-9xl font-black text-brutal-red opacity-5 transform rotate-12">
        402
      </div>
    </section>
  )
}


