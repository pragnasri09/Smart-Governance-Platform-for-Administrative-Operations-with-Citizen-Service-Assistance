const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = Number(process.env.PORT || 5000);
const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;

if (!mongoUri) throw new Error('MONGODB_URI must be configured in .env');
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long.');
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${PORT}`, methods: ['GET', 'POST', 'PATCH'] }));
app.use(express.json({ limit: '10kb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many attempts. Please try again in 15 minutes.' } }));

function cleanEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128 ||
      !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return 'Password must be 12–128 characters and include uppercase, lowercase, a number, and a symbol.';
  }
  return null;
}

function createToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, jwtSecret, { expiresIn: '1h', issuer: 'civicpulse' });
}

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.slice(7);
  if (!token) return res.status(401).json({ message: 'Authentication is required.' });
  try {
    req.auth = jwt.verify(token, jwtSecret, { issuer: 'civicpulse' });
    return next();
  } catch {
    return res.status(401).json({ message: 'Your session is invalid or has expired. Please sign in again.' });
  }
}

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = cleanEmail(req.body.email);
    const passwordError = validatePassword(req.body.password);
    if (name.length < 2 || name.length > 80) return res.status(400).json({ message: 'Enter a name between 2 and 80 characters.' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
    if (passwordError) return res.status(400).json({ message: passwordError });
    if (await User.exists({ email })) return res.status(409).json({ message: 'An account with that email already exists.' });

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({ name, email, passwordHash });
    return res.status(201).json({ token: createToken(user), user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) { return next(error); }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = cleanEmail(req.body.email);
    const password = req.body.password;
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || typeof password !== 'string' || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    return res.json({ token: createToken(user), user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) { return next(error); }
});

app.get('/api/auth/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.sub).lean();
    if (!user) return res.status(401).json({ message: 'Account not found.' });
    return res.json({ user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) { return next(error); }
});

app.patch('/api/auth/password', requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const passwordError = validatePassword(newPassword);
    if (passwordError) return res.status(400).json({ message: passwordError });
    const user = await User.findById(req.auth.sub).select('+passwordHash');
    if (!user || !(await bcrypt.compare(currentPassword || '', user.passwordHash))) {
      return res.status(401).json({ message: 'Your current password is incorrect.' });
    }
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    return res.json({ message: 'Password updated successfully. Please sign in again.' });
  } catch (error) { return next(error); }
});

app.use(express.static(path.join(__dirname, 'Front-End')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'Front-End', 'admin', 'admin-login.html')));
app.use((err, req, res, next) => {
  if (err?.code === 11000) return res.status(409).json({ message: 'An account with that email already exists.' });
  console.error(err);
  return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
});

mongoose.connect(mongoUri).then(() => app.listen(PORT, () => console.log(`CivicPulse running at http://localhost:${PORT}`))).catch((error) => {
  console.error('MongoDB connection failed:', error.message);
  process.exit(1);
});
