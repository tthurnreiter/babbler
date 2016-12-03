'use strict';

const Babble = require('../models/babble');

const moment = require('moment');

exports.main = {
  auth: { mode: 'optional' },
  handler: function (request, reply) {
    if (request.auth.isAuthenticated) {
      Babble.find({}).populate('user').then(babbles => {
        //sort babbles newest first
        babbles.sort(function(a,b){
          return b.date - a.date;
        });

        //produce date string for easier display
        babbles.forEach(babble => {
          let date = moment(babble.date);
          babble.datestring = date.format("D. MMMM Y, H:mm:ss");
        })
        reply.view('usermain', {
          title: 'Babbler. Don\'t hold back.',
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