'use strict';

const User = require('../models/user');
const Babble = require('../models/babble');
const Boom = require('boom');
const Joi = require('joi');
const _ = require('lodash');

exports.create = {
  auth: false,

  validate: {
    payload: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply(error.data.details).code(400);
    },

    options: {
      abortEarly: false,
    },
  },

  handler: function (request, reply) {
    const user = new User(request.payload);

    user.save().then(newUser => {
      reply(user).code(200);
    }).catch(err => {
      reply.badImplementation('error creating user');
    });
  },
};

exports.edit = {
  auth: false,

  validate: {
    payload: {
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string(),
      bio: Joi.string(),
      image: Joi.string(),
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

    User.findOne({ _id: request.params.id }).then(user => {
      if (editedUser.name) {
        user.name = editedUser.name;
      }

      if (editedUser.bio) {
        user.bio = editedUser.bio;
      }

      if (editedUser.email) {
        user.email = editedUser.email;
      }

      if (editedUser.password) {
        user.password = editedUser.password;
      }

      if (editedUser.image) {
        user.image.contentType = 'image/*';
        user.image.data = editedUser.image.toString('base64');
      }

      return user.save();
    }).then(user => {
      reply(user).code(200);
    }).catch(err => {
      reply.badImplementation('error while saving');
    });
  },
};

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
    User.find({}).then(users => {
      reply(users).code(200);
    }).catch(err => {
      reply(Boom.badImplementation('error'));
    });
  }
}

exports.deleteOne = {
  auth: false,
  handler: function (request, reply) {
    Babble.remove({ user: request.params.id }).then(() => {
      User.remove({ _id: request.params.id }).then(() => {
        reply().code(204);
      });
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.deleteAll = {
  auth: false,
  handler: function (request, reply) {
    Babble.remove({}).then(() => {
      User.remove({}).then(() => {
        reply().code(204);
      });
    }).catch(err => {
      reply(Boom.badImplementation('error while deleting'));
    });
  },
};

exports.getFollowing = {
  auth: false,
  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }).then((user) => {
      reply(user.following).code(200);
    }).catch((err) => {
      reply(Boom.badImplementation(err));
    });
  },
};

exports.addFollowing = {
  auth: false,
  handler: function (request, reply) {
    if (request.params.id1 === request.params.id2) {
      reply(Boom.badRequest('users not follow theirselves'));
      return;
    }
    Promise.all([
      User.findOne({ _id: request.params.id1 }),
      User.findOne({ _id: request.params.id2 }),
    ]).then(([user1, user2]) => {
      if (_.some(user1.following, user2._id)) {
        reply(user1.following).code(200);
        return;
      }
      user1.following.push(user2._id);
      user1.save().then(() => {
        reply(user1.following).code(200);
      });
    }).catch((err) => {
      reply(Boom.badRequest(err));
    });
  },
};

exports.deleteFollowing = {
  auth: false,
  handler: function (request, reply) {
    Promise.all([
      User.findOne({ _id: request.params.id1 }),
      User.findOne({ _id: request.params.id2 }),
    ]).then(([user1, user2]) => {
      user1.following.pull(user2._id);
      user1.save().then(() => {
        reply(user1.following).code(200);
      });
    }).catch((err) => {
      reply(Boom.badRequest(err));
    });
  },
};
