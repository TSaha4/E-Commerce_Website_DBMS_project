// backend/server.js
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'elearning_db',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10
});

// Validate required environment variables
if (!process.env.DB_PASSWORD) {
    console.error('❌ Error: DB_PASSWORD environment variable is required');
    console.error('Please create a .env file with your database credentials');
    console.error('Copy config.example to backend/.env and update the values');
    process.exit(1);
}

// ============= AUTHENTICATION =============

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, full_name } = req.body;
        const password_hash = await bcrypt.hash(password, 10);
        
        const [result] = await pool.execute(
            'INSERT INTO students (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)',
            [username, email, password_hash, full_name]
        );
        
        res.json({ success: true, student_id: result.insertId });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const [students] = await pool.execute(
            'SELECT * FROM students WHERE username = ?',
            [username]
        );
        
        if (students.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        const student = students[0];
        const validPassword = await bcrypt.compare(password, student.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        res.json({ 
            success: true, 
            student: {
                student_id: student.student_id,
                username: student.username,
                email: student.email,
                full_name: student.full_name
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============= COURSES =============

// Get all courses
app.get('/api/courses', async (req, res) => {
    try {
        const [courses] = await pool.execute('SELECT * FROM courses ORDER BY created_at DESC');
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get course by ID with modules
app.get('/api/courses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [courses] = await pool.execute('SELECT * FROM courses WHERE course_id = ?', [id]);
        const [modules] = await pool.execute(
            'SELECT * FROM modules WHERE course_id = ? ORDER BY order_num',
            [id]
        );
        
        if (courses.length === 0) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }
        
        res.json({ success: true, course: courses[0], modules });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Enroll in course (using stored procedure)
app.post('/api/courses/enroll', async (req, res) => {
    try {
        const { student_id, course_id } = req.body;
        
        await pool.execute('CALL enroll_student(?, ?)', [student_id, course_id]);
        
        res.json({ success: true, message: 'Enrolled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get student's enrolled courses
app.get('/api/students/:id/courses', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [courses] = await pool.execute(`
            SELECT c.*, sc.progress_percentage, sc.completed_at, sc.enrolled_at
            FROM courses c
            INNER JOIN student_courses sc ON c.course_id = sc.course_id
            WHERE sc.student_id = ?
            ORDER BY sc.enrolled_at DESC
        `, [id]);
        
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get student progress (using stored procedure)
app.get('/api/students/:id/progress', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [results] = await pool.execute('CALL get_student_progress(?)', [id]);
        
        res.json({ success: true, progress: results[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============= QUIZ =============

// Get random quiz questions (using stored procedure)
app.get('/api/quiz/:courseId/questions', async (req, res) => {
    try {
        const { courseId } = req.params;
        const numQuestions = req.query.count || 5;
        
        const [results] = await pool.execute(
            'CALL get_random_quiz_questions(?, ?)',
            [courseId, numQuestions]
        );
        
        res.json({ success: true, questions: results[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Submit quiz answers
app.post('/api/quiz/submit', async (req, res) => {
    try {
        const { student_id, course_id, answers } = req.body;
        
        // Get correct answers
        const questionIds = Object.keys(answers);
        const [questions] = await pool.execute(
            `SELECT question_id, correct_answer FROM quiz_questions WHERE question_id IN (${questionIds.join(',')})`,
        );
        
        // Calculate score
        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q.question_id] === q.correct_answer) {
                correctCount++;
            }
        });
        
        const score = (correctCount / questions.length) * 100;
        
        // Record attempt (this will trigger progress update)
        await pool.execute(
            'INSERT INTO quiz_attempts (student_id, course_id, score, total_questions) VALUES (?, ?, ?, ?)',
            [student_id, course_id, score, questions.length]
        );
        
        res.json({ 
            success: true, 
            score: score.toFixed(2),
            correct: correctCount,
            total: questions.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============= CERTIFICATES =============

// Get student certificates
app.get('/api/students/:id/certificates', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [certificates] = await pool.execute(`
            SELECT cert.*, c.title as course_title, c.instructor
            FROM certificates cert
            INNER JOIN courses c ON cert.course_id = c.course_id
            WHERE cert.student_id = ?
            ORDER BY cert.issued_at DESC
        `, [id]);
        
        res.json({ success: true, certificates });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============= LEADERBOARD =============

// Get leaderboard (using stored procedure with window functions)
app.get('/api/leaderboard', async (req, res) => {
    try {
        const [results] = await pool.execute('CALL get_leaderboard()');
        
        res.json({ success: true, leaderboard: results[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============= DASHBOARD STATS =============

// Get dashboard statistics
app.get('/api/students/:id/stats', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [enrolled] = await pool.execute(
            'SELECT COUNT(*) as count FROM student_courses WHERE student_id = ?',
            [id]
        );
        
        const [completed] = await pool.execute(
            'SELECT COUNT(*) as count FROM student_courses WHERE student_id = ? AND completed_at IS NOT NULL',
            [id]
        );
        
        const [avgScore] = await pool.execute(
            'SELECT COALESCE(AVG(score), 0) as avg FROM quiz_attempts WHERE student_id = ?',
            [id]
        );
        
        const [certificates] = await pool.execute(
            'SELECT COUNT(*) as count FROM certificates WHERE student_id = ?',
            [id]
        );
        
        res.json({
            success: true,
            stats: {
                enrolled: enrolled[0].count,
                completed: completed[0].count,
                avgScore: parseFloat(avgScore[0].avg).toFixed(2),
                certificates: certificates[0].count
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});