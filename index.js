'use strict';

const Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: process.env.PORT || 4000 });

require('./app/models/db');

server.register([require('inert'), require('vision'), require('hapi-auth-cookie')], err => {

  if (err) {
    throw err;
  }

  server.auth.strategy('standard', 'cookie', {
    password: 'secretpasswordnotrevealedtoanyone', //factor this out to gitignored config for real app
    cookie: 'donation-cookie',
    ttl: 24 * 60 * 60 * 1000,
    isSecure: false,
    redirectTo: '/login',
  });

  server.auth.default({ strategy: 'standard' });

  server.views({
    engines: {
      hbs: require('handlebars'),
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layout',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false,
  });

  server.route(require('./routes'));

  server.start((err) => {
    if (err) {
      throw err;
    }

    console.log('Server listening at:', server.info.uri);
  });

});
