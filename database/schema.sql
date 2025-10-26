-- Drop existing tables if they exist
DROP TABLE IF EXISTS quiz_attempts;
DROP TABLE IF EXISTS quiz_questions;
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS student_courses;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- Students Table
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructor VARCHAR(100),
    duration_hours INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modules Table
CREATE TABLE modules (
    module_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    order_num INT,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Student-Course Enrollment (Many-to-Many)
CREATE TABLE student_courses (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id)
);

-- Quiz Questions Table
CREATE TABLE quiz_questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255),
    option_b VARCHAR(255),
    option_c VARCHAR(255),
    option_d VARCHAR(255),
    correct_answer CHAR(1) CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Quiz Attempts Table
CREATE TABLE quiz_attempts (
    attempt_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    score DECIMAL(5,2),
    total_questions INT,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Certificates Table
CREATE TABLE certificates (
    certificate_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    certificate_code VARCHAR(50) UNIQUE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_certificate (student_id, course_id)
);

-- Index for performance
CREATE INDEX idx_student_courses ON student_courses(student_id, course_id);
CREATE INDEX idx_quiz_attempts ON quiz_attempts(student_id, course_id);