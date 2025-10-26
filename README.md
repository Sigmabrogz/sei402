# s402 – HTTP-402 Payments for Sei

> One line of code to accept USDC payments on Sei. Built on x402 by Coinbase.

```typescript
app.use(paymentMiddleware("0xYourSeiAddress", { 
  "/api/data": "0.001" // $0.001 USDC
}));
```

## Features

- ⚡ **400ms settlement** - Sei's actual finality speed
- 💵 **$0.001 minimum** - True micropayments
- 🔐 **Gasless for users** - EIP-3009 permits
- 🚀 **Native USDC** - No bridges needed

## Quick Start

```bash
# Clone
git clone https://github.com/Sigmabrogz/sei402.git
cd sei402

# Install & Run Server
cd server
npm install
npm start

# Your server now accepts payments!
```

## USDC Addresses

- **Testnet**: `0x4fCF1784B31630811181f670Aea7A7bEF803eaED`
- **Mainnet**: `0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392`

## Integration

```javascript
import { paymentMiddleware } from 's402-express';

app.use(paymentMiddleware(
  "0x38A3cba9B40b84a95A94d2B9F6ad6b5457C1317C", // Your address
  { 
    "/api/premium": "0.01",   // $0.01 USDC
    "/api/data": "0.001"      // $0.001 USDC
  }
));
```

## Demo

- 🌐 **Live Demo**: https://sei402.vercel.app
- 📦 **GitHub**: https://github.com/Sigmabrogz/sei402
- 📚 **Docs**: See `/docs/SETUP.md`

## Attribution

Built on [x402](https://github.com/coinbase/x402) by Coinbase. We adapted their brilliant protocol for Sei's parallel EVM.

## License

MIT