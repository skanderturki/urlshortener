require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
let counter = 0;

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
    if(urls.get(url) === undefined || givenURL === undefined || givenURL === null) {
      urls.set(url, ++counter);
    }
    return res.json({ "original_url" : url, "short_url" : counter });
  } catch (error) {
    return res.status(403).json({
      "error": 'Invalid URL'
    });
  }
});

function getByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
  return null;
}

// Your first API endpoint
app.get('/api/shorturl/:short', async function(req, res) {
  const short = req.params.short;
  let url;
  try {
    url = getByValue(urls, Number(short));
  } catch(error){

  }
  
  if ( url === undefined) {
    return res.status(401).json({
      "error": 'Invalid URL'
    });
  } else {
    return res.redirect(url);
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
