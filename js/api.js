// ============================================
// CampusIQ API Configuration
// ============================================

const API_BASE_URL = "http://localhost:5000/api";

function getAuthToken() {
    return localStorage.getItem("campusiq_token");
}

// ============================================
// Generic API Request Function
// ============================================

async function apiRequest(endpoint, method = "GET", data = null) {
    const headers = {
        "Content-Type": "application/json"
    };

    const token = getAuthToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = { method, headers };

    if (data !== null) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const contentType = response.headers.get("content-type") || "";
        const result = contentType.includes("application/json")
            ? await response.json()
            : { message: await response.text() };

        if (!response.ok) {
            throw new Error(result.message || `Request failed with status ${response.status}`);
        }

        return result;
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
}

// ============================================
// Authentication API Functions
// ============================================

function loginUser(email, password) {
    return apiRequest("/auth/login", "POST", { email, password });
}

function registerUser(firstName, lastName, email, password) {
    return apiRequest("/auth/register", "POST", {
        firstName,
        lastName,
        email,
        password
    });
}
