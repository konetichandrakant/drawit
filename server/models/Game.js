const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
    playedDate: {
        type: Date
    },
    userInformation: {
        type: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                score: {
                    type: Number,
                }
            }
        ],
        default: []
    }
})

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;