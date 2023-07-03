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

const bnbLocalChain: Chain = {
  id: 56,
  name: 'Rivera Testnet (BNB)',
  network: 'BNB',
  iconUrl: '../img/bnbLogo.svg',
  //iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Rivera Testnet (BNB)',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.rivera.money:8546/'],
    },
    public:{
      http: ['https://testnet.rivera.money:8546/'],
    }
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://bscscan.com/' },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
    [mantleChain, bnbLocalChain],
    [
      alchemyProvider({ apiKey: process.env.ALCHEMY_ID as string}),
      publicProvider()
    ]
  );

const { connectors } = getDefaultWallets({
  appName: 'My wagmi + RainbowKit App',
  chains,
  "projectId":"projectId",
})

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
})

export { chains }
