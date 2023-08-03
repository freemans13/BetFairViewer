import React from 'react';
import { useMarketProjection, useBook } from './api';
import Model from './Model';
import { styled } from '@linaria/react';
import { useLoaderData } from 'react-router-dom';
import { getRaceLocalTime } from './date-utils.js';

const S = {}; // styled components

export default function RunnerList() {
  // @ts-ignore
  const { market } = useLoaderData();
  if (!market) {
    return <h1>no market selected</h1>;
  }

  const { data: projection, isLoading, error } = useMarketProjection(market.marketId);
  const { data: book, isLoadingBook, errorBook } = useBook(market.marketId);
  if (isLoading || isLoadingBook) {
    return <div>loading...</div>;
  }
  if (!projection) {
    return <div>market not found</div>;
  }
  if (!book) {
    return <div>book not found</div>;
  }
  const model = new Model(market, projection);
  let detail;
  if (projection.marketDefinition.status === 'CLOSED') {
    detail = null;
  } else if (projection.marketDefinition.inPlay) {
    detail = 'InPlay';
  } else {
    detail = model.age;
  }
  let order = book?.orders?.[book.orders.length - 1];

  return (
    <S.Div>
      <h1>
        {projection.marketDefinition.venue} {getRaceLocalTime(market.marketStartTime)}
      </h1>
      <div>
        {projection.id} {projection.marketDefinition.status} {detail}
      </div>
      <S.UlRunner>
        <S.Li style={{ color: 'gray' }}>
          <div className="runner">
            <div>Selection</div>
            <div>ID</div>
            <div>Profit</div>
          </div>
          <div className="numbers">
            <div>Price</div>
            <div>(Size)</div>
            <div>Volume</div>
          </div>
          <div className="numbers">
            <div className="col">Unmatched</div>
          </div>
          <div className="numbers">
            <div className="col">Matched</div>
          </div>
        </S.Li>

        {model.runners.map((runner) => {
          const payoutSelection = book?.payouts.payouts.find((r) => r.id === runner.id);
          const orderSelection = order?.selections.find((r) => r.selectionId === runner.id);
          const current = {
            price: runner.back?.[0]?.price,
            size: runner.back?.[0]?.size,
            total: runner.back?.[0]?.tradedVolume,
          };
          if (runner.status !== 'ACTIVE') {
            current.price = null;
            current.size = null;
            current.total = null;
          }
          format(current);

          const isUnmatched = orderSelection?.status === 'E';
          const isMarketOnCloseOrder =
            orderSelection &&
            order.options.orderType === 'MARKET_ON_CLOSE' &&
            !orderSelection.matched;
          return (
            <S.Li key={runner.id}>
              <div className="runner">
                {runner.runnerName}{' '}
                {runner.status === 'ACTIVE' ? '' : `(${runner.status.toLowerCase()})`}
                <div style={{ color: 'grey' }}>{runner.id}</div>
                <div style={redOrGreen(payoutSelection?.profit)}>
                  {runner.status === 'ACTIVE' ? payoutSelection?.profit : null}
                </div>
              </div>
              <div className="numbers">
                <div>{current.price}</div>
                <div>{current.size} </div>
                <div>{current.total}</div>
              </div>
              {isUnmatched || isMarketOnCloseOrder ? (
                <OrderSelection selection={orderSelection} />
              ) : (
                <div className="numbers" />
              )}
              {payoutSelection ? (
                <OrderSelection selection={payoutSelection} runner={runner} />
              ) : (
                <div className="numbers" />
              )}
            </S.Li>
          );
        })}
      </S.UlRunner>
    </S.Div>
  );
}

S.Div = styled.div`
  max-width: 35rem;
  overflow-x: auto; /* Enable horizontal scroll if content overflows */
  padding: 0 1rem;
`;

S.UlRunner = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

S.Li = styled.li`
  border-bottom: 1px solid darkslategray;
  display: flex;
  gap: 1rem;

  .runner {
    flex: 1; /* Take up remaining space */
    overflow: hidden;
    text-overflow: ellipsis; /* Truncate text */
    white-space: nowrap; /* Prevent line breaks */
  }

  .numbers {
    flex: none;
    width: 5rem;
    text-align: right;
    display: flex;
    flex-direction: column;
  }
`;

function OrderSelection({ selection, runner = null }) {
  let model;
  if (runner) {
    /* matched model needed */
    model = {
      size: round(selection.payout / selection.price),
      price: selection.price,
      total: round(selection.payout),
      priceColour: redOrGreen(runner.back?.[0]?.price - selection.price),
    };
  } else {
    /* unmatched model needed */

    let price;
    if (selection?.size) {
      price = roundPrice(selection?.price);
    } else {
      price = 'BSP';
    }
    model = {
      size: round(selection?.size - selection?.matched),
      price,
      total: round((selection?.size - selection?.matched) * selection?.price),
    };
  }

  format(model);
  return (
    <div className="order">
      <S.Row>
        <S.Col style={model.priceColour}>{model.price}</S.Col>
      </S.Row>
      <S.Row>
        <S.Col>{model.size}</S.Col>
      </S.Row>
      <S.Row>
        <S.Col>{model.total}</S.Col>
      </S.Row>
    </div>
  );
}

S.Row = styled.div`
  flex: none;
  width: 5rem;
  text-align: right;
  display: flex;
  flex-direction: column;
`;

S.Col = styled.div`
  /* flex: none;
  text-align: right; */
`;

function round(value) {
  return value?.toFixed(2).toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function format(s) {
  if ((s.size && s.size > 0) || s.size < 0) {
    s.size = `(${s.size})`;
  } else {
    s.size = null;
  }
  if (!s.price) {
    s.price = null;
  }
  if ((s.total && s.total > 0) || s.total < 0) {
    s.total = `£${s.total}`;
  } else {
    s.total = null;
  }
}

function redOrGreen(value) {
  return { color: `${value >= 0 ? 'lightgreen' : 'red'}` };
}

function findCurrentOrder(orders) {
  const result = orders?.reduce(
    (youngest, order) => {
      if (order.orderPlaceTime && order.orderPlaceTime > youngest.orderPlaceTime) {
        youngest.orderPlaceTime = order.orderPlaceTime;
        youngest.order = order;
      }
      return youngest;
    },
    { order: null, orderPlaceTime: 0 }
  );
  return result?.order;
}

export function roundPrice(value, places = 2) {
  if (value === undefined || value === null) {
    return null;
  }
  const p = 10 ** places;
  return Math.round(value * p) / p;
}
