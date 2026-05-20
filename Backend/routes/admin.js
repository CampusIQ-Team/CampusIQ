const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentById, exportForPowerBI } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all students (with optional ?riskLevel=High filter)
router.get('/students', protect, adminOnly, getAllStudents);

// Get individual student profile
router.get('/students/:id', protect, adminOnly, getStudentById);

// Export data for Power BI
router.get('/export/students', protect, adminOnly, exportForPowerBI);

module.exports = router;