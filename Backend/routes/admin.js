const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentById, exportForPowerBI } = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// GET /api/admin/students?riskLevel=High&page=1&limit=20 — all student submissions
// protect: must be logged in
// restrictTo('admin'): students cannot access admin routes
router.get('/students', protect, restrictTo('admin'), getAllStudents);

// GET /api/admin/export/students — flat export for Power BI
// IMPORTANT: must be above /students/:id so Express doesn't treat 'export' as an :id
router.get('/export/students', protect, restrictTo('admin'), exportForPowerBI);

// GET /api/admin/students/:id — single student submission by ID
router.get('/students/:id', protect, restrictTo('admin'), getStudentById);

module.exports = router;