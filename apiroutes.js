const Babble = require('./app/api/babble');
const User = require('./app/api/user');

module.exports = [

    //USERS
  { method: 'GET', path: '/api/user/{id}', config: User.getOne },
  { method: 'DELETE', path: '/api/user/{id}', config: User.deleteOne },

  { method: 'GET', path: '/api/users', config: User.getAll },
  { method: 'DELETE', path: '/api/users', config: User.deleteAll },

    //BABBLES
  { method: 'GET', path: '/api/babble/{id}', config: Babble.getOne },
  { method: 'DELETE', path: '/api/babble/{id}', config: Babble.deleteOne },

  { method: 'GET', path: '/api/babbles', config: Babble.getAll },
  { method: 'DELETE', path: '/api/babbles', config: Babble.deleteAll },

  { method: 'GET', path: '/api/user/{id}/babbles', config: Babble.getByUser },

];
