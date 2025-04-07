import { InjectedConnector } from '@web3-react/injected-connector';

// Define supported chains visually, even if not strictly enforced in prototype
const supportedChainIds = [56, 97]; // BSC Mainnet, BSC Testnet

export const injected = new InjectedConnector({ supportedChainIds });