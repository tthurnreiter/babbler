'use strict';

const Joi = require('joi');

const User = require('../models/user');

exports.signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for Babbler' });
  },
};

exports.register = {
  auth: false,

  validate: {
    payload: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

    options: {
      abortEarly: false,
    },
  },

  handler: function (request, reply) {
    const user = new User(request.payload);

    user.save().then(newUser => {
      reply.redirect('/login');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.login = {
  auth: false,
  handler: function (request, reply) {
    reply.view('login', { title: 'Log in to Babbler' });
  },
};

exports.authenticate = {
  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        request.cookieAuth.set({
          loggedIn: true,
          loggedInUser: user.email,
        });
        reply.redirect('/');
      } else {
        reply.view('login', {
          title: 'Log in to Babbler',
          errors: [{ message: 'Incorrect username or password.' }],
        });
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.logout = {
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },
};
