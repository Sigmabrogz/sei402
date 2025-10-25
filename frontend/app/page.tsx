'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import TributeSection from '@/components/TributeSection'
import LiveDemo from '@/components/LiveDemo'
import WorkflowSection from '@/components/WorkflowSection'
import DeveloperSection from '@/components/DeveloperSection'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-brutal-white border-b-4 border-brutal-black">
        <div className="brutal-container py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold font-mono text-brutal-red">s402</h1>
            <span className="brutal-badge">SEI</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="#tribute" className="font-mono hover:text-brutal-red transition-colors">
              x402 Tribute
            </Link>
            <Link href="#demo" className="font-mono hover:text-brutal-red transition-colors">
              Demo
            </Link>
            <Link href="#developers" className="font-mono hover:text-brutal-red transition-colors">
              Developers
            </Link>
            <a 
              href="https://github.com/YourOrg/s402-sei" 
              target="_blank" 
              rel="noopener noreferrer"
              className="brutal-button text-sm px-4 py-2"
            >
              View Source
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Tribute to x402 */}
      <TributeSection />

      {/* Live Demo */}
      <LiveDemo />

      {/* Workflow Visualization */}
      <WorkflowSection />

      {/* Developer Section */}
      <DeveloperSection />

      {/* Footer */}
      <footer className="bg-brutal-black text-brutal-white py-12 mt-20">
        <div className="brutal-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-brutal-red">s402</h3>
              <p className="font-mono text-sm">
                HTTP-402 Payments for Sei.<br />
                Built on x402 by Coinbase.<br />
                Open source. MIT licensed.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 font-mono text-sm">
                <li>
                  <a href="https://github.com/coinbase/x402" className="hover:text-brutal-red">
                    Original x402 →
                  </a>
                </li>
                <li>
                  <a href="https://docs.sei.io/evm" className="hover:text-brutal-red">
                    Sei Documentation →
                  </a>
                </li>
                <li>
                  <a href="https://seitrace.com" className="hover:text-brutal-red">
                    Sei Explorer →
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">USDC Contracts</h4>
              <div className="font-mono text-xs space-y-2">
                <div>
                  <p className="text-brutal-red">Testnet:</p>
                  <p className="break-all">0x4fCF1784B31630811181f670Aea7A7bEF803eaED</p>
                </div>
                <div>
                  <p className="text-brutal-red">Mainnet:</p>
                  <p className="break-all">0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t-4 border-brutal-red text-center font-mono text-sm">
            <p>Made with respect for x402. Optimized for Sei.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}


