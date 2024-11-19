const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Set your JWT secret key
const JWT_SECRET = 'your_jwt_secret_key_here'; // Change this in production

// Signup
exports.signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    const existingPhone = await User.findOne({ phone });

    if (existingEmail || existingPhone) {
      return res.status(400).json({ error: 'Email or phone number already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phone, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: { name, email } });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      // Create JWT token
      const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '30s' }); // Token expires in 30 seconds
      res.status(200).json({
        message: 'Login successful',
        token, // Send token to the frontend
        user: { name: user.name, email: user.email }
      });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Middleware to protect routes
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
};
