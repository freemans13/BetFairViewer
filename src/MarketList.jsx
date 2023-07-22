import { useOverview } from './api';
import React from 'react';

export default function MarketList({ setMarket }) {
  const { data: markets, isLoading, error } = useOverview();

  const options = {
    timeZone: 'Europe/London',
    hour12: false,
  };

  function getRaceLocalTime(date) {
    const londonTime = new Date(date).toLocaleTimeString('en-US', options);
    return londonTime;
  }

  function getMatchedCount(market) {
    if (!market.payout) {
      return 0;
    }
    const matchedCount = market.payout.payouts.reduce((acc, payout) => {
      if (!payout.matched) {
        return acc;
      }
      return acc + 1;
    }, 0);
    return matchedCount;
  }

  function getUnmatchedCount(market) {
    if (!market.payout) {
      return 0;
    }
    const unmatchedCount = market.payout.payouts.reduce((acc, payout) => {
      if (payout.void) {
        return acc;
      }
      if (payout.matched) {
        return acc;
      }
      return acc + 1;
    }, 0);
    return unmatchedCount;
  }

  function getGreenUpValue(market) {
    if (!market.greenUp) {
      return 0;
    }
    const greenUpValue = market.greenUp.payouts.reduce((acc, payout) => {
      if (payout.void) {
        return acc;
      }
      if (!payout.profit) {
        return acc;
      }
      return Math.min(acc, payout.profit);
    }, Number.MAX_VALUE);
    if (greenUpValue === Number.MAX_VALUE) {
      return 0;
    }
    return greenUpValue;
  }

  let totalGreenUpValue = 0;
  const m =
    markets &&
    markets.map((market) => {
      const startTime = new Date(market.marketStartTime);
      const old = startTime < new Date();
      const style = old ? { color: 'gray' } : {};
      const greenUpValue = getGreenUpValue(market);
      const matched = getMatchedCount(market);
      const total = getUnmatchedCount(market) + matched;
      totalGreenUpValue += greenUpValue;
      return { market, greenUpValue, matched, total };
    });
  const filteredMarkets = m && m.filter((market) => market.total !== 0);
  return (
    <>
      <div>
        <b style={redOrGreen(totalGreenUpValue)}>£{totalGreenUpValue.toFixed(2)}</b> over{' '}
        {filteredMarkets && filteredMarkets.length} markets
      </div>
      {filteredMarkets &&
        filteredMarkets.map(({ market, greenUpValue, matched, total }) => {
          const startTime = new Date(market.marketStartTime);
          const old = startTime < new Date();
          const style = old ? { color: 'gray' } : {};
          return (
            <button
              key={market.marketId}
              type="button"
              onClick={() => setMarket(market)}
              style={style}
            >
              {market.event.name} {getRaceLocalTime(market.marketStartTime)}{' '}
              <p>
                {market.marketId} {matched}/{total}
              </p>
              <p style={redOrGreen(greenUpValue)}>£{greenUpValue.toFixed(2)}</p>
            </button>
          );
        })}
    </>
  );
}

function redOrGreen(value) {
  if (value === 0) {
    return { color: 'grey' };
  }
  if (value > 0) {
    return { color: 'lightgreen' };
  }
  return { color: 'red' };
}
