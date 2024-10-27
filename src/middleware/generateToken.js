const jwt = require('jsonwebtoken');

const generateToken = async (res, userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7h' });
        return token;
    } catch (err) {
        console.error('Error generating JWT token:', err);
        throw err;
    }
}

module.exports = generateToken;