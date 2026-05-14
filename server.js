require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./Backend/config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require('./Backend/routes/auth');
app.use('/api/auth', authRoutes);
const submissionRoutes = require('./Backend/routes/submissions');
const adminRoutes = require('./Backend/routes/admin');

app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CampusIQ API running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));