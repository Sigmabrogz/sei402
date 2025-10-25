# s402 – HTTP-402 Payments Protocol on Sei

> "1 line of code to accept digital dollars on Sei. No fee, 2 second settlement, $0.001 minimum payment."

```typescript
app.use(
  // How much you want to charge, and where you want the funds to land
  paymentMiddleware("0xYourAddress", { "/your-endpoint": "$0.01" })
);
// That's it! See examples/typescript/servers/express.ts for a complete example on Sei EVM.
```

## Why Build on Sei?

- **Native USDC Support**: First-class USDC integration with optimized gas costs
- **High Performance**: Sub-second finality with parallel processing
- **Developer-Friendly**: Full EVM compatibility with enhanced throughput
- **Low Costs**: Extremely low transaction fees perfect for micropayments

## Philosophy

Payments on the internet are fundamentally flawed. Credit Cards are high friction, hard to accept, have minimum payments that are far too high, and don't fit into the programmatic nature of the internet.
It's time for an open, internet-native form of payments. A payment rail that doesn't have high minimums + % based fee. Payments that are amazing for humans and AI agents.

s402 brings the x402 protocol to Sei, leveraging Sei's high-performance EVM to enable instant, low-cost micropayments.

## Principles

- **Open standard:** the s402 protocol will never force reliance on a single party
- **HTTP Native:** s402 is meant to seamlessly complement the existing HTTP request made by traditional web services, it should not mandate additional requests outside the scope of a typical client / server flow
- **Sei-Optimized:** Built specifically for Sei's high-performance EVM environment
- **Trust minimizing:** all payment schemes must not allow for the facilitator or resource server to move funds, other than in accordance with client intentions
- **Easy to use:** s402 needs to be 10x better than existing ways to pay on the internet

## Important USDC Contract Addresses on Sei

- **Testnet (Sei Atlantic-2)**: `0x4fCF1784B31630811181f670Aea7A7bEF803eaED` (6 decimals)
- **Mainnet (Sei Pacific-1)**: `0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392` (6 decimals)

## Quickstart

### Configure Asset Address

1. Set up your environment variables:
```bash
# For Sei Mainnet
ASSET_ADDRESS=0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392
NETWORK=sei-evm
CHAIN_ID=1329

# For Sei Testnet
ASSET_ADDRESS=0x4fCF1784B31630811181f670Aea7A7bEF803eaED
NETWORK=sei-testnet
CHAIN_ID=1328
```

### Run Server

```bash
cd server
npm install
npm run start
```

### Create Resource Endpoint

```javascript
import express from 'express';
import { paymentMiddleware } from 's402-express';

const app = express();

// Protected endpoint requiring payment
app.get('/premium-content', 
  paymentMiddleware("0xYourSeiAddress", { 
    "/premium-content": "0.10" // $0.10 in USDC
  }),
  (req, res) => {
    res.json({ content: "Premium content delivered!" });
  }
);

app.listen(3000);
```

## Developer Flow

1. **Client requests resource** → GET returns 402 Payment Required
2. **Client receives payment challenge** → Contains amount, USDC address on Sei, recipient
3. **Client pays via USDC on Sei** → Using EIP-3009 permit for gasless transfers
4. **Client retries GET with payment proof** → Includes X-PAYMENT header
5. **Server verifies payment** → Checks transaction on Sei EVM
6. **Full content delivered** → 200 OK with requested resource

## V1 Protocol on Sei

The `s402` protocol leverages Sei's EVM compatibility to implement the x402 standard with optimizations for Sei's unique capabilities.

### Protocol Sequencing

![](./static/x402-protocol-flow.png)

### Sei-Specific Optimizations

- **Parallel Transaction Processing**: Leverage Sei's parallel EVM for concurrent payment verification
- **Optimistic Finality**: Sub-second transaction confirmation for instant payments
- **Native USDC Integration**: Direct support for USDC without bridges

## Terms

- `resource`: Something on the internet (webpage, API, RPC service, etc.)
- `client`: An entity wanting to pay for a resource
- `facilitator server`: A server that facilitates verification and execution of on-chain payments on Sei
- `resource server`: An HTTP server that provides an API or other resource for a client

## Technical Goals

- Permissionless and secure for clients and servers on Sei
- Gasless for client and resource servers using EIP-3009
- Minimal integration (1 line for server, 1 function for client)
- Leverage Sei's speed for instant payment verification
- Full compatibility with x402 protocol standards

## Running Examples

**Requirements:** Node.js v20 or higher, Sei wallet with USDC

### Server Example

```bash
cd examples/typescript/servers/sei-express
npm install
npm run dev
```

### Client Example

```bash
cd examples/typescript/clients/axios
npm install
npm run dev
```

## Running Tests

```bash
cd typescript
pnpm install
pnpm test
```

## Links & Resources

- **USDC on Sei Documentation**: [https://docs.sei.io/evm/usdc-on-sei](https://docs.sei.io/evm/usdc-on-sei)
- **Sei EVM Documentation**: [https://docs.sei.io/evm](https://docs.sei.io/evm)
- **Original x402 Protocol**: [https://github.com/coinbase/x402](https://github.com/coinbase/x402)
- **s402 Repository**: [https://github.com/Sigmabrogz/sei402](https://github.com/Sigmabrogz/sei402)

## License

MIT (same as original x402)

## Contributing

s402 is an open-source fork of x402 optimized for the Sei ecosystem. Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Acknowledgments

s402 is built on top of the excellent work done by the Coinbase team on the x402 protocol. We've adapted it specifically for the Sei ecosystem while maintaining full compatibility with the x402 standard.


