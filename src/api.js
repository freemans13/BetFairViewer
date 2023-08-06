/* eslint-disable no-unused-vars */
import useSWR from 'swr';

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

function useOverview() {
  const response = useSWR('/betfair/Overview', fetcher, {
    refreshInterval: 5_000, // Poll every few seconds
  });
  return response;
}

function useProfitLoss() {
  const response = useSWR('/betfair/ProfitLoss', fetcher, {
    refreshInterval: 15_000, // Poll every few seconds
  });
  return response;
}

function useMarketCatalogue() {
  const response = useSWR('/betfair/MarketCatalogue', fetcher, {
    refreshInterval: 60_000, // Poll every 60 seconds
  });
  return response;
}

function useMarketProjection(marketId) {
  const { data, isLoading, error } = useSWR(`/betfair/market/${marketId}`, fetcher, {
    refreshInterval: 1000, // Poll every second (1000ms)
  });
  return { data, isLoading, error };
}

function useBook(marketId) {
  const { data, isLoading, error } = useSWR(`/betfair/market/${marketId}/book`, fetcher, {
    refreshInterval: 1000, // Poll every second (1000ms)
  });
  return { data, isLoading, error };
}

function useRaceStatus(marketId) {
  const { data, isLoading, error } = useSWR(`/betfair/raceStatus/${marketId}`, fetcher, {
    refreshInterval: 1000, // Poll every second (1000ms)
  });
  return { data, isLoading, error };
}

export {
  useOverview,
  useProfitLoss,
  useMarketCatalogue,
  useMarketProjection,
  useBook,
  useRaceStatus,
};
