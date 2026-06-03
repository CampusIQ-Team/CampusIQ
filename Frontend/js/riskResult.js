function paintResult(submission) {
  document.getElementById('risk-score').textContent = submission.riskScore ?? '--';
  document.getElementById('avg-mark').textContent = submission.avgMark ?? '--';
  document.getElementById('attendance-value').textContent = submission.attendance ?? '--';

  const levelEl = document.getElementById('risk-level');
  const level = submission.riskLevel || 'Pending';

  levelEl.textContent = level;
  levelEl.className = `risk ${level.toLowerCase()}`;

  const titleMap = {
    High: 'You are at high risk',
    Medium: 'You are at moderate risk',
    Low: 'You are in good standing',
    Pending: 'Your result is being processed'
  };

  document.getElementById('result-title').textContent = titleMap[level] || 'Result available';

  const dateStr = new Date(submission.submittedAt).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  document.getElementById('student-meta').textContent = `Submitted on ${dateStr}`;

  const list = document.getElementById('recommendations-list');
  list.innerHTML = '';

  const recommendations = submission.recommendations || [];

  recommendations.forEach(rec => {
    const li = document.createElement('li');
    li.textContent = rec;
    list.appendChild(li);
  });
}

async function loadResult() {
  if (!localStorage.getItem('campusiq_token')) {
    window.location.href = '/login';
    return;
  }

  try {
    const data = await getMySubmissions();
    const submissions = data.submissions || [];

    if (submissions.length === 0) {
      window.location.href = '/student-form';
      return;
    }

    paintResult(submissions[0]);

  } catch (error) {
    alert(error.message);
  }
}

document.addEventListener('DOMContentLoaded', loadResult);