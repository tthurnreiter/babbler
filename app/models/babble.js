'use strict';

const mongoose = require('mongoose');

const babbleSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  text: String,
  image: {
    data: String,
    contentType: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Babble = mongoose.model('Babble', babbleSchema);
module.exports = Babble;
