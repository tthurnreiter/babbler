'use strict';

const Joi = require('joi');

const Babble = require('../models/babble');
const User = require('../models/user');

exports.postBabble = {
  validate: {
    payload: {
      text: Joi.string().max(140).required(),
      image: Joi.any(),
    },

    failAction: function (request, reply, source, error) {
      reply.redirect('/joifail');
    },
  },
  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(user => {
      const babble = new Babble(request.payload);
      babble.user = user._id;
      if(request.payload.image.length){
        babble.image.data = request.payload.image;
        babble.image.contentType = 'image/png';
      }
      babble.save().then(newBabble => {
        reply.redirect('/');
      });
    }).catch(err => {
      reply(err);
    })
  },
};
