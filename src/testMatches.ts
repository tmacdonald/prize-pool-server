import { Pool, getPool } from './pools';
import { createMatches, getMatchesByPool } from './matches';
import { BallotSubmission, DuplicateBallotSubmissionError, getBallotsByPool, submitBallot } from './ballots';

const pool: Pool = {
  id: 'sps-cake-walk',
  numPrizes: 10,
  areMatchesSet: false
}

for (let i = 1; i <= 10; i++) {
  for (let j = 1; j <= 3; j++) {
    const randomPrize = Math.ceil(Math.random() * 10);

    submitBallot('sps-cake-walk', { prizeId: randomPrize, participantId: i, ticketId: j });
  }
}

const ballots = getBallotsByPool('sps-cake-walk');
console.table(ballots);

createMatches(pool, ballots);
const matches = getMatchesByPool('sps-cake-walk');

console.table(matches);