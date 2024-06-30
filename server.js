// Step 1: Backend Setup
// Update the backend to include JSON Web Token (JWT) and MongoDB for registration and login, and return the user information and token upon successful registration or login.
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const UserSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model('User', UserSchema);

// Register API
app.post('/api/register', async (req, res) => {
  const { name, dob, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ name, dob, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
    res.status(201).json({ token, user: { name: user.name, dob: user.dob, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: 'User registration failed' });
  }
});

// Login API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
  res.json({ token, user: { name: user.name, dob: user.dob, email: user.email } });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
