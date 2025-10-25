import { Address } from "viem";

export const config: Record<string, ChainConfig> = {
  // Sei Testnet (Atlantic-2)
  "1328": {
    usdcAddress: "0x4fCF1784B31630811181f670Aea7A7bEF803eaED",
    usdcName: "USDC",
  },
  // Sei Mainnet (Pacific-1)
  "1329": {
    usdcAddress: "0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392",
    usdcName: "USDC",
  },
};

export type ChainConfig = {
  usdcAddress: Address;
  usdcName: string;
};
