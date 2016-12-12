const Babble = require('./app/api/babble');
const User = require('./app/api/user');

module.exports = [
  { method: 'DELETE', path: '/api/babble/{id}', config: Babble.deleteOne },
  { method: 'DELETE', path: '/api/user/{id}', config: User.deleteOne },

];
