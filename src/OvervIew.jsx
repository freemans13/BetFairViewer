import React from 'react';

import { useOverview, useProfitLoss } from './api.js';
import MarketList from './MarketList.jsx';

export default function Overview() {
  const { data: overview } = useOverview();
  const { data: profitLoss } = useProfitLoss();
  if (!overview) return <div>Loading overview...</div>;
  if (!profitLoss) return <div>Loading profit/loss...</div>;

  return (
    <>
      <h1>£{profitLoss?.today.clearedOrders[0].profit ?? '??'}</h1>
      <MarketList markets={overview.past} title="Past" />
      <MarketList markets={overview.today} title="Today" />
      <MarketList markets={overview.tomorrow} title="Tomorrow" />
      <MarketList markets={overview.future} title="Future" />
    </>
  );
}
