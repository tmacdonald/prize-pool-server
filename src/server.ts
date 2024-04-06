import * as express from 'express'
import * as cors from 'cors';
import * as fs from 'node:fs'

// set up express web server
const app = express()
app.use(cors());

// last known count
let count = 0

// Main page
app.get('/counter', async(req, res) => {
  res.json({ count });
})

app.post('/counter', async(req, res) => {
  count++;
  res.json({ count });
})

const hostname = '0.0.0.0';
const port = 3000;

// Start web server on port 3000
app.listen(port, hostname, () => {
  console.log('Server is listening on port 3000')
})
