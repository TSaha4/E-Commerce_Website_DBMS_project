// frontend/assets/js/courses.js

const student = checkAuth();

if (student) {
    loadCourses();
}

async function loadCourses() {
    try {
        const response = await fetch(`${API_URL}/courses`);
        const data = await response.json();
        
        if (data.success) {
            displayCourses(data.courses);
        } else {
            document.getElementById('coursesList').innerHTML = 
                '<p class="empty-state">Error loading courses. Please try again.</p>';
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        document.getElementById('coursesList').innerHTML = 
            '<p class="empty-state">Error loading courses. Please check your connection.</p>';
    }
}

async function displayCourses(courses) {
    const coursesList = document.getElementById('coursesList');
    
    if (courses.length === 0) {
        coursesList.innerHTML = '<p class="empty-state">No courses available at the moment.</p>';
        return;
    }
    
    // Get enrolled courses to show enrollment status
    let enrolledCourses = [];
    try {
        const enrolledResponse = await fetch(`${API_URL}/students/${student.student_id}/courses`);
        const enrolledData = await enrolledResponse.json();
        if (enrolledData.success) {
            enrolledCourses = enrolledData.courses;
        }
    } catch (error) {
        console.error('Error loading enrolled courses:', error);
    }
    
    coursesList.innerHTML = courses.map(course => {
        const enrolledCourse = enrolledCourses.find(ec => ec.course_id === course.course_id);
        const isEnrolled = !!enrolledCourse;
        
        return `
            <div class="course-card" onclick="viewCourseDetail(${course.course_id})">
                <h3>${course.title}</h3>
                <p class="course-meta">${course.instructor} • ${course.duration_hours} hours</p>
                <p>${course.description}</p>
                ${isEnrolled ? `
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${enrolledCourse.progress_percentage}%"></div>
                    </div>
                    <p class="course-meta">Progress: ${enrolledCourse.progress_percentage}%</p>
                    ${enrolledCourse.completed_at ? 
                        '<span class="badge badge-success">✓ Completed</span>' : 
                        enrolledCourse.progress_percentage > 50 ? 
                        '<span class="badge badge-warning">In Progress</span>' : 
                        '<span class="badge badge-info">Enrolled</span>'}
                ` : `
                    <button class="btn btn-primary" onclick="event.stopPropagation(); enrollInCourse(${course.course_id})">
                        Enroll Now
                    </button>
                `}
            </div>
        `;
    }).join('');
}

async function enrollInCourse(courseId) {
    try {
        const response = await fetch(`${API_URL}/courses/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_id: student.student_id,
                course_id: courseId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Reload courses to show updated enrollment status
            loadCourses();
            showMessage('message', 'Successfully enrolled in course!', 'success');
        } else {
            showMessage('message', data.error || 'Failed to enroll in course', 'error');
        }
    } catch (error) {
        showMessage('message', 'Network error. Please try again.', 'error');
    }
}

function viewCourseDetail(courseId) {
    window.location.href = `course-detail.html?id=${courseId}`;
}

// Initialize navigation on page load
initNav();
