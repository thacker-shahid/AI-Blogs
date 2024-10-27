const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = async (res, userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        } else {
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7h' });
            res.cookie('token', token, {
                httpOnly: true, // this prevents from XSS attacks
                secure: true,
                sameSite: 'strict', // this prevents from csrf attacks
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            return token;
        }
    } catch (err) {
        console.error('Error generating JWT token:', err);
        throw err;
    }
}

module.exports = generateToken;