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
    username: {
        type: String,
        required: true
    },
    gameIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Game',
            default: []
        }
    ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;