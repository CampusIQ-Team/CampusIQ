const express = require('express');
const router = express.Router();
const { submitStudentData, getMySubmissions } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

// Student submits their marks + attendance
router.post('/', protect, submitStudentData);

// Student views their own submissions
router.get('/me', protect, getMySubmissions);

module.exports = router;