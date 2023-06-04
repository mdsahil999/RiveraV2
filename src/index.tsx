import "primereact/resources/themes/lara-light-indigo/theme.css";   
import "primereact/resources/primereact.min.css";  
import '@rainbow-me/rainbowkit/styles.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chains, client } from './wagmi';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import RoutingLayout from "./RoutingLayout";
import Home from "./Home";
import VaultDetails from "./VaultDetails";
import VaultRange from "./VaultRange";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RoutingLayout />}>
      <Route index element={<Home />} />
      <Route path="dashboard" element={<App />} />
      <Route path="valutRangeSelector/:vaultAddress" element={<VaultRange />} />
      <Route path="valutDeatils/:vaultAddress" element={<VaultDetails />} />
    </Route>
  )
);

root.render(
  // <React.StrictMode>
     <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <RouterProvider router={router} />
      </RainbowKitProvider>
    </WagmiConfig>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
