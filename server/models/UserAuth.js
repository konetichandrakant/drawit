const mongoose = require('mongoose');

const UserAuthSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const UserAuth = mongoose.model('UserAuth', UserAuthSchema);

module.exports = UserAuth;