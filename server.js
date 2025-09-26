// server.js

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { buildComprehensivePlan } = require('./plan-engine');

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const DATA_FILE = path.join(__dirname, 'data.json');

// Ensure data file exists
function ensureDataFile() {
	if (!fs.existsSync(DATA_FILE)) {
		const initial = { users: [] };
		fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
	}
}

function readDb() {
	ensureDataFile();
	const raw = fs.readFileSync(DATA_FILE, 'utf-8');
	return JSON.parse(raw);
}

function writeDb(db) {
	fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

function generateUserId(email) {
	// Simple deterministic id fallback
	return Buffer.from(email).toString('hex').slice(0, 24);
}

function createToken(payload) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, _res, next) {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
	if (!token) return next();
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
	} catch (_e) {
		// ignore invalid
	}
	next();
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Healthcheck
app.get('/api/health', (_req, res) => {
	res.json({ status: 'ok' });
});

// Auth: signup
app.post('/api/auth/signup', async (req, res) => {
	try {
		const { email, password } = req.body || {};
		if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
		const db = readDb();
		const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
		if (existing) return res.status(409).json({ error: 'Email already registered' });
		const passwordHash = await bcrypt.hash(password, 10);
		const user = {
			id: generateUserId(email),
			email,
			passwordHash,
			profile: { age: null, medicalConditions: [], yogaPurpose: null },
			createdAt: new Date().toISOString()
		};
		db.users.push(user);
		writeDb(db);
		const token = createToken({ id: user.id, email: user.email });
		res.status(201).json({ token, user: { id: user.id, email: user.email, profile: user.profile } });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Auth: login
app.post('/api/auth/login', async (req, res) => {
	try {
		const { email, password } = req.body || {};
		if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
		const db = readDb();
		const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
		if (!user) return res.status(401).json({ error: 'Invalid credentials' });
		const ok = await bcrypt.compare(password, user.passwordHash || '');
		if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
		const token = createToken({ id: user.id, email: user.email });
		res.json({ token, user: { id: user.id, email: user.email, profile: user.profile } });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Current user profile
app.get('/api/me', (req, res) => {
	if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
	const db = readDb();
	const user = db.users.find(u => u.id === req.user.id);
	if (!user) return res.status(404).json({ error: 'User not found' });
	res.json({ id: user.id, email: user.email, profile: user.profile });
});

// Update profile
app.put('/api/me', (req, res) => {
	if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
	const { yogaProfile } = req.body || {};
	const db = readDb();
	const user = db.users.find(u => u.id === req.user.id);
	if (!user) return res.status(404).json({ error: 'User not found' });
	user.yogaProfile = {
        ...user.yogaProfile, // retain existing keys
        ...yogaProfile       // apply updates
    };
	writeDb(db);
	res.json({ id: user.id, email: user.email, yogaProfile: user.yogaProfile });
});

// Plan generation endpoint (auth optional)
app.post('/api/generate-plan', (req, res) => {
	try {
		const { yogaProfile } = req.body || {};
		const plan = buildComprehensivePlan(yogaProfile);
		return res.json(plan);
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

app.listen(PORT, () => {
	console.log(`Yoga Planner server running on port ${PORT}`);
});