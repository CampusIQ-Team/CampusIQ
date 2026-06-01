// Backend/services/riskEngine.js

function calculateRisk(submission) {
  const { subjects, attendance, assignmentsOnTime, missedAssessments } = submission;

  // Step 1: average mark across all subjects
  const avgMark = subjects.reduce((sum, s) => sum + s.mark, 0) / subjects.length;

  // Step 2: convert assignmentsOnTime string to number
  const assignMap = {
    'All of them (100%)': 100,
    'Most of them (75-99%)': 85,
    'About half (50-74%)': 60,
    'Less than half (below 50%)': 30,
    'None submitted': 0
  };
  const assignRate = assignMap[assignmentsOnTime] ?? 70;

  // Step 3: convert missedAssessments to risk number
  const missedMap = { 'No': 0, 'Yes - 1 to 2': 50, 'Yes - 3 or more': 100 };
  const missedRisk = missedMap[missedAssessments] ?? 0;

  // Step 4: weighted risk score (agreed formula from Sprint 2)
  const markRisk = 100 - avgMark;
  const attendRisk = 100 - attendance;
  const assignRisk = 100 - assignRate;

  const riskScore = Math.round(
    (markRisk * 0.40) +
    (attendRisk * 0.25) +
    (assignRisk * 0.20) +
    (missedRisk * 0.15)
  );

  // Step 5: classify
  let riskLevel;
  if (riskScore >= 60) riskLevel = 'high';
  else if (riskScore >= 35) riskLevel = 'medium';
  else riskLevel = 'low';

  return { riskScore, riskLevel, avgMark: Math.round(avgMark) };
}

function generateRecommendations(submission, riskLevel) {
  const recs = [];
  const avgMark = submission.subjects.reduce((s,x) => s+x.mark, 0) / submission.subjects.length;

  if (avgMark < 50)
    recs.push('Your average mark is below 50%. Book a consultation with your lecturer this week to identify which topics need the most attention.');
  if (submission.attendance < 75)
    recs.push('Your attendance is below 75%. Missing classes directly impacts your understanding and marks. Prioritise attending all remaining sessions.');
  if (submission.missedAssessments !== 'No')
    recs.push('You have missed assessments this term. Contact your lecturer to discuss make-up opportunities before the semester ends.');
  if (submission.currentSupport === 'No support yet' && riskLevel !== 'low')
    recs.push('You are not currently receiving academic support. Consider joining a peer study group or booking sessions with a tutor.');
  if (submission.studyHours === 'Less than 5 hours')
    recs.push('You are studying fewer than 5 hours per week. Aim for at least 2 hours of independent study per subject per week.');
  
  if (recs.length === 0)
    recs.push('You are on track. Keep up your current attendance and study habits to maintain your performance.');

  return recs;
}

module.exports = { calculateRisk, generateRecommendations };
