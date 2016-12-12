'use strict';

const Babble = require('../models/babble');

exports.deleteOne = {
  handler: function (request, reply) {
    Babble.remove({ _id: request.params.id }).then(candidate => {
      reply(candidate).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};
