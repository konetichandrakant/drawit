const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userAuthID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAuth'
    },
    gameIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    gamesWon: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
