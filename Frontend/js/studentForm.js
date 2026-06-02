const subjectsContainer = document.getElementById('subjects-container');
const addSubjectBtn = document.getElementById('add-subject-btn');
const dataForm = document.getElementById('data-form');

addSubjectBtn.addEventListener('click', () => {
  const row = document.createElement('div');
  row.className = 'subject-row';

  row.innerHTML = `
    <input class="subject-name" type="text" placeholder="Subject name" required>
    <input class="subject-mark" type="number" min="0" max="100" placeholder="Mark %" required>
    <select class="subject-type">
      <option>Test</option>
      <option>Exam</option>
      <option>Assignment</option>
      <option>Project</option>
    </select>
    <button type="button" class="view-btn remove-subject">Remove</button>
  `;

  subjectsContainer.appendChild(row);
});

subjectsContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-subject')) {
    event.target.closest('.subject-row').remove();
  }
});

dataForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const subjects = [...document.querySelectorAll('.subject-row')].map(row => ({
      name: row.querySelector('.subject-name').value.trim(),
      mark: Number(row.querySelector('.subject-mark').value),
      type: row.querySelector('.subject-type').value
    }));

    const formData = {
      subjects,
      attendance: Number(document.getElementById('attendance').value),
      absenceDays: Number(document.getElementById('absence-days').value || 0),
      absenceReason: document.getElementById('absence-reason').value,
      assignmentsOnTime: document.getElementById('assignments-on-time').value,
      missedAssessments: document.getElementById('missed-assess').value,
      studyHours: document.getElementById('study-hours').value,
      studyFeeling: document.getElementById('study-feeling').value,
      currentSupport: document.getElementById('current-support').value,
      notes: document.getElementById('notes').value.trim()
    };

    await submitStudentData(formData);

    window.location.href = '/risk-result';

  } catch (error) {
    alert(error.message);
  }
});