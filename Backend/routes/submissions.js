const express = require('express');
const router = express.Router();
const { submitStudentData, getMySubmissions } = require('../controllers/submissionController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// POST /api/submissions — student submits their marks + attendance
// protect: must be logged in
// restrictTo('student'): only students can submit, not admins
router.post('/', protect, restrictTo('student'), submitStudentData);

// GET /api/submissions/me — student views their own submission
// protect: must be logged in
// restrictTo('student'): students only
router.get('/me', protect, restrictTo('student'), getMySubmissions);

module.exports = router;
