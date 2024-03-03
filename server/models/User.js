const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gameInformation: {
        type: [
            {
                gameId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Game'
                },
                score: {
                    type: Number
                },
                rank: {
                    type: Number
                }
            }
        ],
        default: []
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
