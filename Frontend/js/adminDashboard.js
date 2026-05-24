async function loadDashboard() {
    if (!localStorage.getItem('campusiq_token')) {
      return window.location.href = '/login';
    }
  
    allSubmissions = await getAllSubmissions();
  
    renderMetrics(allSubmissions);
    renderTable(allSubmissions);
  }
  
  document.addEventListener('DOMContentLoaded', loadDashboard);