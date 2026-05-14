// ============================================
// CampusIQ Admin Dashboard
// ============================================

const students = [
    {
        name: "John Doe",
        course: "Computer Science",
        performance: 78,
        riskLevel: "Low",
        status: "Active"
    },
    {
        name: "Sarah Smith",
        course: "Data Science",
        performance: 45,
        riskLevel: "High",
        status: "At Risk"
    },
    {
        name: "Michael Brown",
        course: "Information Systems",
        performance: 62,
        riskLevel: "Moderate",
        status: "Monitor"
    }
];

function getStatusClass(status) {
    const classes = {
        "Active": "active",
        "At Risk": "risk",
        "Monitor": "warning"
    };

    return classes[status] || "warning";
}

function renderStudentTable(studentList) {
    const tableBody = document.getElementById("studentTable");
    if (!tableBody) return;

    tableBody.innerHTML = studentList.map((student) => `
        <tr>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.performance}%</td>
            <td>${student.riskLevel}</td>
            <td><span class="status ${getStatusClass(student.status)}">${student.status}</span></td>
        </tr>
    `).join("");
}

function initialiseSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const value = searchInput.value.toLowerCase().trim();
        const filteredStudents = students.filter((student) => {
            return `${student.name} ${student.course} ${student.riskLevel} ${student.status}`
                .toLowerCase()
                .includes(value);
        });

        renderStudentTable(filteredStudents);
    });
}

function initialisePerformanceChart() {
    const canvas = document.getElementById("performanceChart");
    if (!canvas || typeof Chart === "undefined") return;

    new Chart(canvas, {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{
                label: "Performance %",
                data: [65, 72, 68, 80, 78, 91],
                borderColor: "#2E75B6",
                backgroundColor: "rgba(46,117,182,0.2)",
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: "#2C2C2A" }
                }
            },
            scales: {
                x: { ticks: { color: "#2C2C2A" } },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: "#2C2C2A" }
                }
            }
        }
    });
}

renderStudentTable(students);
initialiseSearch();
initialisePerformanceChart();
