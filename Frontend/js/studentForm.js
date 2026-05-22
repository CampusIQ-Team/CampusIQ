document.getElementById('data-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const subjects = [...document.querySelectorAll('.subject-row')]
      .map(row => ({
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
  });