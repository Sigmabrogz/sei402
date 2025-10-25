import { z } from "zod";

export const NetworkSchema = z.enum([
  "sei",
  "sei-testnet",
]);
export type Network = z.infer<typeof NetworkSchema>;

// evm
export const SupportedEVMNetworks: Network[] = [
  "sei",
  "sei-testnet",
];
export const EvmNetworkToChainId = new Map<Network, number>([
  ["sei", 1329],
  ["sei-testnet", 1328],
]);

// svm - Not supported in s402-sei
export const SupportedSVMNetworks: Network[] = [];
export const SvmNetworkToChainId = new Map<Network, number>([]);

export const ChainIdToNetwork = Object.fromEntries(
  [...SupportedEVMNetworks, ...SupportedSVMNetworks].map(network => [
    EvmNetworkToChainId.get(network),
    network,
  ]),
) as Record<number, Network>;
