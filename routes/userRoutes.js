const express = require('express');
const { signup, login, verifyToken } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/current', verifyToken, (req, res) => {
  res.json({ id: req.userId }); // Return user ID
});

module.exports = router;
