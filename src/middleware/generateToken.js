const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = async (userId)=>{
    try {
        const user = await User.findById(userId);

        if(!user){
            throw new Error('User not found');
        } else{
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return token;
        }
    } catch (err) {
        console.error('Error generating JWT token:', err);
        throw err;
    }
}

module.exports = generateToken;