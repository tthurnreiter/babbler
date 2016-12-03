'use strict';

const Babble = require('../models/babble');
const User = require('../models/user');

const moment = require('moment');

exports.main = {
  auth: { mode: 'optional' },
  handler: function (request, reply) {
    if (request.auth.isAuthenticated) {
      Babble.find({}).populate('user').then(babbles => {
        //sort babbles newest first
        babbles.sort(function (a, b) {
          return b.date - a.date;
        });

        //produce date string for easier display
        babbles.forEach(babble => {
          let date = moment(babble.date);
          babble.datestring = date.format("D. MMMM Y, H:mm:ss");
        })
        User.findOne({ email: request.auth.credentials.loggedInUser }).then(user => {
          reply.view('usermain', {
            title: 'Babbler. Don\'t hold back.',
            user: user,
            babbles: babbles,
          });
        });
      }).catch(err => {
        reply(err);
      });


    } else {
      reply.view('main', { title: 'Babbler. Don\'t hold back.' });
    }
  },
};