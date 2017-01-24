const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bluebird = require('bluebird');

const config = require('./config');
const routes = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

mongoose.Promise = bluebird;
mongoose.connect(config.database);

app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Log requests to console
app.use(morgan('dev'));

app.get('/', function (req, res) {
  return res.send({
    ok: true
  });
});

app.use('/api', routes);

app.listen(port);
console.log(`Magics at http://localhost:${port}`);

