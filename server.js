require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./Backend/config/db');
const path = require('path');

connectDB();

const app = express();


app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs');
app.set(
  'views', 
  path.join(__dirname, 'Frontend', 'views')
);

app.use(
  express.static(path.join(__dirname, 'Frontend'))
);

// Routes ==================================================
const authRoutes = require('./Backend/routes/auth');
app.use('/api/auth', authRoutes);
const submissionRoutes = require('./Backend/routes/submissions');
const adminRoutes = require('./Backend/routes/admin');

app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  //res.json({ message: 'CampusIQ API running' });
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  res.render('Home');
});

app.get('/login', (req, res) => {
  res.render('LoginRegister');
});

app.get('/admin-dashboard', (req, res) => {
  res.render('AdminDashboard');
});

app.get('/student-dashboard', (req, res) => {
  res.render('StudentDashboard');
});

app.get('/about', (req, res) => {
  res.render('About');
});

app.get('/student-form', (req, res) => {
  res.render('StudentForm');
});

app.get('/risk-result', (req, res) => {
  res.render('RiskResult');
});

app.get('/student-profile', (req, res) => {
  res.render('StudentProfile');
});

app.get('/management', (req, res) => {
  res.render('Management');
});

// ─── Start Server ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CampusIQ API running on port ${PORT}`);
});