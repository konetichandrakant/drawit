const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
  userRankings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  Date: {
    type: Date
  }
})

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;