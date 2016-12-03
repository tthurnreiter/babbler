'use strict';

const Joi = require('joi');

const Babble = require('../models/babble');
const User = require('../models/user');

exports.postBabble = {
  validate: {
    payload: {
      content: Joi.string().max(140).required(),
    },

    failAction: function (request, reply, source, error) {
      reply.redirect('/fail');
    },
  },
  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(user => {
      const babble = new Babble(request.payload);
      babble.user = user._id;
      babble.save().then(newBabble => {
        reply.redirect('/');
      });
    }).catch(err => {
      reply(err);
    })
  },
};
