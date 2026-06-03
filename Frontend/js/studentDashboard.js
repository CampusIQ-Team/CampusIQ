document.addEventListener("DOMContentLoaded", loadStudentDashboard);

async function loadStudentDashboard() {
    const token = localStorage.getItem("campusiq_token");
    const user = JSON.parse(localStorage.getItem("campusiq_user"));

    if (!token) {
        window.location.href = "/login";
        return;
    }

    if (user && user.name) {
        document.getElementById("studentName").textContent = `Welcome, ${user.name}`;
    }

    try {
        const response = await fetch("/api/submissions/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load dashboard");
        }

        if (!data.submissions || data.submissions.length === 0) {
            showEmptyDashboard();
            return;
        }

        const latestSubmission = data.submissions[0];
        renderDashboard(latestSubmission);

    } catch (error) {
        console.error(error);
        document.getElementById("coursesTable").innerHTML = `
            <tr>
                <td colspan="4">Could not load student data.</td>
            </tr>
        `;
    }
}

function renderDashboard(submission) {
    const subjects = submission.subjects || [];

    const totalCourses = subjects.length;

    const averageMark = totalCourses
        ? Math.round(subjects.reduce((sum, subject) => sum + subject.mark, 0) / totalCourses)
        : 0;

    const averageAttendance = totalCourses
        ? Math.round(subjects.reduce((sum, subject) => sum + subject.attendance, 0) / totalCourses)
        : 0;

    const riskLevel = calculateRiskLevel(averageMark, averageAttendance);

    document.getElementById("averageMark").textContent = `${averageMark}%`;
    document.getElementById("averageAttendance").textContent = `${averageAttendance}%`;
    document.getElementById("riskLevel").textContent = riskLevel;
    document.getElementById("totalCourses").textContent = totalCourses;

    renderCoursesTable(subjects);
    renderProgressBars(subjects);
    renderRiskSection(riskLevel, averageMark, averageAttendance);
}

function renderCoursesTable(subjects) {
    const tableBody = document.getElementById("coursesTable");

    tableBody.innerHTML = subjects.map(subject => {
        const status = getSubjectStatus(subject.mark, subject.attendance);

        return `
            <tr>
                <td><strong>${subject.name}</strong></td>
                <td>${subject.mark}%</td>
                <td>${subject.attendance}%</td>
                <td><span class="status ${status.className}">${status.text}</span></td>
            </tr>
        `;
    }).join("");
}

function renderProgressBars(subjects) {
    const progressContainer = document.getElementById("courseProgress");

    progressContainer.innerHTML = subjects.map(subject => {
        const progressClass = subject.mark >= 70
            ? "good"
            : subject.mark >= 50
            ? "warning"
            : "danger";

        return `
            <div class="progress-item">
                <div class="progress-label">
                    <span>${subject.name}</span>
                    <span>${subject.mark}%</span>
                </div>

                <div class="progress-bar">
                    <div class="progress-fill ${progressClass}" style="width: ${subject.mark}%;"></div>
                </div>
            </div>
        `;
    }).join("");
}

function renderRiskSection(riskLevel, averageMark, averageAttendance) {
    const riskCard = document.getElementById("riskCard");
    const riskTitle = document.getElementById("riskTitle");
    const riskMessage = document.getElementById("riskMessage");
    const recommendations = document.getElementById("recommendations");

    riskTitle.textContent = `${riskLevel} Risk`;

    riskCard.className = "risk-card";

    if (riskLevel === "High") {
        riskCard.classList.add("high");
        riskMessage.textContent = "You are at high academic risk because your marks or attendance are below the required level.";
    } else if (riskLevel === "Medium") {
        riskCard.classList.add("medium");
        riskMessage.textContent = "You are at medium risk. Improve your marks and attendance to reduce your risk level.";
    } else {
        riskCard.classList.add("low");
        riskMessage.textContent = "You are currently performing well. Keep maintaining your marks and attendance.";
    }

    const list = [];

    if (averageMark < 60) {
        list.push("Improve your average mark by revising weak subjects.");
    }

    if (averageAttendance < 85) {
        list.push("Increase your attendance to stay above the safe level.");
    }

    if (averageMark >= 60 && averageAttendance >= 85) {
        list.push("Continue maintaining consistent performance.");
    }

    recommendations.innerHTML = list.map(item => `<li>${item}</li>`).join("");
}

function calculateRiskLevel(averageMark, averageAttendance) {
    if (averageMark < 50 || averageAttendance < 70) {
        return "High";
    }

    if (averageMark < 65 || averageAttendance < 85) {
        return "Medium";
    }

    return "Low";
}

function getSubjectStatus(mark, attendance) {
    if (mark < 50 || attendance < 70) {
        return {
            text: "At Risk",
            className: "risk"
        };
    }

    if (mark < 65 || attendance < 85) {
        return {
            text: "Needs Improvement",
            className: "warning"
        };
    }

    return {
        text: "Good",
        className: "passed"
    };
}

function showEmptyDashboard() {
    document.getElementById("coursesTable").innerHTML = `
        <tr>
            <td colspan="4">No student data submitted yet.</td>
        </tr>
    `;

    document.getElementById("courseProgress").innerHTML = `
        <p>No courses available yet.</p>
    `;
}