function paintResult(submission) {
  const scoreEl    = document.getElementById('risk-score');
  const levelEl    = document.getElementById('risk-level');
  const titleEl    = document.getElementById('result-title');
  const metaEl     = document.getElementById('student-meta');

  const score    = submission.riskScore ?? '--';
  const level    = submission.riskLevel  ?? 'Pending';
  const dateStr  = new Date(submission.submittedAt).toLocaleDateString('en-ZA', {day: 'numeric', month: 'long', year: 'numeric'
  });

  if (scoreEl) scoreEl.textContent = score;

  if (levelEl) {
    levelEl.textContent = level;
    levelEl.className = 'risk-pill'; // reset classes
    if (level === 'High')   levelEl.classList.add('high');
    if (level === 'Medium') levelEl.classList.add('medium');
    if (level === 'Low')    levelEl.classList.add('low');
  }

  const titleMap = {
    High:   'You are at high risk',
    Medium: 'You are at moderate risk',
    Low:    'You are in good standing',
    Pending:'Your result is being processed'
  };
  if (titleEl) titleEl.textContent = titleMap[level] ?? 'Result available';
  if (metaEl)  metaEl.textContent  = `Submitted on ${dateStr}`;
}

async function loadResult() {
  if (!localStorage.getItem('campusiq_token')) {
    return window.location.href = '/login';
  }

  try {
    const data = await getMySubmissions();
    const submissions = data.submissions ?? [];

    if (submissions.length === 0) {
      return window.location.href = '/student-form';
    }

    paintResult(submissions[0]);
  } catch (err) {
    console.error('loadResult error:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadResult);