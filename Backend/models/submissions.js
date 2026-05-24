const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  mark: {
    type: Number,
    required: [true, 'Mark is required'],
    min: [0, 'Mark cannot be less than 0'],
    max: [100, 'Mark cannot exceed 100']
  },
  attendance: {
    type: Number,
    required: [true, 'Attendance is required'],
    min: [0, 'Attendance cannot be less than 0'],
    max: [100, 'Attendance cannot exceed 100']
  }
});

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
      index: true                         // faster admin queries
    },
    subjects: {
      type: [subjectSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one subject is required'
      }
    },
    riskScore: {
      type: Number,
      default: null,
      min: [0, 'Risk score cannot be negative'],
      max: [100, 'Risk score cannot exceed 100']
    },
    riskLevel: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid risk level'
      },
      default: null
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true                      // adds createdAt + updatedAt automatically
  }
);

// Prevent a student from submitting more than once
submissionSchema.index({ student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);