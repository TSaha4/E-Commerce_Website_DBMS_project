-- Insert sample students (password is 'password123' hashed with bcrypt)
INSERT INTO students (username, email, password_hash, full_name) VALUES
('john_doe', 'john@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe'),
('jane_smith', 'jane@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith'),
('bob_wilson', 'bob@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob Wilson');

-- Insert sample courses
INSERT INTO courses (title, description, instructor, duration_hours) VALUES
('Web Development Fundamentals', 'Learn HTML, CSS, and JavaScript basics', 'Prof. Sarah Johnson', 40),
('Python Programming', 'Master Python from beginner to advanced', 'Dr. Michael Chen', 50),
('Database Management', 'Complete guide to SQL and database design', 'Prof. Emily Brown', 35),
('Data Science Basics', 'Introduction to data analysis and visualization', 'Dr. David Lee', 45);

-- Insert modules for courses
INSERT INTO modules (course_id, title, content, order_num) VALUES
(1, 'Introduction to HTML', 'Learn the basics of HTML structure and tags', 1),
(1, 'CSS Styling', 'Master CSS for beautiful web pages', 2),
(1, 'JavaScript Fundamentals', 'Learn programming with JavaScript', 3),
(2, 'Python Basics', 'Variables, data types, and operators', 1),
(2, 'Control Structures', 'If statements, loops, and functions', 2),
(2, 'Object-Oriented Programming', 'Classes, objects, and inheritance', 3);

-- Insert quiz questions
INSERT INTO quiz_questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES
(1, 'What does HTML stand for?', 'Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 'A'),
(1, 'Which CSS property controls text size?', 'font-style', 'text-size', 'font-size', 'text-style', 'C'),
(1, 'What is the correct syntax for a JavaScript function?', 'function myFunc()', 'def myFunc()', 'func myFunc()', 'function:myFunc()', 'A'),
(2, 'Which keyword is used to define a variable in Python?', 'var', 'let', 'dim', 'No keyword needed', 'D'),
(2, 'What is the output of print(type([]))?', 'list', 'array', 'tuple', 'dict', 'A');

-- Enroll students in courses
INSERT INTO student_courses (student_id, course_id, progress_percentage) VALUES
(1, 1, 45.00),
(1, 2, 80.00),
(2, 1, 100.00),
(2, 3, 60.00),
(3, 1, 25.00);

-- Insert quiz attempts
INSERT INTO quiz_attempts (student_id, course_id, score, total_questions) VALUES
(1, 1, 75.50, 10),
(1, 2, 88.00, 10),
(2, 1, 92.00, 10),
(2, 3, 78.50, 10),
(3, 1, 65.00, 10);