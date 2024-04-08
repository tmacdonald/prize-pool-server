export interface BallotSubmission {
  prizeId: number;
  participantId: number;
  ticketId: number;
}

export interface Ballot extends BallotSubmission {
  poolId: string;
}

export class DuplicateBallotSubmissionError extends Error {
  
}

const ballots: Ballot[] = [];

export const getBallotsByPool = (poolId: string): Ballot[] => {
  return ballots.filter(ballot => ballot.poolId === poolId);
}

export const submitBallot = (poolId: string, ballotSubmission: BallotSubmission) => {
  if (!ballots.some(({ participantId, ticketId }) => ballotSubmission.participantId === participantId && ballotSubmission.ticketId === ticketId)) {
    ballots.push({ poolId, ...ballotSubmission });
  } else {
    throw new DuplicateBallotSubmissionError(`Duplicate ballot submission for participant ${ballotSubmission.participantId} and ticket ${ballotSubmission.ticketId}`);
  }
}