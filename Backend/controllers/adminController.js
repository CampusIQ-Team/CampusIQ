const Submission = require('../models/Submission');
const User = require('../models/User');

// @desc    Get all student submissions (with optional risk filter)
// @route   GET /api/admin/students
// @access  Private (admin only)
const getAllStudents = async (req, res) => {
  try {
    const { riskLevel } = req.query;

    let filter = {};
    if (riskLevel) {
      filter.riskLevel = riskLevel;
    }

    const submissions = await Submission.find(filter)
      .populate('student', 'name email')
      .sort({ submittedAt: -1 });

    res.status(200).json(submissions);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get individual student profile
// @route   GET /api/admin/students/:id
// @access  Private (admin only)
const getStudentById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('student', 'name email');

    if (!submission) {
      return res.status(404).json({ message: 'Student submission not found' });
    }

    res.status(200).json(submission);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Export all submissions for Power BI
// @route   GET /api/export/students
// @access  Private (admin only)
const exportForPowerBI = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('student', 'name email');

    const exportData = submissions.map(sub => ({
      studentName: sub.student.name,
      studentEmail: sub.student.email,
      riskScore: sub.riskScore,
      riskLevel: sub.riskLevel,
      submittedAt: sub.submittedAt,
      subjects: sub.subjects
    }));

    res.status(200).json(exportData);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllStudents, getStudentById, exportForPowerBI };