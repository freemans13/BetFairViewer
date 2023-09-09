import { Link, useLoaderData } from 'react-router-dom';
import React from 'react';
import { styled } from '@linaria/react';
import { getRaceLocalTime } from './date-utils.js';

const S = {}; // styled components

export default function MarketList({ markets, period }) {
  if (!markets || markets.length === 0) {
    return null;
  }

  let totalGreenUpValue = 0;
  let greenUpCount = 0;
  const m =
    markets &&
    markets.map((market) => {
      const greenUpValue = market.greenUp.profit;
      const matched = market.greenUp.matchedSelectionCount;
      const total = market.greenUp.selectionCount;
      const margin = market.greenUp.margin;
      totalGreenUpValue += greenUpValue;
      if (greenUpValue) {
        greenUpCount++;
      }
      return { market, greenUpValue, matched, margin, total };
    });
  const filteredMarkets = m && m.filter((market) => market.total !== 0);
  return (
    <S.Div>
      <div>
        {filteredMarkets && filteredMarkets.length} markets, {greenUpCount}
        {' with matches, '}
        <b style={redOrGreen(totalGreenUpValue)}>£{totalGreenUpValue?.toFixed(2)}</b>
      </div>
      {filteredMarkets &&
        filteredMarkets.map(({ market, greenUpValue, matched, margin, total }) => {
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
              <span style={redOrGreen(greenUpValue)}>£{greenUpValue?.toFixed(2)}</span>{' '}
              {margin ? `${margin.toFixed(0)}%` : ''}{' '}
            </S.Link>
          );
        })}
    </S.Div>
  );
}
S.Div = styled.div`
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
