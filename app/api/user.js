'use strict';

const User = require('../models/user');
const Boom = require('boom');

exports.getOne = {
  auth: false,
  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }).then(user => {
      reply(user).code(200);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  }
}

exports.getAll = {
  auth: false,
  handler: function (request, reply) {
    User.find({}).then( users => {
      reply(users).code(200);
    }).catch(err => {
      reply(Boom.badImplementation('error'));
    });
  }
}

exports.deleteOne = {
  auth: false,
  handler: function (request, reply) {
    User.remove({ _id: request.params.id }).then(() => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.deleteAll = {
  auth: false,
  handler: function (request, reply) {
    User.remove({}).then( () => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error while deleting'));
    });
  },
};
