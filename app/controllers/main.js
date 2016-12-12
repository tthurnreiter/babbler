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
        formatBabbles(babbles,loggedInUser);
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
        reply.view('usertimeline', {
          title: 'Babbler. Don\'t hold back.',
          user: user,
          babbles: babbles,
        });
      })
    }).catch(err => {
      reply('User ID ' + err.value + ' not found');
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
    if (babble.user._id.equals(loggedInUser._id)) {
      babble.canDelete = true;
    }
  });
}