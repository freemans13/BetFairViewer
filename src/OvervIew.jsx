import React from 'react';

import { useOverview, useProfitLoss } from './api.js';
import MarketList from './MarketList.jsx';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';

export default function Overview() {
  const navigate = useNavigate();
  // @ts-ignore
  const { period = 'today' } = useLoaderData();
  const { data: overview } = useOverview(period);
  const { data: profitLoss } = useProfitLoss();
  if (!overview) return <div>Loading overview...</div>;
  if (!profitLoss) return <div>Loading profit/loss...</div>;

  function handleDateChange(event) {
    navigate(`/overview/${event.target.value}`);
  }

  return (
    <>
      <p>
        <select
          style={{ width: '20rem' }}
          id="dateSelector"
          onChange={handleDateChange}
          value={period}
        >
          <option value="thisWeek">The week</option>
          <option value="yesterday">Yesterday</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
        </select>{' '}
        <Link to="/profit">
          £{profitLoss?.today?.clearedOrders?.[0]?.profit?.toFixed(2) ?? '0.00'}
        </Link>
      </p>
      <MarketList markets={overview} period={period} />
      {/* <MarketList markets={overview.past} period="Past" />
      <MarketList markets={overview.today} period="Today" />
      <MarketList markets={overview.tomorrow} period="Tomorrow" />
      <MarketList markets={overview.future} period="Future" /> */}
    </>
  );
}
