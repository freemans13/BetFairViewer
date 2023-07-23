import { Link, useLoaderData } from 'react-router-dom';
import React from 'react';
import { styled } from '@linaria/react';
import { useOverview } from './api.js';

const S = {}; // styled components

export default function MarketList() {
  const { data: markets } = useOverview();

  const options = {
    timeZone: 'Europe/London',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  };

  function getRaceLocalTime(date) {
    const londonTime = new Date(date).toLocaleTimeString('en-US', options);
    return londonTime;
  }

  let totalGreenUpValue = 0;
  const m =
    markets &&
    markets.map((market) => {
      const startTime = new Date(market.marketStartTime);
      const old = startTime < new Date();
      const style = old ? { color: 'gray' } : {};
      const greenUpValue = market.greenUp.profit;
      const matched = market.greenUp.matchedSelectionCount;
      const total = market.greenUp.selectionCount;
      totalGreenUpValue += greenUpValue;
      return { market, greenUpValue, matched, total };
    });
  const filteredMarkets = m && m.filter((market) => market.total !== 0);
  return (
    <S.Div>
      <div>
        <b style={redOrGreen(totalGreenUpValue)}>£{totalGreenUpValue?.toFixed(2)}</b> over{' '}
        {filteredMarkets && filteredMarkets.length} markets
      </div>
      {filteredMarkets &&
        filteredMarkets.map(({ market, greenUpValue, matched, total }) => {
          const startTime = new Date(market.marketStartTime);
          const old = startTime < new Date();
          const style = old ? { color: 'gray' } : {};
          return (
            <S.Link
              to={`/markets/${market.marketId.split('.')[1]}`}
              key={market.marketId}
              style={style}
            >
              {market.event.venue} {getRaceLocalTime(market.marketStartTime)}
              <br />
              {matched}/{total}{' '}
              <span style={redOrGreen(greenUpValue)}>£{greenUpValue?.toFixed(2)}</span>
            </S.Link>
          );
        })}
    </S.Div>
  );
}
S.Div = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

S.Link = styled(Link)`
  /* width: 8rem; */
  /* word-break: keep-all; */
  /* word-wrap: break-word; */
  /* white-space: nowrap; */
  white-space: normal;
  display: inline-block;
  /* padding: 0.5rem; */
  margin: 0.5rem;
  text-decoration: none;
  /* border: 1px solid darkslategray; */
  /* &:hover {
    background-color: darkslategray;
  } */
`;

function redOrGreen(value) {
  if (value === 0) {
    return {};
  }
  if (value > 0) {
    return { color: 'lightgreen' };
  }
  return { color: 'red' };
}
