let allSubmissions = [];

function getRiskCounts(submissions) {
  return {
    total: submissions.length,
    high: submissions.filter(s => s.riskLevel === 'High').length,
    medium: submissions.filter(s => s.riskLevel === 'Medium').length,
    low: submissions.filter(s => s.riskLevel === 'Low').length
  };
}

function renderMetrics(submissions) {
  const counts = getRiskCounts(submissions);
  const heroText = document.querySelector('.management-hero p');

  if (heroText) {
    heroText.textContent =
      `${counts.total} students · ${counts.high} high risk · ${counts.medium} medium risk · ${counts.low} low risk`;
  }
}

function renderTable(submissions) {
  const tbody = document.getElementById('students-body');

  if (!tbody) return;

  tbody.innerHTML = '';

  if (submissions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">No student submissions found.</td>
      </tr>
    `;
    return;
  }

  submissions.forEach(submission => {
    const student = submission.student || {};
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>
        ${student.name || 'Unknown Student'}
        <span>${student.email || 'No email'}</span>
      </td>
      <td>${student._id || submission.student || 'N/A'}</td>
      <td>${submission.attendance ?? '--'}%</td>
      <td>${submission.avgMark ?? '--'}%</td>
      <td>
        <span class="risk ${(submission.riskLevel || '').toLowerCase()}">
          ${submission.riskLevel || 'Pending'}
        </span>
      </td>
      <td>
        <a class="view-btn" href="/student-profile?id=${submission._id}">View</a>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function applyFilters() {
  const searchValue = document.getElementById('student-search').value.toLowerCase();
  const activeRisk = document.querySelector('.filter-buttons button.active').dataset.risk;

  let filtered = allSubmissions.filter(submission => {
    const student = submission.student || {};

    const matchesSearch =
      (student.name || '').toLowerCase().includes(searchValue) ||
      (student.email || '').toLowerCase().includes(searchValue) ||
      (student._id || '').toLowerCase().includes(searchValue);

    const matchesRisk =
      activeRisk === 'all' ||
      (submission.riskLevel || '').toLowerCase() === activeRisk;

    return matchesSearch && matchesRisk;
  });

  renderTable(filtered);
}

async function loadDashboard() {
  if (!localStorage.getItem('campusiq_token')) {
    window.location.href = '/login';
    return;
  }

  try {
    const data = await getAllSubmissions();
    allSubmissions = data.submissions || [];

    renderMetrics(allSubmissions);
    renderTable(allSubmissions);

  } catch (error) {
    alert(error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();

  const searchInput = document.getElementById('student-search');

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  document.querySelectorAll('.filter-buttons button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-buttons button').forEach(btn => {
        btn.classList.remove('active');
      });

      button.classList.add('active');
      applyFilters();
    });
  });
});