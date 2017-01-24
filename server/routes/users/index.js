const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../../models/users');
const config = require('../../config');

const routes = express.Router();

routes.post('/create', function (req, res) {
  const user = new User({
    name: req.body.name,
    password: req.body.password,
    admin: req.body.admin || false
  });

  user.save(function (err, newUser) {
    if (err) {
      throw err;
    }

    return res.json(newUser);
  });
});

routes.get('/list', (req, res) => {
  return User.find({}, (err, users) => {
    if (err) {
      throw err;
    }

    return res.json(users);
  });
});

routes.get('/get/:id', (req, res) => {
  const id = req.params.id;

  return User.find({ _id: id }, (err, user) => {
    if (err) {
      throw err;
    }

    return res.json(user);
  });
});

routes.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  return User.remove({ _id: id }, (err, user) => {
    if (err) {
      throw err;
    }

    return res.json({
      deleted: true,
      id: id
    });
  });
});

routes.post('/authenticate', (req, res) => {
  const queryParams = {
    email: req.body.email,
    password: req.body.password
  }

  console.log('queryParams', queryParams);
  return User.findOne(queryParams, (err, user) => {
    console.log('err', err);
    console.log('user', user);
    if (err) {
      throw err;
    }

    if (!user) {
      return res.json({
        authenticated: false,
        message: 'user not found'
      });
    }

    console.log('user', user);
    const token = jwt.sign(user, config.secret, {
      expiresIn: 1440,
      algorithm: 'RS256'
    });

    console.log('token', token);
    res.json({
      authenticated: true,
      message: 'success logged in',
      token: token
    });
  })
})

module.exports = routes;
