import { Ballot } from "./ballots";
import { Pool } from "./pools";
import { sortBy, groupBy, range, shuffle } from "lodash";

export interface Match {
  poolId: string;
  participantId: number;
  prizeId: number;
}

interface Prize {
  id: number;
  ballots: Ballot[];
}

const matches: Match[] = [];

export function getMatchesByPool(poolId: string): Match[] {
  return matches.filter(match => match.poolId === poolId);
}

export function createMatches(pool: Pool, ballots: Ballot[]): Match[] {
  const winners = new Set<number>();

  const ballotsGroupedByPrize = groupBy(ballots, ballot => ballot.prizeId);

  const prizes: Prize[] = range(1, pool.numPrizes).map(prizeId => {
    const prizeBallots = ballotsGroupedByPrize[prizeId] || [];
    return {
      id: prizeId,
      ballots: prizeBallots
    };
  });

  const popularPrizes = sortBy(prizes, prize => prize.ballots.length, ['desc']);
  
  popularPrizes.forEach(prize => {
    const shuffledBallots = shuffle(prize.ballots);
    for (let i = 0; i < shuffledBallots.length; i++) {
      const potentialWinningBallot = shuffledBallots[i];
      const { participantId } = potentialWinningBallot;
      if (!winners.has(participantId)) {
        winners.add(participantId);
        matches.push({ poolId: pool.id, prizeId: prize.id, participantId: participantId });
        break;
      }
    }
  });

  return matches;
}