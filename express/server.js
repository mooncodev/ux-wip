'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
//const http = require('http');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
//const cookieParser = require('cookie-parser');

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
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

app.use('/', router);
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));

module.exports = app;
module.exports.handler = serverless(app);
