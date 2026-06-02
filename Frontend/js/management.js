let allSubmissions = [];
let visibleSubmissions = [];

const riskWeight = { High: 3, Medium: 2, Low: 1 };

function getAverageMark(subjects = []) {
  if (!subjects.length) return '--';

  const total = subjects.reduce((sum, subject) => {
    return sum + Number(subject.mark || 0);
  }, 0);

  return Math.round(total / subjects.length);
}

function getRiskCounts(submissions) {
  return {
    total: submissions.length,
    high: submissions.filter(s => s.riskLevel === 'High').length,
    medium: submissions.filter(s => s.riskLevel === 'Medium').length,
    low: submissions.filter(s => s.riskLevel === 'Low').length
  };
}

function updateStats(submissions) {
  const counts = getRiskCounts(submissions);

  document.getElementById('stat-total').textContent = counts.total;
  document.getElementById('stat-high').textContent = counts.high;
  document.getElementById('stat-medium').textContent = counts.medium;
  document.getElementById('stat-low').textContent = counts.low;

  document.getElementById('management-summary').textContent =
    `${counts.total} students · ${counts.high} high risk · ${counts.medium} medium risk · ${counts.low} low risk`;
}

function renderTable(submissions) {
  const tbody = document.getElementById('students-body');

  document.getElementById('table-count').textContent =
    `Showing ${submissions.length} student(s)`;

  if (!submissions.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">No students match your search/filter.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = submissions.map(submission => {
    const student = submission.student || {};
    const averageMark = getAverageMark(submission.subjects);
    const riskClass = (submission.riskLevel || 'Pending').toLowerCase();

    return `
      <tr>
        <td>
          <strong>${student.name || 'Unknown Student'}</strong>
          <span>${student.email || 'No email'}</span>
        </td>

        <td>${student._id || 'N/A'}</td>
        <td>${submission.attendance ?? '--'}%</td>
        <td>${averageMark}%</td>

        <td>
          <span class="risk ${riskClass}">
            ${submission.riskLevel || 'Pending'}
          </span>
        </td>

        <td class="action-buttons">
          <a class="view-btn" href="/student-profile?id=${submission._id}">View</a>
          <button class="edit-btn" type="button" onclick="openEditModal('${submission._id}')">Edit</button>
          <button class="delete-btn" type="button" onclick="deleteStudent('${submission._id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function sortSubmissions(submissions) {
  const sortValue = document.getElementById('sort-select').value;
  const sorted = [...submissions];

  if (sortValue === 'name') {
    sorted.sort((a, b) =>
      (a.student?.name || '').localeCompare(b.student?.name || '')
    );
  }

  if (sortValue === 'risk') {
    sorted.sort((a, b) =>
      (riskWeight[b.riskLevel] || 0) - (riskWeight[a.riskLevel] || 0)
    );
  }

  if (sortValue === 'mark-low') {
    sorted.sort((a, b) =>
      getAverageMark(a.subjects) - getAverageMark(b.subjects)
    );
  }

  if (sortValue === 'newest') {
    sorted.sort((a, b) =>
      new Date(b.submittedAt || b.createdAt) -
      new Date(a.submittedAt || a.createdAt)
    );
  }

  return sorted;
}

function applyFilters() {
  const searchValue = document.getElementById('student-search').value.toLowerCase();
  const activeRisk = document.querySelector('.filter-buttons button.active').dataset.risk;

  visibleSubmissions = allSubmissions.filter(submission => {
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

  renderTable(sortSubmissions(visibleSubmissions));
}

function createSubjectRow(subject = {}) {
  const row = document.createElement('div');
  row.className = 'modal-subject-row';

  row.innerHTML = `
    <input class="modal-subject-name" type="text" placeholder="Subject name" value="${subject.name || ''}" required>
    <input class="modal-subject-mark" type="number" min="0" max="100" placeholder="Mark %" value="${subject.mark ?? ''}" required>
    <input class="modal-subject-attendance" type="number" min="0" max="100" placeholder="Attendance %" value="${subject.attendance ?? ''}" required>
    <button class="remove-subject-btn" type="button">Remove</button>
  `;

  document.getElementById('modal-subjects').appendChild(row);
}

function getFormData() {
  const subjects = [...document.querySelectorAll('.modal-subject-row')].map(row => ({
    name: row.querySelector('.modal-subject-name').value.trim(),
    mark: Number(row.querySelector('.modal-subject-mark').value),
    attendance: Number(row.querySelector('.modal-subject-attendance').value)
  }));

  return {
    name: document.getElementById('student-name').value.trim(),
    email: document.getElementById('student-email').value.trim(),
    password: document.getElementById('student-password').value,
    subjects,
    attendance: Number(document.getElementById('student-attendance').value),
    assignmentsOnTime: document.getElementById('assignments-on-time').value,
    missedAssessments: document.getElementById('missed-assessments').value,
    studyHours: document.getElementById('study-hours').value,
    currentSupport: document.getElementById('current-support').value,
    notes: document.getElementById('student-notes').value.trim()
  };
}

function openModal(mode = 'add') {
  document.getElementById('student-modal').classList.remove('hidden');
  document.getElementById('management-form').reset();
  document.getElementById('modal-subjects').innerHTML = '';
  document.getElementById('edit-id').value = '';

  if (mode === 'add') {
    document.getElementById('modal-title').textContent = 'Add Student';
    document.getElementById('modal-subtitle').textContent =
      'Create a student account and risk record.';
    document.getElementById('password-group').style.display = 'block';
    document.getElementById('student-password').required = true;

    createSubjectRow();
  }
}

function closeModal() {
  document.getElementById('student-modal').classList.add('hidden');
}

function openEditModal(id) {
  const submission = allSubmissions.find(item => item._id === id);

  if (!submission) return;

  openModal('edit');

  document.getElementById('modal-title').textContent = 'Edit Student';
  document.getElementById('modal-subtitle').textContent =
    'Update student details and recalculate risk.';

  document.getElementById('password-group').style.display = 'none';
  document.getElementById('student-password').required = false;
  document.getElementById('edit-id').value = submission._id;

  document.getElementById('student-name').value = submission.student?.name || '';
  document.getElementById('student-email').value = submission.student?.email || '';
  document.getElementById('student-attendance').value = submission.attendance ?? '';
  document.getElementById('assignments-on-time').value =
    submission.assignmentsOnTime || 'Most of them (75-99%)';
  document.getElementById('missed-assessments').value =
    submission.missedAssessments || 'No';
  document.getElementById('study-hours').value =
    submission.studyHours || '5 - 10 hours';
  document.getElementById('current-support').value =
    submission.currentSupport || 'No support yet';
  document.getElementById('student-notes').value = submission.notes || '';

  document.getElementById('modal-subjects').innerHTML = '';

  if (submission.subjects && submission.subjects.length > 0) {
    submission.subjects.forEach(subject => createSubjectRow(subject));
  } else {
    createSubjectRow();
  }
}

async function deleteStudent(id) {
  const confirmed = confirm('Are you sure you want to delete this student and their risk record?');

  if (!confirmed) return;

  try {
    await deleteStudentByAdmin(id);
    await loadManagementStudents();
    alert('Student deleted successfully');
  } catch (error) {
    alert(error.message);
  }
}

async function loadManagementStudents() {
  if (!localStorage.getItem('campusiq_token')) {
    window.location.href = '/login';
    return;
  }

  try {
    const data = await getAllSubmissions();

    allSubmissions = data.submissions || [];

    updateStats(allSubmissions);
    applyFilters();
  } catch (error) {
    document.getElementById('management-summary').textContent =
      'Could not load student records.';

    alert(error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadManagementStudents();

  document.getElementById('open-add-modal').addEventListener('click', () => {
    openModal('add');
  });

  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.getElementById('cancel-modal').addEventListener('click', closeModal);

  document.getElementById('student-search').addEventListener('input', applyFilters);
  document.getElementById('sort-select').addEventListener('change', applyFilters);

  document.querySelectorAll('.filter-buttons button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-buttons button').forEach(btn => {
        btn.classList.remove('active');
      });

      button.classList.add('active');
      applyFilters();
    });
  });

  document.getElementById('add-modal-subject').addEventListener('click', () => {
    createSubjectRow();
  });

  document.getElementById('modal-subjects').addEventListener('click', event => {
    if (event.target.classList.contains('remove-subject-btn')) {
      const rows = document.querySelectorAll('.modal-subject-row');

      if (rows.length > 1) {
        event.target.closest('.modal-subject-row').remove();
      }
    }
  });

  document.getElementById('management-form').addEventListener('submit', async event => {
    event.preventDefault();

    const id = document.getElementById('edit-id').value;
    const formData = getFormData();

    try {
      if (id) {
        delete formData.password;
        await updateStudentByAdmin(id, formData);
        alert('Student updated successfully');
      } else {
        await createStudentByAdmin(formData);
        alert('Student added successfully');
      }

      closeModal();
      await loadManagementStudents();
    } catch (error) {
      alert(error.message);
    }
  });
});