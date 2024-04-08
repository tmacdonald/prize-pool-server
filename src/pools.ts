export interface Pool {
  id: string;
  numPrizes: number;
  areMatchesSet: boolean;
}

const pools: Pool[] = [{
  id: 'sps-cake-walk',
  numPrizes: 10,
  areMatchesSet: false,
}];

export const getPool = (poolId: string): Pool | undefined => {
  const [pool] = pools.filter(pool => pool.id === poolId);
  return pool;
}