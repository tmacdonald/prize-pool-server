import { Ballot } from "./ballots";
import { Pool } from "./pools";
import { orderBy, groupBy, range, shuffle, differenceWith, uniq, zip } from "lodash";

export interface Match {
  poolId: string;
  participantId: number;
  prizeId: number;
  name: string;
  homeroom: string;
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
  const won = new Set<number>();
  const winners = new Set<number>();

  const ballotsGroupedByPrize = groupBy(ballots, ballot => ballot.prizeId);

  const prizes: Prize[] = range(1, pool.numPrizes + 1).map(prizeId => {
    const prizeBallots = ballotsGroupedByPrize[prizeId] || [];
    return {
      id: prizeId,
      ballots: prizeBallots
    };
  });

  const popularPrizes = orderBy(prizes, prize => prize.ballots.length, ['desc']);
  
  popularPrizes.forEach(prize => {
    const shuffledBallots = shuffle(prize.ballots);
    for (let i = 0; i < shuffledBallots.length; i++) {
      const potentialWinningBallot = shuffledBallots[i];
      const { participantId, name, homeroom } = potentialWinningBallot;
      if (!winners.has(participantId)) {
        winners.add(participantId);
        won.add(prize.id);
        matches.push({ poolId: pool.id, prizeId: prize.id, participantId: participantId, name, homeroom });
        break;
      }
    }
  });

  // Look for prizes that haven't been won and match them with participants who haven't won
  const remainingPrizes = shuffle(differenceWith(range(1, pool.numPrizes + 1), [...won]));
  const remainingParticipants = shuffle(differenceWith(uniq(ballots.map(ballot => ballot.participantId)), [...winners]));

  zip(remainingPrizes, remainingParticipants).forEach(([prizeId, participantId]) => {
    if (!!prizeId && !!participantId) {
      matches.push({ poolId: pool.id, prizeId, participantId, name: 'TODO', homeroom: 'TODO' });
    }
    
  });

  return matches;
}