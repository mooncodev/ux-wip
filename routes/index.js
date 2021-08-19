const express = require('express');
const router = express.Router();
const http = require('http');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/mock_getTokens', function (req, res, next) {
  res.send(require("../mock_getTokens.json"));
});
router.get('/mock_getReflectionChartData', function (req, res, next) {
  res.send(require("../mock_getReflectionChartData.json"));
});
router.get('/mock_getHolders', function (req, res, next) {
  res.send(require("../mock_getHolders.json"));
});
router.get('/coinlayer', function (req, res, next) {
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
router.get('/infura', function (req, res, next) {
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
module.exports = router;
