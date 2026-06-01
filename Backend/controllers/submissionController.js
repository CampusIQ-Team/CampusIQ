const Submission = require('../models/submissions');

// @desc    Submit student data (marks + attendance)
// @route   POST /api/submissions
// @access  Private (student)
const submitStudentData = async (req, res) => {
  try {
    const { subjects } = req.body;

    // Validate subjects array
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one subject' });
    }

    // Validate each subject
    for (const subject of subjects) {
      if (!subject.name || typeof subject.name !== 'string' || subject.name.trim() === '') {
        return res.status(400).json({ message: 'Each subject must have a valid name' });
      }

      if (typeof subject.mark !== 'number' || subject.mark < 0 || subject.mark > 100) {
        return res.status(400).json({
          message: `Mark for "${subject.name}" must be a number between 0 and 100`
        });
      }

      if (typeof subject.attendance !== 'number' || subject.attendance < 0 || subject.attendance > 100) {
        return res.status(400).json({
          message: `Attendance for "${subject.name}" must be a number between 0 and 100`
        });
      }
    }

    // Check for duplicate submission
    const existing = await Submission.findOne({ student: req.user._id });
    if (existing) {
      return res.status(409).json({
        message: 'You have already submitted your data. Contact your admin to make changes.'
      });
    }

    // Create submission
    const submission = await Submission.create({
      student: req.user._id,
      subjects
    });

    res.status(201).json({
      message: 'Submission successful',
      submission
    });

  } catch (error) {
    console.error('submitStudentData error:', error); // logs full error server-side
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Get current student's own submission
// @route   GET /api/submissions/me
// @access  Private (student)
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .sort({ submittedAt: -1 });

    // Friendly message if nothing found yet
    if (submissions.length === 0) {
      return res.status(200).json({ message: 'No submissions found yet.', submissions: [] });
    }

    res.status(200).json({ submissions });

  } catch (error) {
    console.error('getMySubmissions error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = { submitStudentData, getMySubmissions };
