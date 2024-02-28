require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 3;
const myPlaintextPassword = 's0/\/\P4$$w0rD';

const urls = new Map();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Your first API endpoint
app.post('/api/shorturl', async function(req, res) {
  const url = req.body.url;
  try {
    givenURL = new URL(url);
    const hashed = await bcrypt.hash(myPlaintextPassword, saltRounds);
    if(urls.get(hashed) === undefined) {
      urls.set(hashed, url);
    }
    return res.json({ "original_url" : url, "short_url" : hashed });
  } catch (error) {
    return res.status(401).json({
      error: 'invalid url'
    });
  }
});

// Your first API endpoint
app.get('/api/shorturl/:hashed', async function(req, res) {
  const hashed = req.params.hashed;
  const url = urls.get(hashed);
  if ( url === undefined) {
    console.error(err);
    console.log('invalid URL');
    return res.status(401).json({
      error: 'invalid url'
    });
  } else {
    return res.redirect(url);
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
