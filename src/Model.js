export default class makeModel {
  constructor(market, projection) {
    const starTime = new Date(market.marketStartTime).getTime();
    const publishTime = projection.publishTime;
    const age = formatDuration(starTime - publishTime);

    this.id = projection.id;
    this.age = age;
    Object.assign(this, projection.marketDefinition);
    this.runners = [];

    projection.marketDefinition.runners.forEach((runner) => {
      // const batb = getLadder(projection.rc, 'batb', runner.id);
      const info = getRunnerPriceInfo(projection.rc, runner.id);
      this.runners.push({
        ...runner,
        runnerName: runner.runnerName,
        status: runner.status,
        bsp: runner.bsp,
        back: [priceInfo(info, 'batb', 0), priceInfo(info, 'batb', 1), priceInfo(info, 'batb', 2)],
        tradedVolume: info?.tv,
        lastTradedPrice: info?.ltp,
      });
    });
    this.backMargin = this.runners.reduce((acc, runner) => {
      if (!runner.back[0].price) {
        return acc;
      }
      const result = acc + 100 / runner.back[0].price;
      return result;
    }, 0);
    return this;
  }
}

function getRunnerPriceInfo(rc, selectionId) {
  if (!rc || rc.length === 0) {
    return {};
  }
  const runner = rc.filter((runner) => runner.id === selectionId);
  return runner[0] || {};
}

function priceInfo(rc, type, index) {
  const rcType = rc[type];
  if (rcType && Object.keys(rcType).length > 0) {
    const [price, size] = rcType?.[index] ?? [null, null];
    return {
      price,
      size,
      tradedVolume: getTradedVolume(rc.trd, rc.id, price),
    };
  } else {
    return {
      price: null,
      size: null,
      tradedVolume: null,
    };
  }
}

function getTradedVolume(trd, selectionId, price) {
  if (!trd) {
    return 0;
  }
  const volume = trd[price] ?? 0;
  return volume;
}

function getLadder(rc, type, selectionId) {
  const info = getRunnerPriceInfo(rc, selectionId);
  if (info.length === 0) {
    return null;
  }
  const ladder = info[0][type];
  if (ladder) {
    ladder.sort((a, b) => {
      return a[0] - b[0];
    });
  }
  return ladder;
}

function getInfo(batb, index, index2) {
  if (batb) {
    return batb[index][index2];
  } else {
    return null;
  }
}

export function formatDuration(elapsedTimeMs) {
  const isNegative = elapsedTimeMs < 0;
  const absoluteElapsedTimeMs = Math.abs(elapsedTimeMs);

  const seconds = Math.floor(absoluteElapsedTimeMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const formattedTime = [];
  if (days > 0) {
    formattedTime.push(`${days}d`);
  }
  if (hours % 24 > 0) {
    formattedTime.push(`${hours % 24}h`);
  }
  if (minutes % 60 > 0) {
    formattedTime.push(`${minutes % 60}m`);
  }
  if (seconds % 60 > 0) {
    formattedTime.push(`${seconds % 60}s`);
  }
  if (absoluteElapsedTimeMs > 0 && formattedTime.length === 0) {
    formattedTime.push(`${absoluteElapsedTimeMs % 1000}ms`);
  }

  const formattedDuration = formattedTime.join('');

  return isNegative ? `-${formattedDuration}` : formattedDuration;
}
