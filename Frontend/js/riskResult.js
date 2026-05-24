async function loadResult() {
    if (!localStorage.getItem('campusiq_token')) {
      return window.location.href = '/login';
    }
  
    const submissions = await getMySubmissions();
  
    if (!submissions.length) {
      return window.location.href = '/student-form';
    }
  
    paintResult(submissions[0]);
  }
  
  document.addEventListener('DOMContentLoaded', loadResult);