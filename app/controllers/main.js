'use strict';

exports.main = {
  auth: { mode: 'optional' },
  handler: function (request, reply) {
    if (request.auth.isAuthenticated) {
      reply.view('usermain', {
        title: 'Babbler. Don\'t hold back.',
      });
    } else {
      reply.view('main', { title: 'Babbler. Don\'t hold back.' });
    }
  },
};