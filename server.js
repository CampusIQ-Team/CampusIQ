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

app.get('/', (req, res) => {
  //res.json({ message: 'CampusIQ API running' });
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('LoginRegister');
});

app.get('/admin-dashboard', (req, res) => {
  res.render('AdminDashboard');
});

app.get('/student-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'views', 'StudentDashboard.html'));
});

app.get('/about', (req, res) => {
  res.render('About');
});

app.use('/api/submissions', require('./Backend/routes/submissions'));

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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));