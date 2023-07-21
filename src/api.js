/* eslint-disable no-unused-vars */
import useSWR from 'swr';

function useMarketProjection(marketId) {
  // @ts-ignore
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, isLoading, error } = useSWR(`/betfair/market/${marketId}`, fetcher, {
    refreshInterval: 1000, // Poll every second (1000ms)
  });
  return { data, isLoading, error };
}

function useBook(marketId) {
  // @ts-ignore
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, isLoading, error } = useSWR(`/betfair/market/${marketId}/book`, fetcher, {
    refreshInterval: 1000, // Poll every second (1000ms)
  });
  return { data, isLoading, error };
}

export { useMarketProjection, useBook };
