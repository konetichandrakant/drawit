const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
    playedDate: {
        type: Date
    },
    userInformation: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            levelInformation: [
                {
                    drawingItem: {
                        type: String
                    },
                    score: {
                        type: Number
                    }
                }
            ]
        }
    ]
})

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;