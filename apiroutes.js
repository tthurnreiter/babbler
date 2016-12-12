const Babble = require('./app/api/babble');

module.exports = [
  { method: 'DELETE', path: '/api/babble/{id}', config: Babble.deleteOne },

];
