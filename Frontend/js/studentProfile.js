function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }
  
  async function loadStudentProfile() {
    const id = getQueryParam('id');
  
    if (!id) {
      alert('No student submission ID provided.');
      window.location.href = '/management';
      return;
    }
  
    try {
      const data = await getSubmissionById(id);
      const submission = data.submission;
      const student = submission.student || {};
  
      document.getElementById('student-name').textContent = student.name || 'Unknown Student';
      document.getElementById('student-email').textContent = student.email || '--';
      document.getElementById('risk-score').textContent = submission.riskScore ?? '--';
      document.getElementById('risk-level').textContent = submission.riskLevel || 'Pending';
      document.getElementById('avg-mark').textContent = submission.avgMark ?? '--';
      document.getElementById('attendance').textContent = submission.attendance ?? '--';
  
      document.getElementById('student-profile-meta').textContent =
        `Submitted on ${new Date(submission.submittedAt).toLocaleDateString('en-ZA')}`;
  
      const subjectsList = document.getElementById('subjects-list');
      subjectsList.innerHTML = '';
  
      submission.subjects.forEach(subject => {
        const li = document.createElement('li');
        li.textContent = `${subject.name} - ${subject.mark}% (${subject.type})`;
        subjectsList.appendChild(li);
      });
  
      const recList = document.getElementById('recommendations-list');
      recList.innerHTML = '';
  
      submission.recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recList.appendChild(li);
      });
  
    } catch (error) {
      alert(error.message);
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadStudentProfile);