// frontend/assets/js/main.js

const API_URL = 'http://localhost:3000/api';

// Check authentication
function checkAuth() {
    const student = localStorage.getItem('student');
    if (!student && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        window.location.href = 'login.html';
    }
    return student ? JSON.parse(student) : null;
}

// Get current student
function getStudent() {
    const student = localStorage.getItem('student');
    return student ? JSON.parse(student) : null;
}

// Logout
function logout() {
    localStorage.removeItem('student');
    window.location.href = 'login.html';
}

// Initialize navigation
function initNav() {
    const student = checkAuth();
    if (student) {
        document.getElementById('navUser').textContent = student.username;
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Show message
function showMessage(elementId, message, type = 'info') {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${type}`;
    setTimeout(() => {
        element.textContent = '';
        element.className = 'message';
    }, 5000);
}