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
    gameIds: {
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
        ref: 'Game',  // Reference to 'Game' model (optional)
        default: []
    },
    noOfGamesPlayed: {
        type: Number,
        virtual: true, // Indicate it's a virtual field
        get() {
            // Improved handling of missing gameIds
            return this.gameIds ? this.gameIds.length : 0;
        }
    }
});

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next(); // Skip hashing if password hasn't changed

//     try {
//         const salt = await bcrypt.genSalt(10); // Generate a salt for secure hashing
//         this.password = await bcrypt.hash(this.password, salt); // Hash the password
//         next();
//     } catch (err) {
//         next(err); // Pass any errors to the error handler
//     }
// });

// // Method for comparing passwords (during login)
// userSchema.methods.comparePassword = async function (candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password); // Compare hashed passwords
// };

const User = mongoose.model('User', userSchema);

module.exports = User;