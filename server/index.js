/**
 * s402 Minimal Server Example for Sei EVM
 * 
 * This server demonstrates HTTP-402 payment protocol on Sei network
 * using USDC for micropayments.
 */

import express from 'express';
import cors from 'cors';
import { createPublicClient, createWalletClient, http, parseUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Enable CORS for all origins (configure for production)
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-PAYMENT'],
  exposedHeaders: ['X-PAYMENT-RESPONSE'],
  credentials: true
}));

app.use(express.json());

// Configuration
const CONFIG = {
  // Sei network configuration
  network: process.env.NETWORK || 'sei-testnet',
  chainId: process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID) : 1328, // Default to testnet
  
  // USDC addresses on Sei
  asset: 'USDC',
  assetAddress: process.env.ASSET_ADDRESS || '0x4fCF1784B31630811181f670Aea7A7bEF803eaED', // Testnet default
  assetDecimals: 6,
  
  // Server configuration
  recipient: process.env.RECIPIENT_ADDRESS || '0x38A3cba9B40b84a95A94d2B9F6ad6b5457C1317C',
  privateKey: process.env.PRIVATE_KEY,
  rpcUrl: process.env.RPC_URL || 'https://evm-rpc.sei-apis.com', // Sei EVM RPC
  
  // Testnet override
  testnet: {
    assetAddress: '0x4fCF1784B31630811181f670Aea7A7bEF803eaED',
    chainId: 1328,
    rpcUrl: 'https://evm-rpc-testnet.sei-apis.com'
  },
  
  // Mainnet configuration
  mainnet: {
    assetAddress: '0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392',
    chainId: 1329,
    rpcUrl: 'https://evm-rpc.sei-apis.com'
  }
};

// Select configuration based on network
const isTestnet = CONFIG.network === 'sei-testnet';
const networkConfig = isTestnet ? CONFIG.testnet : CONFIG.mainnet;

// Create Viem clients for Sei
const publicClient = createPublicClient({
  chain: {
    id: networkConfig.chainId,
    name: isTestnet ? 'Sei Testnet' : 'Sei',
    network: CONFIG.network,
    nativeCurrency: {
      decimals: 18,
      name: 'SEI',
      symbol: 'SEI',
    },
    rpcUrls: {
      default: {
        http: [networkConfig.rpcUrl],
      },
      public: {
        http: [networkConfig.rpcUrl],
      },
    },
  },
  transport: http(networkConfig.rpcUrl),
});

// Resources with pricing
const RESOURCES = {
  '/api/weather': {
    price: '0.001', // $0.001 USDC
    description: 'Get current weather data',
    mimeType: 'application/json'
  },
  '/api/premium-data': {
    price: '0.01', // $0.01 USDC
    description: 'Access premium data feed',
    mimeType: 'application/json'
  },
  '/api/ai-completion': {
    price: '0.10', // $0.10 USDC
    description: 'Generate AI text completion',
    mimeType: 'application/json'
  }
};

// Payment verification storage (in production, use a database)
const verifiedPayments = new Map();

/**
 * Generate payment challenge for 402 response
 */
function generatePaymentChallenge(resourcePath, resourceConfig) {
  const reference = `sei-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const amountInUnits = parseUnits(resourceConfig.price, CONFIG.assetDecimals);
  
  return {
    x402Version: 1,
    accepts: [{
      scheme: 'exact',
      network: CONFIG.network,
      maxAmountRequired: amountInUnits.toString(),
      resource: resourcePath,
      description: resourceConfig.description,
      mimeType: resourceConfig.mimeType,
      payTo: CONFIG.recipient,
      maxTimeoutSeconds: 300,
      asset: networkConfig.assetAddress,
      extra: {
        name: CONFIG.asset,
        version: '2', // USDC version
        reference: reference
      }
    }]
  };
}

/**
 * Verify payment on Sei blockchain
 */
async function verifyPayment(paymentHeader) {
  try {
    // Parse the X-PAYMENT header (base64 encoded JSON)
    const paymentData = JSON.parse(Buffer.from(paymentHeader, 'base64').toString());
    
    // Extract payment details
    const { x402Version, scheme, network, payload } = paymentData;
    
    // Validate basic requirements
    if (x402Version !== 1 || scheme !== 'exact' || network !== CONFIG.network) {
      return { isValid: false, reason: 'Invalid payment format or network' };
    }
    
    // For 'exact' scheme, verify the transaction on-chain
    if (payload.txHash) {
      // Check if we've already verified this payment
      if (verifiedPayments.has(payload.txHash)) {
        return { isValid: true, cached: true };
      }
      
      // Verify transaction on Sei
      const receipt = await publicClient.getTransactionReceipt({
        hash: payload.txHash
      });
      
      if (!receipt || receipt.status !== 'success') {
        return { isValid: false, reason: 'Transaction failed or not found' };
      }
      
      // Verify it's a USDC transfer to the correct recipient
      // In production, decode logs to verify exact transfer details
      const isValidTransfer = receipt.to?.toLowerCase() === networkConfig.assetAddress.toLowerCase();
      
      if (isValidTransfer) {
        // Cache the verification
        verifiedPayments.set(payload.txHash, {
          timestamp: Date.now(),
          amount: payload.amount,
          from: payload.from
        });
        
        return { isValid: true, txHash: payload.txHash };
      }
      
      return { isValid: false, reason: 'Invalid transfer details' };
    }
    
    // For permit-based payments (EIP-3009)
    if (payload.permit) {
      // Verify and execute permit
      // This would involve calling the USDC contract's receiveWithAuthorization
      // Implementation depends on exact scheme requirements
      return { isValid: false, reason: 'Permit verification not yet implemented' };
    }
    
    return { isValid: false, reason: 'No valid payment proof provided' };
  } catch (error) {
    console.error('Payment verification error:', error);
    return { isValid: false, reason: 'Verification error: ' + error.message };
  }
}

/**
 * Middleware to handle 402 payment requirements
 */
async function paymentMiddleware(req, res, next) {
  const resourcePath = req.path;
  const resourceConfig = RESOURCES[resourcePath];
  
  // If resource doesn't require payment, continue
  if (!resourceConfig) {
    return next();
  }
  
  // Check for payment header
  const paymentHeader = req.headers['x-payment'];
  
  if (!paymentHeader) {
    // No payment provided, return 402 with payment requirements
    return res.status(402).json(generatePaymentChallenge(resourcePath, resourceConfig));
  }
  
  // Verify the payment
  const verification = await verifyPayment(paymentHeader);
  
  if (!verification.isValid) {
    // Invalid payment, return 402 with error
    const challenge = generatePaymentChallenge(resourcePath, resourceConfig);
    challenge.error = verification.reason || 'Payment verification failed';
    return res.status(402).json(challenge);
  }
  
  // Payment verified, attach to request and continue
  req.payment = verification;
  next();
}

// Apply payment middleware to all routes
app.use(paymentMiddleware);

// Resource endpoints
app.get('/api/weather', (req, res) => {
  res.json({
    location: 'Sei Network',
    temperature: '72°F',
    conditions: 'Sunny',
    timestamp: new Date().toISOString(),
    payment: req.payment
  });
});

app.get('/api/premium-data', (req, res) => {
  res.json({
    data: {
      market: 'SEI/USDC',
      price: 0.45,
      volume24h: 1500000,
      change24h: '+5.2%'
    },
    timestamp: new Date().toISOString(),
    payment: req.payment
  });
});

app.get('/api/ai-completion', (req, res) => {
  const prompt = req.query.prompt || 'Hello';
  res.json({
    prompt: prompt,
    completion: `This is an AI-generated response to: "${prompt}". The Sei network provides fast and efficient blockchain transactions perfect for micropayments.`,
    model: 's402-ai',
    timestamp: new Date().toISOString(),
    payment: req.payment
  });
});

// Verification endpoint (for external facilitators)
app.post('/verify', async (req, res) => {
  const { x402Version, paymentHeader, paymentRequirements } = req.body;
  
  if (x402Version !== 1) {
    return res.json({ isValid: false, invalidReason: 'Unsupported version' });
  }
  
  const verification = await verifyPayment(paymentHeader);
  res.json({
    isValid: verification.isValid,
    invalidReason: verification.reason || null
  });
});

// Settlement endpoint (for external facilitators)
app.post('/settle', async (req, res) => {
  const { x402Version, paymentHeader, paymentRequirements } = req.body;
  
  // In this example, settlement happens during verification
  // In production, you might want to separate verification and settlement
  const verification = await verifyPayment(paymentHeader);
  
  if (verification.isValid && verification.txHash) {
    res.json({
      success: true,
      error: null,
      txHash: verification.txHash,
      networkId: CONFIG.network
    });
  } else {
    res.json({
      success: false,
      error: verification.reason || 'Settlement failed',
      txHash: null,
      networkId: CONFIG.network
    });
  }
});

// Supported payment methods endpoint
app.get('/supported', (req, res) => {
  res.json({
    kinds: [
      {
        scheme: 'exact',
        network: 'sei-testnet'
      },
      {
        scheme: 'exact',
        network: 'sei'
      }
    ]
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    network: CONFIG.network,
    chainId: networkConfig.chainId,
    usdcAddress: networkConfig.assetAddress,
    recipient: CONFIG.recipient
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║     s402 Server Running on Sei Network        ║
╠════════════════════════════════════════════════╣
║ Port:         ${PORT}                              ║
║ Network:      ${CONFIG.network}                    ║
║ Chain ID:     ${networkConfig.chainId}                          ║
║ USDC Address: ${networkConfig.assetAddress} ║
║ Recipient:    ${CONFIG.recipient} ║
╚════════════════════════════════════════════════╝

Available endpoints:
  GET  /api/weather        - $0.001 USDC
  GET  /api/premium-data   - $0.01 USDC
  GET  /api/ai-completion  - $0.10 USDC
  POST /verify            - Verify payments
  POST /settle            - Settle payments
  GET  /supported         - Supported schemes
  GET  /health            - Health check
  `);
});


