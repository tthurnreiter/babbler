'use strict';

const Joi = require('joi');

const User = require('../models/user');

exports.main = {
  auth: false,
  handler: function (request, reply) {
    reply.view('main', {title: 'Welcome to Donations'});
  },
};

exports.signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('signup', {title: 'Sign up for Donations'});
  },
};

exports.register = {
  auth: false,

  validate: {
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
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
    reply.view('login', { title: 'Login to Donations' });
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
        reply.redirect('/home');
      } else {
        reply.redirect('/signup');
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

exports.viewSettings = {
  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(foundUser => {
      reply.view('settings', { title: 'Edit account settings', user: foundUser, });
    }).catch( err => {
      reply.redirect('/');
    });
  },
};

exports.updateSettings = {
  handler: function (request, reply) {
    var editedUser = request.payload;
    var loggedInUserEmail = request.auth.credentials.loggedInUser;

    User.findOne({ email: loggedInUserEmail }).then(user => {
      user.firstName = editedUser.firstName;
      user.lastName = editedUser.lastName;
      user.email = editedUser.email;
      return user.save();
    }).then(user => {
      reply.view('settings', { title: 'Edit Account Settings', user: user });
    }).catch( err => {
      reply.redirect('/');
    })
  },
};