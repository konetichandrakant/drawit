const User = require('../models/User');
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.loginService = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    try {
        const user = await User.findOne({ email: email });
        console.log(user, email);

        if (!user || user.password !== password)
            return res.status(200).send({ message: '** Incorrect email or password **' });

        const userId = user._id.toString();
        const token = jwt.sign({ userId, email }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256' });

        return res.status(200).send({ token: `Bearer ${token}` });
    } catch (err) {
        return res.status(200).send({ message: 'Some error occured please try again!!' });
    }
}

exports.registerService = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const userWithEmail = await User.findOne({ email });

        if (userWithEmail)
            return res.status(200).send({ message: 'User with the entered email already exists!!' });

        const user = new User({ email, password, username });
        await user.save();

        const userId = user._id.toString();
        const token = jwt.sign({ userId, email }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256' });

        return res.status(200).send({ token: `Bearer ${token}` });
    } catch (err) {
        return res.status(500).send({ message: 'Error while registering' });
    }
}