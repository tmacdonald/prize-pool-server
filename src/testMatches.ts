import { Pool, getPool } from './pools';
import { createMatches, getMatchesByPool } from './matches';
import { BallotSubmission, DuplicateBallotSubmissionError, getBallotsByPool, submitBallot } from './ballots';
import { range } from 'lodash';

const pool: Pool = {
  id: 'sps-cake-walk',
  numPrizes: 10,
  areMatchesSet: false
}

const homerooms = range(1, 6).map(i => `class ${i}`);

const participants = range(1, 11).map(i => ({
  id: i,
  name: `Participant ${i}`,
  homeroom: homerooms[Math.floor(Math.random() * homerooms.length)],
  tickets: Math.ceil(Math.random() * 10),
}))

participants.forEach(participant => {
  for (let j = 1; j <= participant.tickets; j++) {
    const randomPrize = Math.ceil(Math.random() * 10);

    submitBallot('sps-cake-walk', { prizeId: randomPrize, participantId: participant.id, ticketId: j, name: participant.name, homeroom: participant.homeroom });
  }
});

const ballots = getBallotsByPool('sps-cake-walk');
console.table(ballots);

createMatches(pool, ballots);
const matches = getMatchesByPool('sps-cake-walk');

console.table(matches);