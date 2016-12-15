'use strict';

const User = require('../models/user');
const Joi = require('joi');

exports.viewSettings = {
  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(foundUser => {
      reply.view('settings', { title: 'Babbler | Settings', user: foundUser, });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.updateSettings = {
  payload: {
    maxBytes: 5000000,
  },

  validate: {
    payload: {
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string(),
      bio: Joi.string(),
      image: Joi.optional(),
    },

    failAction: function (request, reply, source, error) {
      reply(error.data.details).code(400);
    },

    options: {
      abortEarly: false,
    },
  },

  handler: function (request, reply) {
    var editedUser = request.payload;
    var loggedInUserEmail = request.auth.credentials.loggedInUser;

    User.findOne({ email: loggedInUserEmail }).then(user => {
      if (editedUser.name) {
        user.name = editedUser.name;
      }

      if (editedUser.bio) {
        user.bio = editedUser.bio;
      }

      if (editedUser.email) {
        request.cookieAuth.set({
          loggedInUser: editedUser.email,
        });
        user.email = editedUser.email;
      }

      if (editedUser.password) {
        user.password = editedUser.password;
      }

      if(editedUser.image) {
        user.image.contentType = 'image/*';
        user.image.data = editedUser.image.toString('base64');
      }

      return user.save();
    }).then(user => {
      reply.view('settings', { title: 'Babbler | Settings', user: user });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};
