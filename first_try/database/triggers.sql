DELIMITER //

CREATE TRIGGER generate_certificate_on_completion
AFTER UPDATE ON student_courses
FOR EACH ROW
BEGIN
    -- Check if course was just completed (completed_at changed from NULL to a value)
    IF OLD.completed_at IS NULL AND NEW.completed_at IS NOT NULL THEN
        -- Generate unique certificate code
        INSERT INTO certificates (student_id, course_id, certificate_code)
        VALUES (
            NEW.student_id,
            NEW.course_id,
            CONCAT('CERT-', NEW.course_id, '-', NEW.student_id, '-', UNIX_TIMESTAMP())
        )
        ON DUPLICATE KEY UPDATE issued_at = CURRENT_TIMESTAMP;
    END IF;
END//

-- Trigger: Update progress percentage when quiz is completed
CREATE TRIGGER update_progress_on_quiz
AFTER INSERT ON quiz_attempts
FOR EACH ROW
BEGIN
    DECLARE avg_score DECIMAL(5,2);
    
    -- Calculate average quiz score for this course
    SELECT AVG(score) INTO avg_score
    FROM quiz_attempts
    WHERE student_id = NEW.student_id AND course_id = NEW.course_id;
    
    -- Update progress percentage
    UPDATE student_courses
    SET progress_percentage = LEAST(avg_score, 100.00)
    WHERE student_id = NEW.student_id AND course_id = NEW.course_id;
    
    -- If score is above 80%, mark course as completed
    IF NEW.score >= 80.00 THEN
        UPDATE student_courses
        SET completed_at = CURRENT_TIMESTAMP,
            progress_percentage = 100.00
        WHERE student_id = NEW.student_id 
        AND course_id = NEW.course_id
        AND completed_at IS NULL;
    END IF;
END//

DELIMITER ;