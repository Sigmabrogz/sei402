/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_DEMO_PRIVATE_KEY: process.env.DEMO_PRIVATE_KEY,
    NEXT_PUBLIC_RPC_URL_TESTNET: 'https://evm-rpc-testnet.sei-apis.com',
    NEXT_PUBLIC_RPC_URL_MAINNET: 'https://evm-rpc.sei-apis.com',
    NEXT_PUBLIC_USDC_TESTNET: '0x4fCF1784B31630811181f670Aea7A7bEF803eaED',
    NEXT_PUBLIC_USDC_MAINNET: '0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392',
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:3402'
  }
}

module.exports = nextConfig


