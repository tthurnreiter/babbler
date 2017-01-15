'use strict';

const Babble = require('../models/babble');
const User = require('../models/user');

const moment = require('moment');
const _ = require('lodash');
exports.main = {
  auth: { mode: 'try' },
  handler: function (request, reply) {
    if (request.auth.isAuthenticated) {
      User.findOne({ email: request.auth.credentials.loggedInUser }).then(loggedInUser => {
        Babble.find({ user: { $in: [...loggedInUser.following, loggedInUser._id] } }).populate('user').then(babbles => {
          formatBabbles(babbles, loggedInUser);
          reply.view('usermain', {
            title: 'Babbler. Don\'t hold back.',
            loggedInUser: loggedInUser,
            babbles: babbles,
          });
        });
      }).catch(err => {
        reply(err);
      });
    }
    else {
      reply.view('main', { title: 'Babbler. Don\'t hold back.' });
    }
  }
};

exports.showUserTimeline = {
  plugins: { 'hapi-auth-cookie': { redirectTo: '/login' } },
  handler: function (request, reply) {

    Promise.all([
      User.findOne({ _id: request.params.id }),
      User.findOne({ email: request.auth.credentials.loggedInUser }),
    ]).then(([user, loggedInUser]) => {
      if (!user._id.equals(loggedInUser._id)) {
        if (_.some(loggedInUser.following, user._id)) {
          user.showUnfollow = true;
        }
        else {
          user.showFollow = true;
        }
      }
      Babble.find({ user: user }).populate('user').then(babbles => {
        formatBabbles(babbles, loggedInUser);
        var allowBulkDelete;
        if ((user.role && user.role === 'admin') || ( user._id.equals(loggedInUser._id))) {
          allowBulkDelete = true;
        }

        reply.view('usertimeline', {
          title: 'Babbler. Don\'t hold back.',
          user: user,
          loggedInUser: loggedInUser,
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
    Promise.all([
      User.find({}),
      User.findOne({ email: request.auth.credentials.loggedInUser }),
    ]).then(([users, loggedInUser]) => {
          users.forEach(user => {
            user.numBabbles = user.
            user.showFollow = user.showUnfollow = false;
            if (_.some(loggedInUser.following, user._id)) {
              user.showUnfollow = true;
            }
            else {
              user.showFollow = true;
            }
            if (loggedInUser.role === 'admin') {
              user.canDelete = true;
            }
          });
          users.sort((a, b) => {
            return a.showFollow - b.showFollow;
          });
          _.remove(users, (user) => {
            return user._id.equals(loggedInUser._id);
          });
          reply.view('users', {
            users: users,
            loggedInUser: loggedInUser,
          });
        }
    )
    ;
  },
};

exports.showGlobalTimeline = {
  handler: function (request, reply) {
    User.findOne({ email: request.auth.credentials.loggedInUser }).then(loggedInUser => {
      Babble.find({}).populate('user').then(babbles => {
        formatBabbles(babbles, loggedInUser);
        reply.view('usermain', {
          title: 'Babbler. Don\'t hold back.',
          loggedInUser: loggedInUser,
          babbles: babbles,
        });
      });
    }).catch(err => {
      reply(err);
    });
  }
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