const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
const session = require('express-session');


const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token
        // console.log("requests: ", req);
        // console.log('Cookies:', req.cookies);
        // console.log('Verifying token', token);

        // const token = req.headers.authorization?.split(' ')[1];
        // console.log("Token:", token);
        
        if (!token) 
            return res.status(401).json({ message: 'Token not provided!' });

        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded.userId) {
            return res.status(403).json({ message: 'Invalid token provided!'});
        } else{
            req.userId = decoded.userId;
            req.role = decoded.role;
            next(); 
        }
    } catch (error) {
        console.error("Error verifying user ", error);
        res.status(401).json({ message: 'Token is not valid!' });
    }
}

module.exports = verifyToken;