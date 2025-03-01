const express = require('express');
const { registerUser, loginUser, getUsers } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser); // Register new user
router.post('/login', loginUser);       // Login user
router.get('/users', getUsers);

module.exports = router;
