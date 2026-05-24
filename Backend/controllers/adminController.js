const Submission = require('../models/submissions');

const VALID_RISK_LEVELS = ['Low', 'Medium', 'High'];

// @desc    Get all student submissions (with optional risk filter + pagination)
// @route   GET /api/admin/students?riskLevel=High&page=1&limit=20
// @access  Private (admin only)
const getAllStudents = async (req, res) => {
  try {
    const { riskLevel, page = 1, limit = 20 } = req.query;

    // Validate riskLevel if provided
    if (riskLevel && !VALID_RISK_LEVELS.includes(riskLevel)) {
      return res.status(400).json({
        message: `Invalid riskLevel. Must be one of: ${VALID_RISK_LEVELS.join(', ')}`
      });
    }

    const filter = riskLevel ? { riskLevel } : {};

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // cap at 100
    const skip = (pageNum - 1) * limitNum;

    const [submissions, total] = await Promise.all([
      Submission.find(filter)
        .populate('student', 'name email')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Submission.countDocuments(filter)
    ]);

    res.status(200).json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      submissions
    });

  } catch (error) {
    console.error('getAllStudents error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Get individual student submission by submission ID
// @route   GET /api/admin/students/:id
// @access  Private (admin only)
const getStudentById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('student', 'name email');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Guard: handle case where student account was deleted
    if (!submission.student) {
      return res.status(404).json({ message: 'Student account no longer exists' });
    }

    res.status(200).json({ submission });

  } catch (error) {
    console.error('getStudentById error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Export all submissions for Power BI (flat rows, one per subject)
// @route   GET /api/admin/export/students
// @access  Private (admin only)
const exportForPowerBI = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('student', 'name email');

    // Flatten: one row per subject — Power BI reads this cleanly
    const exportData = [];

    for (const sub of submissions) {
      // Skip orphaned submissions (student account deleted)
      if (!sub.student) continue;

      for (const subject of sub.subjects) {
        exportData.push({
          studentName:    sub.student.name,
          studentEmail:   sub.student.email,
          riskScore:      sub.riskScore ?? 'Pending',
          riskLevel:      sub.riskLevel ?? 'Pending',
          subjectName:    subject.name,
          subjectMark:    subject.mark,
          subjectAttendance: subject.attendance,
          submittedAt:    sub.submittedAt
        });
      }
    }

    if (exportData.length === 0) {
      return res.status(200).json({ message: 'No data available for export.', data: [] });
    }

    res.status(200).json({ total: exportData.length, data: exportData });

  } catch (error) {
    console.error('exportForPowerBI error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = { getAllStudents, getStudentById, exportForPowerBI };