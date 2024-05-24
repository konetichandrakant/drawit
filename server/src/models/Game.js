const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
    playedDate: {
        type: Date
    },
    levelInformation: {
        type: [{ type: { String: Number } }]
    },
    drawingItems: {
        type: [String]
    },
    userInformation: {
        type: String, // Declare type of object returned
        virtual: true, // Indicate it's a virtual field
        get() {
            // write the specific code here to target specific functions
        }
    }
})

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;