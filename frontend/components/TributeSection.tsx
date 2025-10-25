'use client'

import { motion } from 'framer-motion'

export default function TributeSection() {
  return (
    <section id="tribute" className="py-20 bg-brutal-yellow">
      <div className="brutal-container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              Standing on Giants&apos; Shoulders
            </h2>
            <div className="inline-block bg-brutal-black text-brutal-white px-6 py-3 transform rotate-2">
              <p className="font-mono text-lg">Respect to the Original Builders</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* x402 Attribution */}
            <motion.div 
              className="bg-brutal-white p-8 border-4 border-brutal-black"
              style={{ boxShadow: '8px 8px 0 #000' }}
              whileHover={{ transform: 'translate(-4px, -4px)', boxShadow: '12px 12px 0 #000' }}
            >
              <h3 className="text-3xl font-bold mb-4 text-brutal-red">x402 by Coinbase</h3>
              <p className="text-lg mb-4">
                The original x402 protocol was created by Coinbase&apos;s team. 
                It&apos;s a masterpiece of simplicity - one line to add payments 
                to any HTTP endpoint.
              </p>
              <p className="text-lg mb-6">
                We studied it, learned from it, and adapted it for Sei. 
                The core genius remains unchanged - we just optimized for Sei&apos;s capabilities.
              </p>
              <div className="space-y-3">
                <a 
                  href="https://github.com/coinbase/x402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-button inline-block text-sm"
                >
                  View Original x402 →
                </a>
                <p className="text-sm font-mono opacity-70">
                  All credit for the protocol design goes to Coinbase
                </p>
              </div>
            </motion.div>

            {/* Our Contribution */}
            <motion.div 
              className="bg-brutal-black text-brutal-white p-8 border-4 border-brutal-red"
              style={{ boxShadow: '8px 8px 0 #FF0037' }}
              whileHover={{ transform: 'translate(-4px, -4px)', boxShadow: '12px 12px 0 #FF0037' }}
            >
              <h3 className="text-3xl font-bold mb-4 text-brutal-red">What We Changed for Sei</h3>
              <ul className="space-y-3 text-lg mb-6">
                <li className="flex items-start">
                  <span className="text-brutal-red mr-3 text-2xl">•</span>
                  <span>Removed non-Sei networks to reduce complexity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brutal-red mr-3 text-2xl">•</span>
                  <span>Configured correct USDC addresses for Sei</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brutal-red mr-3 text-2xl">•</span>
                  <span>Optimized for Sei&apos;s parallel processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brutal-red mr-3 text-2xl">•</span>
                  <span>Added Sei-specific documentation & examples</span>
                </li>
              </ul>
              <div className="bg-brutal-red p-4 transform -rotate-1">
                <p className="font-mono text-sm">
                  These are small changes. The genius is in the original.
                  We&apos;re just making it work great on Sei.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Why Fork? */}
          <motion.div 
            className="mt-12 bg-brutal-white p-8 border-8 border-brutal-black transform rotate-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">Why Fork for Sei?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-brutal-red mb-2">Sei is Different</h4>
                <p className="font-mono text-sm">
                  Parallel processing, native USDC, sub-second finality. 
                  It deserves optimized tooling.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-brutal-red mb-2">Focused = Better</h4>
                <p className="font-mono text-sm">
                  By focusing only on Sei, we can optimize everything 
                  for Sei&apos;s unique capabilities.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-brutal-red mb-2">Community Needs</h4>
                <p className="font-mono text-sm">
                  Sei developers need payment rails. We&apos;re bringing 
                  x402&apos;s brilliance to Sei.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}


