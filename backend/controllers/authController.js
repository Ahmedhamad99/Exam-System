
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    await user.save();

<<<<<<< HEAD
    const now = Math.floor(Date.now() / 1000); // التوقيت الحالي بالثواني
=======
    const now = Math.floor(Date.now() / 1000); 
>>>>>>> 7af40d352f80120386f6c7c748f0c8e8e27bafbc
    const token = jwt.sign(
      { userId: user._id, role: user.role, iat: now },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

<<<<<<< HEAD
    const now = Math.floor(Date.now() / 1000); // التوقيت الحالي بالثواني
=======
    const now = Math.floor(Date.now() / 1000); 
>>>>>>> 7af40d352f80120386f6c7c748f0c8e8e27bafbc
    const token = jwt.sign(
      { userId: user._id, role: user.role, iat: now },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
