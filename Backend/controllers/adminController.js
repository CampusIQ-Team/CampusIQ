const Submission = require('../models/submissions');
const { calculateRisk } = require('../services/riskEngine');

const VALID_RISK_LEVELS = ['Low', 'Medium', 'High'];

// @desc    Get all student submissions (with optional risk filter + pagination)
// @route   GET /api/admin/students?riskLevel=High&page=1&limit=20
// @access  Private (admin only)
const getAllStudents = async (req, res) => {
  try {
    const { riskLevel, page = 1, limit = 20 } = req.query;

    if (riskLevel && !VALID_RISK_LEVELS.includes(riskLevel)) {
      return res.status(400).json({
        message: `Invalid riskLevel. Must be one of: ${VALID_RISK_LEVELS.join(', ')}`
      });
    }

    const filter = riskLevel ? { riskLevel } : {};

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
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

    if (!submission.student) {
      return res.status(404).json({ message: 'Student account no longer exists' });
    }

    res.status(200).json({ submission });

  } catch (error) {
    console.error('getStudentById error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Update a student submission and recalculate risk
// @route   PUT /api/admin/students/:id
// @access  Private (admin only)
const updateStudent = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const {
      subjects,
      attendance,
      assignmentsOnTime,
      missedAssessments,
      studyHours,
      studyFeeling,
      currentSupport,
      notes
    } = req.body;

    if (subjects) submission.subjects = subjects;
    if (attendance !== undefined) submission.attendance = attendance;
    if (assignmentsOnTime !== undefined) submission.assignmentsOnTime = assignmentsOnTime;
    if (missedAssessments !== undefined) submission.missedAssessments = missedAssessments;
    if (studyHours !== undefined) submission.studyHours = studyHours;
    if (studyFeeling !== undefined) submission.studyFeeling = studyFeeling;
    if (currentSupport !== undefined) submission.currentSupport = currentSupport;
    if (notes !== undefined) submission.notes = notes;

    // Recalculate risk after update
    const { riskScore, riskLevel } = calculateRisk(submission);
    submission.riskScore = riskScore;
    submission.riskLevel = riskLevel;

    await submission.save();

    res.status(200).json({ message: 'Student updated successfully', submission });

  } catch (error) {
    console.error('updateStudent error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Delete a student submission
// @route   DELETE /api/admin/students/:id
// @access  Private (admin only)
const deleteStudent = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    await submission.deleteOne();

    res.status(200).json({ message: 'Student record deleted successfully' });

  } catch (error) {
    console.error('deleteStudent error:', error);
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

    const exportData = [];

    for (const sub of submissions) {
      if (!sub.student) continue;

      for (const subject of sub.subjects) {
        exportData.push({
          studentName:          sub.student.name,
          studentEmail:         sub.student.email,
          riskScore:            sub.riskScore ?? 'Pending',
          riskLevel:            sub.riskLevel ?? 'Pending',
          subjectName:          subject.name,
          subjectMark:          subject.mark,
          subjectAttendance:    subject.attendance,
          overallAttendance:    sub.attendance ?? 'N/A',
          absenceDays:          sub.absenceDays ?? 0,
          absenceReason:        sub.absenceReason ?? 'N/A',
          assignmentsOnTime:    sub.assignmentsOnTime ?? 'N/A',
          missedAssessments:    sub.missedAssessments ?? 'N/A',
          studyHours:           sub.studyHours ?? 'N/A',
          studyFeeling:         sub.studyFeeling ?? 'N/A',
          currentSupport:       sub.currentSupport ?? 'N/A',
          notes:                sub.notes ?? 'N/A',
          submittedAt:          sub.submittedAt
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

module.exports = { getAllStudents, getStudentById, updateStudent, deleteStudent, exportForPowerBI };