let dashboardSubmissions = [];

function calculateAverageMark(subjects = []) {
  if (!subjects.length) return "--";

  const total = subjects.reduce((sum, subject) => {
    return sum + Number(subject.mark || 0);
  }, 0);

  return Math.round(total / subjects.length);
}

function getRiskCounts(submissions) {
  return {
    total: submissions.length,
    high: submissions.filter(s => s.riskLevel === "High").length,
    medium: submissions.filter(s => s.riskLevel === "Medium").length,
    low: submissions.filter(s => s.riskLevel === "Low").length
  };
}

function updateStats(submissions) {
  const counts = getRiskCounts(submissions);

  document.getElementById("totalStudents").textContent = counts.total;
  document.getElementById("highRisk").textContent = counts.high;
  document.getElementById("mediumRisk").textContent = counts.medium;
  document.getElementById("lowRisk").textContent = counts.low;

  document.getElementById("dashboard-summary").textContent =
    `${counts.total} students monitored · ${counts.high} high risk · ${counts.medium} medium risk · ${counts.low} low risk`;

  const total = counts.total || 1;

  document.getElementById("highBar").style.width = `${(counts.high / total) * 100}%`;
  document.getElementById("mediumBar").style.width = `${(counts.medium / total) * 100}%`;
  document.getElementById("lowBar").style.width = `${(counts.low / total) * 100}%`;
}

function renderRecentAlerts(submissions) {
  const tbody = document.getElementById("recent-alerts-body");

  const alerts = submissions
    .filter(submission => submission.riskLevel === "High" || submission.riskLevel === "Medium")
    .slice(0, 5);

  if (!alerts.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">No recent risk alerts found.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = alerts.map(submission => {
    const student = submission.student || {};
    const averageMark = calculateAverageMark(submission.subjects);

    return `
      <tr>
        <td><strong>${student.name || "Unknown Student"}</strong></td>
        <td>${student.email || "No email"}</td>
        <td>${submission.attendance ?? "--"}%</td>
        <td>${averageMark}%</td>
        <td>
          <span class="risk ${(submission.riskLevel || "").toLowerCase()}">
            ${submission.riskLevel || "Pending"}
          </span>
        </td>
        <td>
          <a class="view-btn" href="/student-profile?id=${submission._id}">
            View
          </a>
        </td>
      </tr>
    `;
  }).join("");
}

async function loadAdminDashboard() {
  const token = localStorage.getItem("campusiq_token");

  if (!token) {
    window.location.href = "/login";
    return;
  }

  try {
    const data = await getAllSubmissions();

    dashboardSubmissions = data.submissions || [];

    updateStats(dashboardSubmissions);
    renderRecentAlerts(dashboardSubmissions);

  } catch (error) {
    console.error(error);
    document.getElementById("dashboard-summary").textContent =
      "Could not load dashboard data.";
  }
}

document.addEventListener("DOMContentLoaded", loadAdminDashboard);