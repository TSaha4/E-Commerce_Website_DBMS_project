DELIMITER //

-- Stored Procedure: Get random quiz questions for a course
CREATE PROCEDURE get_random_quiz_questions(
    IN p_course_id INT,
    IN p_num_questions INT
)
BEGIN
    SELECT question_id, question_text, option_a, option_b, option_c, option_d
    FROM quiz_questions
    WHERE course_id = p_course_id
    ORDER BY RAND()
    LIMIT p_num_questions;
END//

-- Stored Procedure: Get student leaderboard with window functions
CREATE PROCEDURE get_leaderboard()
BEGIN
    SELECT 
        s.student_id,
        s.full_name,
        s.username,
        COUNT(DISTINCT sc.course_id) as courses_completed,
        COALESCE(AVG(qa.score), 0) as avg_score,
        RANK() OVER (ORDER BY COALESCE(AVG(qa.score), 0) DESC) as rank_position,
        DENSE_RANK() OVER (ORDER BY COALESCE(AVG(qa.score), 0) DESC) as dense_rank_position
    FROM students s
    LEFT JOIN student_courses sc ON s.student_id = sc.student_id AND sc.completed_at IS NOT NULL
    LEFT JOIN quiz_attempts qa ON s.student_id = qa.student_id
    GROUP BY s.student_id, s.full_name, s.username
    ORDER BY avg_score DESC, courses_completed DESC
    LIMIT 50;
END//

-- Stored Procedure: Enroll student in course
CREATE PROCEDURE enroll_student(
    IN p_student_id INT,
    IN p_course_id INT
)
BEGIN
    INSERT INTO student_courses (student_id, course_id)
    VALUES (p_student_id, p_course_id)
    ON DUPLICATE KEY UPDATE enrolled_at = CURRENT_TIMESTAMP;
END//

-- Stored Procedure: Get student progress
CREATE PROCEDURE get_student_progress(
    IN p_student_id INT
)
BEGIN
    SELECT 
        c.course_id,
        c.title,
        sc.progress_percentage,
        sc.completed_at,
        CASE 
            WHEN sc.completed_at IS NOT NULL THEN 'Completed'
            WHEN sc.progress_percentage >= 50 THEN 'In Progress'
            ELSE 'Started'
        END as status,
        cert.certificate_code
    FROM courses c
    INNER JOIN student_courses sc ON c.course_id = sc.course_id
    LEFT JOIN certificates cert ON cert.student_id = sc.student_id AND cert.course_id = c.course_id
    WHERE sc.student_id = p_student_id
    ORDER BY sc.enrolled_at DESC;
END//

DELIMITER ;