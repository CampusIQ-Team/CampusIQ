const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  exportForPowerBI
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// GET /api/admin/students?riskLevel=High&page=1&limit=20 — all student submissions
router.get('/students', protect, restrictTo('admin'), getAllStudents);

// GET /api/admin/export/students — flat export for Power BI
// IMPORTANT: must be above /students/:id so Express doesn't treat 'export' as an :id
router.get('/export/students', protect, restrictTo('admin'), exportForPowerBI);

// GET /api/admin/students/:id — single student submission by ID
router.get('/students/:id', protect, restrictTo('admin'), getStudentById);

// PUT /api/admin/students/:id — update student submission
router.put('/students/:id', protect, restrictTo('admin'), updateStudent);

// DELETE /api/admin/students/:id — delete student submission
router.delete('/students/:id', protect, restrictTo('admin'), deleteStudent);

module.exports = router;