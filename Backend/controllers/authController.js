const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sanitizeMessage } = require('../utils/helpers');
const { validationResult } = require('express-validator');

// Generate JWT
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register new user
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password, displayName } = req.body;
    console.log("📥 Incoming register request:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("⚠️ Email already registered:", email);
      return res.status(400).json({ success: false, error: 'Email already in use' });
    }

    const user = await User.create({
      email,
      password,
      profile: { displayName }
    });

    console.log("✅ User created:", user.email);

    const token = createToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        displayName: user.profile.displayName,
        email: user.email
      }
    });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 Login attempt:", email);

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.warn("❌ User not found:", email);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.warn("❌ Incorrect password for:", email);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    console.log("✅ Login successful:", email);

    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        displayName: user.profile.displayName,
        email: user.email
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};
