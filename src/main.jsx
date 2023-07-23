import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import './index.css';
import App from './App.jsx';
import MarketList from './MarketList.jsx';
import RunnerList from './RunnerList.jsx';

async function OverviewLoader() {
  const markets = await fetch('/betfair/Overview').then((r) => r.json());
  return { markets };
}
async function MarketCatalogueLoader({ params }) {
  const marketId = `1.${params.marketId}`;
  const markets = await fetch(`/betfair/MarketCatalogue`).then((r) => r.json());
  const market = markets.find((m) => m.marketId === marketId);
  return { market };
}

async function MarketLoader({ params }) {
  const marketId = `1.${params.marketId}`;
  const market = await fetch(`/betfair/market/${marketId}`).then((r) => r.json());
  return { market };
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MarketList />,
    loader: OverviewLoader,
  },
  {
    path: '/markets/:marketId',
    element: <RunnerList />,
    loader: MarketCatalogueLoader,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyles />
    <RouterProvider router={router} />
  </React.StrictMode>
);
