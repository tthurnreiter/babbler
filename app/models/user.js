'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  bio: String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
