import * as express from 'express'
import * as cors from 'cors';
import * as fs from 'node:fs'
import { Pool, getPool } from './pools';
import { createMatches, getMatchesByPool } from './matches';
import { BallotSubmission, DuplicateBallotSubmissionError, getBallotsByPool, submitBallot } from './ballots';

// set up express web server
const app = express()
app.use(cors());
app.use(express.json());







app.get('/api/v1/pools/:poolId', (req, res) => {
  const { poolId } = req.params;
  const pool = getPool(poolId);
  res.json(pool).send();
});

app.put('/api/v1/pools/:poolId', (req, res) => {
  const { poolId } = req.params;
  const newPool = req.body as Pool;
  const pool = getPool(poolId);

  if (!pool) {
    res.status(404).send();
    return;
  }

  if (!pool.areMatchesSet && newPool.areMatchesSet) {
    const ballots = getBallotsByPool(poolId);
    createMatches(newPool, ballots);
  }
})

app.get('/api/v1/pools/:poolId/ballots', (req, res) => {
  const { poolId } = req.params;
  const ballots = getBallotsByPool(poolId);
  res.json(ballots).send();
});

app.post('/api/v1/pools/:poolId/ballots', (req, res) => {
  const { poolId } = req.params;
  const ballot = req.body as BallotSubmission;

  try {
    submitBallot(poolId, ballot);
    res.status(200).send();
  } catch (error) {
    if (error instanceof DuplicateBallotSubmissionError) {
      res.status(409).send();
    } else {
      res.status(500).send();
    }
    
  }
});

app.get('/api/v1/pools/:poolId/matches', (req, res) => {
  const { poolId } = req.params;
  const matches = getMatchesByPool(poolId);
  res.json(matches).send();
})

const hostname = '0.0.0.0';
const port = 3000;

// Start web server on port 3000
app.listen(port, hostname, () => {
  console.log('Server is listening on port 3000')
})
