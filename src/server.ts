import * as express from 'express'
import * as cors from 'cors';
import * as fs from 'node:fs'

// set up express web server
const app = express()
app.use(cors());
app.use(express.json());

interface Ballot {
  prizeId: number;
  participantId: number;
  ticketId: number;
}

const prizeBallots: Ballot[] = [];

app.get('/api/v1/ballots', (req, res) => {
  res.json(prizeBallots).send();
});

app.post('/api/v1/ballots', (req, res) => {
  const ballot = req.body as Ballot;

  if (!prizeBallots.some(({ participantId, ticketId }) => ballot.participantId === participantId && ballot.ticketId === ticketId)) {
    prizeBallots.push(ballot);
    res.status(200).send();
  } else {
    res.status(409).send();
  }
});

const hostname = '0.0.0.0';
const port = 3000;

// Start web server on port 3000
app.listen(port, hostname, () => {
  console.log('Server is listening on port 3000')
})
