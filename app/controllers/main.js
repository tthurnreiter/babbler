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
        //sort babbles newest first
        babbles.sort(function (a, b) {
          return b.date - a.date;
        });
        babbles.forEach(babble => {
          //produce date string for easier display
          babble.datestring = moment(babble.date).format("D. MMMM Y, H:mm:ss");
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
    User.findOne({ _id: request.params.id }).then(foundUser => {
      Babble.find({ user: foundUser }).populate('user').then(babbles => {
        //sort babbles newest first
        babbles.sort(function (a, b) {
          return b.date - a.date;
        });

        babbles.forEach(babble => {
          //produce date string for easier display
          let date = moment(babble.date);
          babble.datestring = date.format("D. MMMM Y, H:mm:ss");
        });
        reply.view('usertimeline', {
          title: 'Babbler. Don\'t hold back.',
          user: foundUser,
          babbles: babbles,
        });
      })
    }).catch(err => {
      reply("User ID " + err.value + " not found");
    });
  },
};