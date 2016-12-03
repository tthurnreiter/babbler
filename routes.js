const Assets = require('./app/controllers/assets');
const Accounts = require('./app/controllers/accounts');
const Settings = require('./app/controllers/settings');
const Babble = require('./app/controllers/babble');
module.exports = [
  { method: 'GET', path: '/', config: Accounts.main },
  { method: 'GET', path:'/signup', config: Accounts.signup },
  { method: 'POST', path: '/signup', config: Accounts.register },

  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/login', config: Accounts.authenticate },

  { method: 'GET', path: '/logout', config: Accounts.logout },

  { method: 'GET', path: '/settings', config: Settings.viewSettings },
  { method: 'POST', path: '/settings', config: Settings.updateSettings },

  { method: 'POST', path: '/babble', config: Babble.postBabble },

  {
    method: 'GET', path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },
];
