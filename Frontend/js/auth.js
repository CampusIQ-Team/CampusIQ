// ============================================
// CampusIQ Authentication Logic
// ============================================

function saveSession(response) {
    if (response.token) {
        localStorage.setItem("campusiq_token", response.token);
    }

    if (response.user) {
        localStorage.setItem("campusiq_user", JSON.stringify(response.user));
    }
}

function isLoggedIn() {
    return Boolean(localStorage.getItem("campusiq_token"));
}

function logoutUser() {
    localStorage.removeItem("campusiq_token");
    localStorage.removeItem("campusiq_user");
    window.location.href = "LoginRegister.html";
}

function showMessage(message) {
    alert(message);
}

// ============================================
// Login Form
// ============================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {
            showMessage("Please enter your email and password.");
            return;
        }

        try {
            const response = await loginUser(email, password);
            saveSession(response);
            showMessage("Login successful!");

            const role = response.user?.role?.toLowerCase();
            window.location.href = role === "admin" ? "AdminDashboard.html" : "StudentDashboard.html";
        } catch (error) {
            showMessage(error.message || "Login failed. Please try again.");
        }
    });
}

// ============================================
// Register Form
// ============================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!firstName || !lastName || !email || !password) {
            showMessage("Please complete all registration fields.");
            return;
        }

        if (password.length < 6) {
            showMessage("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await registerUser(firstName, lastName, email, password);
            showMessage(response.message || "Registration successful! You can now log in.");
            document.querySelector(".container")?.classList.remove("active");
            registerForm.reset();
        } catch (error) {
            showMessage(error.message || "Registration failed. Please try again.");
        }
    });
}

// ============================================
// Logout Button
// ============================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        logoutUser();
    });
}
