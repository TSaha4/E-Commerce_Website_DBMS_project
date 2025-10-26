// frontend/assets/js/dashboard.js

const student = checkAuth();

if (student) {
    document.getElementById('studentName').textContent = student.full_name;
    loadDashboardData();
}

async function loadDashboardData() {
    try {
        // Load stats
        const statsResponse = await fetch(`${API_URL}/students/${student.student_id}/stats`);
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
            document.getElementById('enrolledCount').textContent = statsData.stats.enrolled;
            document.getElementById('completedCount').textContent = statsData.stats.completed;
            document.getElementById('avgScore').textContent = statsData.stats.avgScore + '%';
            document.getElementById('certificatesCount').textContent = statsData.stats.certificates;
        }
        
        // Load enrolled courses
        const coursesResponse = await fetch(`${API_URL}/students/${student.student_id}/courses`);
        const coursesData = await coursesResponse.json();
        
        if (coursesData.success) {
            displayCourses(coursesData.courses);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function displayCourses(courses) {
    const coursesList = document.getElementById('coursesList');
    
    if (courses.length === 0) {
        coursesList.innerHTML = '<p class="empty-state">No courses enrolled yet. Visit the courses page to enroll!</p>';
        return;
    }
    
    coursesList.innerHTML = courses.map(course => `
        <div class="course-card" onclick="window.location.href='course-detail.html?id=${course.course_id}'">
            <h3>${course.title}</h3>
            <p class="course-meta">${course.instructor} • ${course.duration_hours} hours</p>
            <p>${course.description}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${course.progress_percentage}%"></div>
            </div>
            <p class="course-meta">Progress: ${course.progress_percentage}%</p>
            ${course.completed_at ? '<span class="badge badge-success">✓ Completed</span>' : 
              course.progress_percentage > 50 ? '<span class="badge badge-warning">In Progress</span>' : 
              '<span class="badge badge-info">Started</span>'}
        </div>
    `).join('');
}

// Initialize navigation on page load
initNav();