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

const authRoutes = require('./Backend/routes/auth');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  //res.json({ message: 'CampusIQ API running' });
  res.redirect('/login');

});

app.get('/login', (req, res) => {
  res.render('LoginRegister');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));