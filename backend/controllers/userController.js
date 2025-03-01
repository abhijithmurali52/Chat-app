const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  // Ensure the JWT_SECRET is loaded
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in the environment variables');
  }
  console.log('JWT_SECRET during token generation:', process.env.JWT_SECRET);

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Log incoming data for debugging
    console.log('Registering user with data:', req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password });
    if (user) {
      const token = generateToken(user._id);
      console.log('New user created and token generated:', token);

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      });
    } else {
      res.status(400).json({ message: 'Failed to register user' });
    }
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Attempting login for email:', email);

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      console.log('User found and password matched:', user._id);

      const token = generateToken(user._id);
      console.log('Generated Token:', token);

      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      });
    } else {
      console.log('Invalid email or password for email:', email);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get All Users
const getUsers = async (req, res) => {
  try {
    console.log('Fetching all users');
    const users = await User.find({}, 'username email _id'); // Fetch specific fields only
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUsers };
