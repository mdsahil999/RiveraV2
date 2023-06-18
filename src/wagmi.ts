//import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { Chain, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient } from 'wagmi'
import { arbitrum, bsc, mainnet, optimism, polygon } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy';

const mantleChain: Chain = {
  id: 5001,
  name: 'Mantle',
  network: 'MNT',
  iconUrl: '../img/mantle.svg',
  //iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Mantle',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.mantle.xyz'],
    },
    public:{
      http: ['https://rpc.testnet.mantle.xyz'],
    }
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://explorer.testnet.mantle.xyz' },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
    [mantleChain, bsc],
    [
      alchemyProvider({ apiKey: process.env.ALCHEMY_ID as string}),
      publicProvider()
    ]
  );

const { connectors } = getDefaultWallets({
  appName: 'My wagmi + RainbowKit App',
  chains,
})

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
})

export { chains }
