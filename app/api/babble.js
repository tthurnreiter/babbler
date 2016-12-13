'use strict';

const Babble = require('../models/babble');
const Boom = require('boom');

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
    Babble.find({ user: request.params.id}).then(babbles => {
      reply(babbles).code(200);
    }).catch(err => {
      reply(Boom.notFound('no babbles found for this id'));
    });
  },
};
