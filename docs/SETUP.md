# s402 Setup and Deployment Guide for Sei Network

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Server Setup](#server-setup)
- [Client Integration](#client-integration)
- [Contract Deployment](#contract-deployment)
- [Testing](#testing)
- [Production Deployment](#production-deployment)

## Prerequisites

### Required Software
- Node.js v20 or higher
- npm or pnpm package manager
- Git
- A Sei wallet with SEI and USDC tokens

### Sei Network Information

#### Testnet (Atlantic-2)
- **Chain ID**: 1328
- **RPC URL**: https://evm-rpc-testnet.sei-apis.com
- **USDC Contract**: `0x4fCF1784B31630811181f670Aea7A7bEF803eaED`
- **Faucet**: https://atlantic-2.app.sei.io/faucet

#### Mainnet (Pacific-1)
- **Chain ID**: 1329
- **RPC URL**: https://evm-rpc.sei-apis.com
- **USDC Contract**: `0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392`

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/YourOrg/s402-sei.git
cd s402-sei
```

### 2. Install Dependencies
```bash
# For the server
cd server
npm install

# For TypeScript packages
cd ../typescript
pnpm install
pnpm build
```

### 3. Configure Environment
```bash
cd server
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Network Configuration
NETWORK=sei-testnet
CHAIN_ID=1328
ASSET_ADDRESS=0x4fCF1784B31630811181f670Aea7A7bEF803eaED

# Your Sei address to receive payments
RECIPIENT_ADDRESS=0xYourSeiAddressHere

# RPC URL
RPC_URL=https://evm-rpc-testnet.sei-apis.com

# Server Port
PORT=3000
```

### 4. Start the Server
```bash
npm start
```

Your s402 server is now running on `http://localhost:3000`!

## Server Setup

### Basic Express Server

```javascript
import express from 'express';
import { paymentMiddleware } from 's402-express';

const app = express();

// Simple payment-protected endpoint
app.get('/api/data', 
  paymentMiddleware("0xYourAddress", { 
    "/api/data": "0.01" // $0.01 USDC
  }),
  (req, res) => {
    res.json({ data: "Premium content" });
  }
);

app.listen(3000);
```

### Advanced Configuration

```javascript
const paymentConfig = {
  network: 'sei-testnet',
  chainId: 1328,
  usdcAddress: '0x4fCF1784B31630811181f670Aea7A7bEF803eaED',
  recipient: '0xYourAddress',
  
  // Resource pricing
  resources: {
    '/api/basic': { price: '0.001', description: 'Basic API access' },
    '/api/premium': { price: '0.01', description: 'Premium features' },
    '/api/enterprise': { price: '0.10', description: 'Enterprise data' }
  },
  
  // Optional: Custom verification logic
  verifyPayment: async (paymentData) => {
    // Custom verification logic
    return { isValid: true };
  }
};
```

## Client Integration

### JavaScript/TypeScript Client

```javascript
import { createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import axios from 'axios';

// Setup client
const account = privateKeyToAccount('0xYourPrivateKey');
const client = createPublicClient({
  chain: {
    id: 1328,
    name: 'Sei Testnet',
    network: 'sei-testnet',
    nativeCurrency: { decimals: 18, name: 'SEI', symbol: 'SEI' },
    rpcUrls: {
      default: { http: ['https://evm-rpc-testnet.sei-apis.com'] }
    }
  },
  transport: http()
});

// Make payment-enabled request
async function fetchWithPayment(url) {
  try {
    // First request will return 402
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (error.response?.status === 402) {
      const paymentRequirements = error.response.data;
      
      // Create and sign payment
      const payment = await createPayment(paymentRequirements);
      
      // Retry with payment header
      const response = await axios.get(url, {
        headers: {
          'X-PAYMENT': Buffer.from(JSON.stringify(payment)).toString('base64')
        }
      });
      
      return response.data;
    }
    throw error;
  }
}
```

### Python Client

```python
import requests
import base64
import json
from web3 import Web3

class S402Client:
    def __init__(self, private_key, rpc_url='https://evm-rpc-testnet.sei-apis.com'):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.account = self.w3.eth.account.from_key(private_key)
        
    def fetch_with_payment(self, url):
        # Initial request
        response = requests.get(url)
        
        if response.status_code == 402:
            # Get payment requirements
            requirements = response.json()
            
            # Create payment
            payment = self.create_payment(requirements)
            
            # Retry with payment
            headers = {
                'X-PAYMENT': base64.b64encode(
                    json.dumps(payment).encode()
                ).decode()
            }
            response = requests.get(url, headers=headers)
            
        return response.json()
```

## Contract Deployment

### Deploy ReceiptRegistry Contract

1. **Install Hardhat**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. **Configure Hardhat**
```javascript
// hardhat.config.js
module.exports = {
  solidity: "0.8.24",
  networks: {
    seiTestnet: {
      url: "https://evm-rpc-testnet.sei-apis.com",
      chainId: 1328,
      accounts: [process.env.PRIVATE_KEY]
    },
    seiMainnet: {
      url: "https://evm-rpc.sei-apis.com",
      chainId: 1329,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

3. **Deploy Script**
```javascript
// scripts/deploy.js
async function main() {
  const ReceiptRegistry = await ethers.getContractFactory("ReceiptRegistry");
  const registry = await ReceiptRegistry.deploy();
  await registry.deployed();
  
  console.log("ReceiptRegistry deployed to:", registry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

4. **Deploy**
```bash
npx hardhat run scripts/deploy.js --network seiTestnet
```

## Testing

### Unit Tests

```bash
# Test TypeScript packages
cd typescript
pnpm test

# Test server
cd ../server
npm test
```

### Integration Tests

```javascript
// test/integration.test.js
import { expect } from 'chai';
import axios from 'axios';

describe('s402 Integration Tests', () => {
  it('should return 402 without payment', async () => {
    try {
      await axios.get('http://localhost:3000/api/data');
    } catch (error) {
      expect(error.response.status).to.equal(402);
      expect(error.response.data).to.have.property('x402Version');
    }
  });
  
  it('should return data with valid payment', async () => {
    // Create payment
    const payment = await createTestPayment();
    
    // Make request with payment
    const response = await axios.get('http://localhost:3000/api/data', {
      headers: {
        'X-PAYMENT': Buffer.from(JSON.stringify(payment)).toString('base64')
      }
    });
    
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('data');
  });
});
```

## Production Deployment

### Environment Variables

```env
# Production configuration
NETWORK=sei
CHAIN_ID=1329
ASSET_ADDRESS=0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392
RECIPIENT_ADDRESS=0xYourProductionAddress
RPC_URL=https://evm-rpc.sei-apis.com
PORT=443

# Security
RATE_LIMIT=100
MAX_PAYMENT_AGE=300
ENABLE_CORS=true
ALLOWED_ORIGINS=https://yourdomain.com

# Monitoring
LOG_LEVEL=info
METRICS_ENABLED=true
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  s402-server:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NETWORK=sei
      - CHAIN_ID=1329
      - ASSET_ADDRESS=0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392
      - RECIPIENT_ADDRESS=${RECIPIENT_ADDRESS}
    restart: unless-stopped
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'X-PAYMENT, Content-Type';
    }
}
```

### Monitoring and Analytics

```javascript
// monitoring.js
import prometheus from 'prom-client';

// Metrics
const paymentCounter = new prometheus.Counter({
  name: 's402_payments_total',
  help: 'Total number of payments processed',
  labelNames: ['status', 'resource']
});

const paymentAmount = new prometheus.Histogram({
  name: 's402_payment_amount_usd',
  help: 'Payment amounts in USD',
  buckets: [0.001, 0.01, 0.1, 1, 10]
});

// Track payments
function trackPayment(resource, amount, status) {
  paymentCounter.inc({ resource, status });
  paymentAmount.observe(amount);
}
```

## Troubleshooting

### Common Issues

1. **Transaction not found**
   - Ensure you're using the correct RPC URL
   - Wait for transaction confirmation (2-3 seconds on Sei)
   - Check the correct chain ID

2. **Invalid USDC address**
   - Verify you're using the correct address for your network
   - Testnet: `0x4fCF1784B31630811181f670Aea7A7bEF803eaED`
   - Mainnet: `0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392`

3. **Payment verification fails**
   - Check that the payment amount matches requirements
   - Ensure the recipient address is correct
   - Verify the transaction was successful on-chain

### Debug Mode

```javascript
// Enable debug logging
const DEBUG = process.env.DEBUG === 'true';

function debugLog(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', new Date().toISOString(), ...args);
  }
}

// Use in verification
async function verifyPayment(paymentData) {
  debugLog('Verifying payment:', paymentData);
  // ... verification logic
  debugLog('Verification result:', result);
  return result;
}
```

## Support and Resources

- **Sei Documentation**: https://docs.sei.io/evm
- **USDC on Sei**: https://docs.sei.io/evm/usdc-on-sei
- **s402 GitHub**: https://github.com/YourOrg/s402-sei
- **Original x402**: https://github.com/coinbase/x402

## License

MIT License - See LICENSE file for details


