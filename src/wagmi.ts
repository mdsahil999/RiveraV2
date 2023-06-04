import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createClient } from 'wagmi'
import { arbitrum, bsc, mainnet, optimism, polygon } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy';

const { chains, provider } = configureChains(
    [mainnet, polygon, optimism, arbitrum, bsc],
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
