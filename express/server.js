'use strict';
const express = require('express');
const path = require('path');
//const http = require('http');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
//const cookieParser = require('cookie-parser');

const auth = (req, res, next) => {
  console.log(req.headers);
  const authHdr = req.headers.authorization;
  const err = new Error('Not authenticated!');
  if (!authHdr) {res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;next(err);return;}
  const auth = new Buffer.from(authHdr.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];const pass = auth[1];
  if (user === 'a' && pass === 'a') {next();} else {
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;next(err);}
};

// const handlebars = require('express-handlebars');
// app.set('view engine', 'hbs');
// app.engine('hbs', handlebars({
//   layoutsDir: __dirname + '/public',
//   extname: 'hbs'
// }));

const router = express.Router();
/*
router.get('/', (req, res, next) => {
  res.render('index');
  // res.render('main', {layout: 'index'});
  // res.render('main');
  //res.sendFile(path.join(__dirname, '../public/index.html'))
});
*/

app.use(auth);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.get('/', (req, res) => res.sendFile("index.html"));

//app.use('/', router);
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
//app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));

module.exports = app;
module.exports.handler = serverless(app);
