import { useProfitLoss } from './api.js';
import React from 'react';

export default function ProfitLoss() {
  const { data: profitLoss } = useProfitLoss();
  if (!profitLoss) return <div>Loading profit/loss...</div>;

  return (
    <>
      <div>Today: £{profitLoss?.today.clearedOrders[0].profit ?? '??'}</div>
      <div>Yesterday: £{profitLoss?.yesterday.clearedOrders[0].profit ?? '??'}</div>
      <div>This week: £{profitLoss?.thisWeek.clearedOrders[0].profit ?? '??'}</div>
      <div>Last week: £{profitLoss?.lastWeek.clearedOrders[0].profit ?? '??'}</div>
      <div>This month: £{profitLoss?.thisMonth.clearedOrders[0].profit ?? '??'}</div>
      <div>Last month: £{profitLoss?.lastMonth.clearedOrders[0].profit ?? '??'}</div>
    </>
  );
}
