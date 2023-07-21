import React from 'react';

export default function MarketList({ setMarket }) {
  const [markets, setMarkets] = React.useState([]);

  React.useEffect(() => {
    async function fetchMarketCatalogue() {
      const result = await fetch('api/betfair/MarketCatalogue');
      const json = await result.json();
      setMarkets(json);
    }
    fetchMarketCatalogue();
    setInterval(() => {
      fetchMarketCatalogue();
    }, 60_000);
  }, []);

  const options = {
    timeZone: 'Europe/London',
    hour12: false,
  };

  function getRaceLocalTime(date) {
    const londonTime = new Date(date).toLocaleTimeString('en-US', options);
    return londonTime;
  }
  return (
    <>
      {markets.map((market) => {
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
            {market.event.name} {getRaceLocalTime(market.marketStartTime)} {market.marketId}
          </button>
        );
      })}
    </>
  );
}
