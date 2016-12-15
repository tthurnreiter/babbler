const Babble = require('./app/api/babble');
const User = require('./app/api/user');

module.exports = [

    //USERS
  { method: 'GET', path: '/api/user/{id}', config: User.getOne },
  { method: 'POST', path: '/api/user/{id}', config: User.edit },
  { method: 'DELETE', path: '/api/user/{id}', config: User.deleteOne },

  { method: 'GET', path: '/api/user/{id}/following', config: User.getFollowing },
  { method: 'POST', path: '/api/user/{id1}/following/{id2}', config: User.addFollowing },
  { method: 'DELETE', path: '/api/user/{id1}/following/{id2}', config: User.deleteFollowing },


  { method: 'GET', path: '/api/users', config: User.getAll },
  { method: 'POST', path: '/api/users', config: User.create },
  { method: 'DELETE', path: '/api/users', config: User.deleteAll },



    //BABBLES
  { method: 'GET', path: '/api/babble/{id}', config: Babble.getOne },
  { method: 'DELETE', path: '/api/babble/{id}', config: Babble.deleteOne },

  { method: 'GET', path: '/api/babbles', config: Babble.getAll },
  { method: 'POST', path: '/api/babbles', config: Babble.post },
  { method: 'DELETE', path: '/api/babbles', config: Babble.deleteAll },

  { method: 'POST', path: '/api/babbles/bulkdelete', config: Babble.bulkDelete },

  { method: 'GET', path: '/api/user/{id}/babbles', config: Babble.getByUser },
  { method: 'DELETE', path: '/api/user/{id}/babbles', config: Babble.deleteByUser },
];
