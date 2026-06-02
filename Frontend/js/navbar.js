document.addEventListener("DOMContentLoaded", () => {

    const navLinks = document.getElementById("navLinks");
    const profileCircle = document.getElementById("profileCircle");

    const user = JSON.parse(
        localStorage.getItem("campusiq_user")
    );

    // Not logged in
    if (!user) {

        navLinks.innerHTML += `
            <a href="/about">About</a>
            <a href="/login">Login</a>
        `;

        return;
    }

    // Profile initials
    if (user.name) {
        const initials = user.name
            .split(" ")
            .map(word => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

        profileCircle.textContent = initials;
    }

    // STUDENT
    if (user.role.toLowerCase() === "student") {

        navLinks.innerHTML += `
            <a href="/student-dashboard">Dashboard</a>
            <a href="/student-form">Submit Data</a>
            <a href="/risk-result">Risk Result</a>
            <a href="#" id="logoutBtn">Logout</a>
        `;
    }

    // ADMIN
    if (user.role.toLowerCase() === "admin") {

        navLinks.innerHTML += `
            <a href="/admin-dashboard">Dashboard</a>
            <a href="/management">Students</a>
            <a href="/student-form">Data Input</a>
            <a href="/risk-result">Risk Reports</a>
            <a href="#" id="logoutBtn">Logout</a>
        `;
    }

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", (e) => {

            e.preventDefault();

            localStorage.removeItem("campusiq_token");
            localStorage.removeItem("campusiq_user");

            window.location.href = "/login";

        });

    }

});