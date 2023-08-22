import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import './index.css';
import RunnerList from './RunnerList.jsx';
import Overview from './OvervIew.jsx';
import ProfitLoss from './ProfitLoss.jsx';

async function OverviewLoader({ params }) {
  const period = params.period ?? 'today';
  const markets = await fetch(`/betfair/Overview/${period}`).then((r) => r.json());
  return { period, markets };
}
async function MarketCatalogueLoader({ params }) {
  const marketId = `1.${params.marketId}`;
  const markets = await fetch(`/betfair/MarketCatalogue/${marketId}`).then((r) => r.json());
  const market = markets.find((m) => m.marketId === marketId);
  return { market };
}

const router = createHashRouter([
  {
    path: '/',
    element: <Overview />,
    loader: OverviewLoader,
  },
  {
    path: '/overview/:period',
    element: <Overview />,
    loader: OverviewLoader,
  },
  {
    path: '/profit',
    element: <ProfitLoss />,
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
