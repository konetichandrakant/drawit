const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
  score: {
    type: Number
  },
  drawingName: {

  }
})

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;