/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import './App.css';
import { styled } from '@linaria/react';
import { useMarketProjection } from './api';
import MarketList from './MarketList';
import RunnerList from './RunnerList';
import Model from './Model';

const S = {}; // styled components

function App() {
  const [market, setMarket] = useState(null);
  return (
    <S.Div>
      {!market && (
        <S.Nav>
          <MarketList setMarket={setMarket} />
        </S.Nav>
      )}
      {market && (
        <S.Main>
          <RunnerList market={market} />
        </S.Main>
      )}
    </S.Div>
  );
}

S.Div = styled.div`
  display: flex;
  height: 100%;
`;
S.Nav = styled.nav`
  flex: 1;
  overflow-y: auto;
`;
S.Main = styled.main`
  flex: 3;
  overflow-y: auto;
`;

export default App;
