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

        babbles.forEach(babble => {
          //produce date string for easier display
          let date = moment(babble.date);
          babble.datestring = date.format("D. MMMM Y, H:mm:ss");
          //convert image to base64
          if (babble.image && babble.image.data) {
            const base = babble.image.data.toString('base64');
            babble.image.base64 = base;
          }
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

exports.showUserTimeline = {
  auth: false,
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
          //convert image to base64
          if (babble.image && babble.image.data) {
            const base = babble.image.data.toString('base64');
            babble.image.base64 = base;
          }
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