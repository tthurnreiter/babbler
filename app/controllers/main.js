'use strict';

const Babble = require('../models/babble');
const User = require('../models/user');

const moment = require('moment');

exports.main = {
  auth: { mode: 'try' },
  handler: function (request, reply) {
    if (request.auth.isAuthenticated) {
      Promise.all([
        Babble.find({}).populate('user'),
        User.findOne({ email: request.auth.credentials.loggedInUser }),
      ]).then(([babbles, loggedInUser]) => {
        formatBabbles(babbles, loggedInUser);
        reply.view('usermain', {
          title: 'Babbler. Don\'t hold back.',
          loggedInUser: loggedInUser,
          babbles: babbles,
        });
      }).catch(err => {
        reply(err);
      });
    } else {
      reply.view('main', { title: 'Babbler. Don\'t hold back.' });
    }
  },
};

exports.showUserTimeline = {
  plugins: { 'hapi-auth-cookie': { redirectTo: '/login' } },
  handler: function (request, reply) {

    Promise.all([
      User.findOne({ _id: request.params.id }),
      User.findOne({ email: request.auth.credentials.loggedInUser }),
    ]).then(([user, loggedInUser]) => {
      Babble.find({ user: user }).populate('user').then(babbles => {
        formatBabbles(babbles, loggedInUser);
        var allowBulkDelete;
        if((user.role && user.role === 'admin') || ( user._id.equals(loggedInUser._id)))
        {
          allowBulkDelete = true;
        }

        reply.view('usertimeline', {
          title: 'Babbler. Don\'t hold back.',
          user: user,
          babbles: babbles,
          allowBulkDelete: true,
        });
      });
    }).catch(err => {
      reply('User ID ' + err.value + ' not found');
    });
  },
};

exports.showUsers = {
  plugins: { 'hapi-auth-cookie': { redirectTo: '/login' } },
  handler: function (request, reply) {
    User.find({}).then(users => {
      users.forEach(user => {
        user.canDelete = true;
      });
      reply.view('users', {
        users: users,
      });
    });
  },
};

exports.myBabbles = {
  handler: function (request, reply) {
    User.findOne({ email: request.auth.credentials.loggedInUser }).then( user => {
      reply.redirect('/user/' + user._id);
    }).catch(err => {
      reply.redirect('/login');
    });
  },
};

function formatBabbles(babbles, loggedInUser) {
  //sort babbles newest first
  babbles.sort(function (a, b) {
    return b.date - a.date;
  });

  babbles.forEach(babble => {
    //produce date string for easier display
    let date = moment(babble.date);
    babble.datestring = date.format('D. MMMM Y, H:mm:ss');
    //set canDelete property for delete button display
    if (babble.user._id.equals(loggedInUser._id)
        || (loggedInUser.role && loggedInUser.role === 'admin')) {
      babble.canDelete = true;
    }
  });
}