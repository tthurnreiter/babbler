'use strict';

const Babble = require('../models/babble');
const User = require('../models/user');

const Boom = require('boom');
const Joi = require('joi');

exports.post = {
  auth: false,

  payload: {
    maxBytes: 5000000,
  },

  validate: {
    payload: {
      user: Joi.string().required(),
      text: Joi.string().max(140).required(),
      image: Joi.any(),
    },

    failAction: function (request, reply, source, error) {
      reply.badRequest(error.data.details);
    },
  },
  handler: function (request, reply) {
    User.findOne({ _id: request.payload.user }).then(user => {
      const babble = new Babble(request.payload);
      babble.user = user._id;
      if(request.payload.image && request.payload.image.length){
        babble.image.data = request.payload.image.toString('base64')
        babble.image.contentType = 'image/*';
      }
      babble.save().then(newBabble => {
        reply(newBabble).code(200);
      });
    }).catch(err => {
      reply(Boom.badImplementation(err));
    })
  },
};

exports.getOne = {
  auth: false,
  handler: function (request, reply) {
    Babble.find({ _id: request.params.id }).then(babble => {
      reply(babble).code(200);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.getAll = {
  auth: false,
  handler: function (request, reply) {
    Babble.find({}).then(babbles => {
      reply(babbles).code(200);
    }).catch(err => {
      reply(Boom.badImplementation('error'));
    });
  },
};

exports.deleteOne = {
  auth: false,
  handler: function (request, reply) {
    Babble.remove({ _id: request.params.id }).then(() => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.deleteAll = {
  auth: false,
  handler: function (request, reply) {
    Babble.remove({}).then(() => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error while deleting'));
    });
  },
};

exports.getByUser = {
  auth: false,
  handler: function (request, reply) {
    Babble.find({ user: request.params.id }).then(babbles => {
      reply(babbles).code(200);
    }).catch(err => {
      reply(Boom.notFound('no babbles found for this id'));
    });
  },
};


exports.deleteByUser = {
  auth: false,
  handler: function (request, reply) {
    Babble.remove({ user: request.params.id }).then(() => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.notFound('none found'));
    });
  },
};