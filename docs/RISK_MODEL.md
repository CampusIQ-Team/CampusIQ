CampusIQ Risk Scoring Formula
* Goal: Calculate a weighted academic risk score from 0 to 100, where a higher score equals a higher risk of failing.
* Data Normalization: All inputs are converted to a 0-100 scale. Marks and attendance are inverted (e.g., a low mark results in a high risk).  

Weighting Distribution:  
40% - Average Subject Marks
25% - Attendance Percentage
20% - Assignment Submission Rate
15% - Missed Assessments

Classification Thresholds:  
High Risk: Score >= 60
Medium Risk: Score 35 to 59
Low Risk: Score < 35
