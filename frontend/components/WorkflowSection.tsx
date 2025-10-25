'use client'

import { motion } from 'framer-motion'

export default function WorkflowSection() {
  const steps = [
    {
      number: 1,
      title: 'Client requests resource',
      code: 'GET /api/data',
      description: 'Standard HTTP request to protected endpoint',
    },
    {
      number: 2,
      title: 'Server returns 402',
      code: '402 Payment Required',
      description: 'Includes payment requirements (amount, recipient, USDC address)',
    },
    {
      number: 3,
      title: 'Client signs USDC transfer',
      code: 'EIP-3009 permit',
      description: 'Gasless signature for USDC transfer on Sei',
    },
    {
      number: 4,
      title: 'Client retries with proof',
      code: 'X-PAYMENT: base64(data)',
      description: 'Includes payment signature in header',
    },
    {
      number: 5,
      title: 'Server verifies on-chain',
      code: '~2 seconds on Sei',
      description: 'Checks transaction on Sei blockchain',
    },
    {
      number: 6,
      title: 'Server returns resource',
      code: '200 OK + data',
      description: 'Protected content delivered',
    },
  ]

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
            <h2 className="text-5xl md:text-6xl font-black text-brutal-red mb-4">
              The Actual Payment Flow
            </h2>
            <p className="text-xl font-mono">
              How it really works, step by step
            </p>
          </div>

          {/* Flow Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="bg-brutal-white text-brutal-black p-6 border-4 border-brutal-red"
                style={{ boxShadow: '6px 6px 0 #FF0037' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  transform: 'translate(-3px, -3px)',
                  boxShadow: '9px 9px 0 #FF0037'
                }}
              >
                <div className="flex items-start mb-4">
                  <div className="bg-brutal-red text-brutal-white w-12 h-12 flex items-center justify-center font-black text-xl mr-4">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-lg flex-1">{step.title}</h3>
                </div>
                <div className="bg-brutal-black text-brutal-red p-3 mb-3 font-mono text-sm">
                  {step.code}
                </div>
                <p className="text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Technical Reality */}
          <div className="bg-brutal-red p-8 mb-12">
            <h3 className="text-3xl font-bold mb-6">Technical Reality:</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-xl mb-4">What Works Well ✓</h4>
                <ul className="space-y-2 font-mono text-sm">
                  <li>• ~2 second settlement on Sei</li>
                  <li>• Gasless for users (EIP-3009)</li>
                  <li>• Simple server integration</li>
                  <li>• Real USDC, no wrapping</li>
                  <li>• Verifiable on-chain</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-4">Current Limitations ⚠️</h4>
                <ul className="space-y-2 font-mono text-sm">
                  <li>• Requires USDC (no native SEI yet)</li>
                  <li>• ~2 sec verification time</li>
                  <li>• Client needs wallet integration</li>
                  <li>• Not for high-frequency micro-tx</li>
                  <li>• Server needs RPC access</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-brutal-white text-brutal-black p-8 transform rotate-1">
            <h3 className="text-2xl font-bold mb-4">Actual Server Code</h3>
            <pre className="brutal-code text-xs overflow-auto">
{`// This is real, working code
import { paymentMiddleware } from 's402-express';

app.get('/api/data', 
  paymentMiddleware("0xYourSeiAddress", {
    "/api/data": "0.001" // $0.001 USDC
  }),
  (req, res) => {
    // Payment verified, deliver content
    res.json({ data: "Premium content" });
  }
);

// That's it. The middleware handles:
// - 402 responses
// - Payment verification
// - On-chain checking
// - Retry logic`}
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


