const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token
            token = req.headers.authorization.split(' ')[1];
            console.log('Token received from header:', token);

            // Log JWT_SECRET value
            if (!process.env.JWT_SECRET) {
                console.error('JWT_SECRET is undefined. Check your .env file and dotenv setup.');
                return res.status(500).json({ message: 'Server error: JWT secret not configured' });
            }
            console.log('JWT_SECRET being used:', process.env.JWT_SECRET);

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token payload:', decoded);

            // Find user from token
            req.user = await User.findById(decoded.id).select('-password');
            console.log('User found from token:', req.user);

            if (!req.user) {
                console.error('No user found with the ID in the token');
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Proceed to the next middleware/controller
            next();
        } catch (error) {
            // Log detailed error messages
            console.error('Error during token verification:', error.message);

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired. Please login again.' });
            }
            if (error.name === 'JsonWebTokenError') {
                console.error('Invalid token error:', error);
                return res.status(401).json({ message: 'Invalid token. Please login again.' });
            }

            // Catch any other errors
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.warn('Authorization header is missing or does not start with "Bearer"');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
