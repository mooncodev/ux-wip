const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

const auth = (req, res, next) => {
  console.log(req.headers);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    next(err);
    return;
  }
  const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];
  if (user === 'a' && pass === 'a') {
    next(); // authorized
  } else {
    const err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    next(err);
  }
};
app.use(auth);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
app.get('/mock_getTokens', function (req, res, next) {
  res.send(require("../mock_getTokens.json"));
});
app.get('/mock_getReflectionChartData', function (req, res, next) {
  res.send(require("../mock_getReflectionChartData.json"));
});
app.get('/mock_getHolders', function (req, res, next) {
  res.send(require("../mock_getHolders.json"));
});
app.get('/coinlayer', function (req, res, next) {
  const data = JSON.stringify(
    {"jsonrpc": "2.0", "id": 1, "method": "eth_blockNumber", "params": []}
  );
  const options = {
    hostname: 'api.coinlayer.com',
    path: '/api/live?access_key=8b087cfe3b07eef8abdccc449a9dbbec',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const httpsReq = http.request(options, (httpsRes) => {
    let data = '';
    console.log('Status Code:', httpsRes.statusCode);
    httpsRes.on('data', (chunk) => {
      data += chunk;
    });
    httpsRes.on('end', () => {
      console.log('Body: ', JSON.parse(data));
      res.send(JSON.parse(data));
    });
  }).on("error", (err) => {
    console.log("Error: ", err.message);
  });
  httpsReq.write(data);
  httpsReq.end();
})

app.get('/infura', function (req, res, next) {
  const projectID = '0eaa508254d64389be2f25787cc66181';
  const infuraUrl = `https://mainnet.infura.io/v3/${projectID}/ticker/ethusd`;
  const data = JSON.stringify(
    {"jsonrpc": "2.0", "id": 1, "method": "eth_blockNumber", "params": []}
  );
  const options = {
    hostname: 'mainnet.infura.io',
    path: '/v3/0eaa508254d64389be2f25787cc66181/ticker/ethusd',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  const httpsReq = https.request(options, (httpsRes) => {
    let data = '';
    console.log('Status Code:', httpsRes.statusCode);
    httpsRes.on('data', (chunk) => {
      data += chunk;
    });
    httpsRes.on('end', () => {
      console.log('Body: ', JSON.parse(data));
      res.send(JSON.parse(data));
    });
  }).on("error", (err) => {
    console.log("Error: ", err.message);
  });
  httpsReq.write(data);
  httpsReq.end();
})

module.exports = app;
