'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function GetStarted() {
  const [activeTab, setActiveTab] = useState('clone')

  const steps = {
    clone: {
      title: '1. Clone the Repository',
      code: `# Clone s402 for Sei
git clone https://github.com/Sigmabrogz/sei402.git
cd sei402

# Install dependencies
cd server
npm install`,
    },
    setup: {
      title: '2. Configure Your Wallet',
      code: `# Create .env file in server directory
echo "RECIPIENT_ADDRESS=0xYourSeiAddress" > .env
echo "NETWORK=sei-testnet" >> .env
echo "CHAIN_ID=1328" >> .env

# For mainnet, use:
# NETWORK=sei
# CHAIN_ID=1329`,
    },
    run: {
      title: '3. Start the Server',
      code: `# Run the s402 server
npm start

# Your server is now accepting payments!
# Test it:
curl http://localhost:3402/health`,
    },
    integrate: {
      title: '4. Integrate in Your App',
      code: `// In your Express app
import { paymentMiddleware } from 's402-express';

app.use(paymentMiddleware(
  "0xYourSeiAddress",
  { 
    "/api/premium": "0.01",   // $0.01 USDC
    "/api/data": "0.001"      // $0.001 USDC
  }
));

// That's it! Your endpoints now require payment.`,
    },
    test: {
      title: '5. Test with USDC',
      code: `# Get testnet USDC from faucet
# Visit: https://faucet.sei.io

# Test payment flow
curl http://localhost:3402/api/weather
# Returns 402 with payment requirements

# Client pays with USDC...
# Then gets the content!`,
    },
  }

  return (
    <section className="py-20 bg-brutal-black text-brutal-white">
      <div className="brutal-container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-6xl md:text-7xl font-black text-brutal-red mb-4">
              GET STARTED
            </h2>
            <p className="text-2xl font-bold">
              5 Steps to Accept Payments on Sei
            </p>
          </div>

          {/* GitHub Link */}
          <div className="bg-brutal-red p-8 mb-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Official Repository</h3>
            <a 
              href="https://github.com/Sigmabrogz/sei402"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-12 py-6 bg-brutal-white text-brutal-black font-black text-xl border-4 border-brutal-black"
              style={{ boxShadow: '8px 8px 0 #000' }}
            >
              github.com/Sigmabrogz/sei402
            </a>
            <p className="mt-6 text-xl">
              ⭐ Star the repo to support the project
            </p>
          </div>

          {/* Step Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.entries(steps).map(([key, step]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 font-bold border-4 border-brutal-white transition-all ${
                  activeTab === key
                    ? 'bg-brutal-red text-brutal-white'
                    : 'bg-brutal-black text-brutal-white hover:bg-brutal-white hover:text-brutal-black'
                }`}
              >
                {step.title.split('.')[0]}
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-brutal-white text-brutal-black p-8 border-4 border-brutal-red"
          >
            <h3 className="text-2xl font-bold mb-6 text-brutal-red">
              {steps[activeTab as keyof typeof steps].title}
            </h3>
            <pre className="bg-brutal-black text-brutal-white p-6 overflow-x-auto font-mono text-sm">
              <code>{steps[activeTab as keyof typeof steps].code}</code>
            </pre>
          </motion.div>

          {/* Quick Info Boxes */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-brutal-white text-brutal-black p-6 border-4 border-brutal-red">
              <h4 className="font-bold text-xl mb-2 text-brutal-red">Requirements</h4>
              <ul className="font-mono text-sm space-y-1">
                <li>• Node.js v20+</li>
                <li>• Sei wallet address</li>
                <li>• Some SEI for gas</li>
                <li>• USDC for testing</li>
              </ul>
            </div>

            <div className="bg-brutal-white text-brutal-black p-6 border-4 border-brutal-red">
              <h4 className="font-bold text-xl mb-2 text-brutal-red">What You Get</h4>
              <ul className="font-mono text-sm space-y-1">
                <li>• HTTP-402 server</li>
                <li>• Payment verification</li>
                <li>• USDC integration</li>
                <li>• 400ms settlements</li>
              </ul>
            </div>

            <div className="bg-brutal-white text-brutal-black p-6 border-4 border-brutal-red">
              <h4 className="font-bold text-xl mb-2 text-brutal-red">Support</h4>
              <ul className="font-mono text-sm space-y-1">
                <li>• GitHub Issues</li>
                <li>• Sei Discord</li>
                <li>• Full docs in repo</li>
                <li>• MIT licensed</li>
              </ul>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-12 p-8 bg-brutal-red">
            <h3 className="text-2xl font-bold mb-4">Important Notes</h3>
            <ul className="space-y-2 text-lg">
              <li>
                <strong>Testnet First:</strong> Always test on Atlantic-2 testnet before mainnet
              </li>
              <li>
                <strong>USDC Addresses:</strong> Double-check you&apos;re using the right USDC contract
              </li>
              <li>
                <strong>Private Keys:</strong> NEVER commit private keys to the repo
              </li>
              <li>
                <strong>Open Source:</strong> This is MIT licensed - use it, fork it, improve it
              </li>
            </ul>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <h3 className="text-3xl font-bold mb-6">Ready to Build?</h3>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <a
                href="https://github.com/Sigmabrogz/sei402"
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-6 bg-brutal-red text-brutal-white font-black text-xl border-4 border-brutal-white"
                style={{ boxShadow: '8px 8px 0 #fff' }}
              >
                CLONE THE REPO
              </a>
              <a
                href="https://docs.sei.io"
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-6 bg-brutal-white text-brutal-black font-black text-xl border-4 border-brutal-red"
                style={{ boxShadow: '8px 8px 0 #FF0037' }}
              >
                SEI DOCS
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
