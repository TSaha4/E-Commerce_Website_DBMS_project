# E-Learning Platform

A comprehensive e-learning platform built with Node.js, Express, MySQL, and vanilla JavaScript. This project demonstrates advanced database concepts including stored procedures, triggers, window functions, and complex queries.

## Features

### 🎓 Course Management
- Browse available courses
- Enroll in courses
- Track learning progress
- View course modules and content

### 📊 Quiz System
- Take quizzes for enrolled courses
- Random question selection
- Automatic scoring and progress tracking
- Certificate generation upon completion (80%+ score)

### 🏆 Leaderboard
- Real-time ranking system using window functions
- Based on quiz scores and course completion
- Top performer highlighting

### 🎖️ Certificate System
- Automatic certificate generation via triggers
- Unique certificate codes
- Printable certificate format

### 📈 Dashboard Analytics
- Personal learning statistics
- Progress tracking
- Course completion status

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database with advanced features
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **Vanilla JavaScript** - No frameworks, pure JS
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **HTML5** - Semantic markup

### Database Features
- **Stored Procedures** - Complex business logic
- **Triggers** - Automatic data processing
- **Window Functions** - Advanced analytics
- **Foreign Keys** - Data integrity
- **Indexes** - Performance optimization

## Database Schema

### Core Tables
- `students` - User accounts and authentication
- `courses` - Course information and metadata
- `modules` - Course content and structure
- `student_courses` - Enrollment and progress tracking
- `quiz_questions` - Quiz content
- `quiz_attempts` - Quiz results and scoring
- `certificates` - Achievement records

### Advanced Features
- **Stored Procedures**: `enroll_student()`, `get_random_quiz_questions()`, `get_leaderboard()`, `get_student_progress()`
- **Triggers**: Automatic certificate generation and progress updates
- **Window Functions**: Ranking and analytics in leaderboard

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd first_try
```

### 2. Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE elearning_db;
USE elearning_db;

# Run schema creation
source database/schema.sql;

# Create stored procedures
source database/procedures.sql;

# Create triggers
source database/triggers.sql;

# Insert sample data
source database/sample_data.sql;
```

### 3. Backend Setup
```bash
cd backend
npm install
```

### 4. Environment Configuration
Create your environment configuration file:
```bash
# Copy the example configuration
cp config.example backend/.env

# Edit the .env file with your database credentials
# Update DB_PASSWORD with your MySQL password
```

**Important**: The `.env` file contains sensitive information and is automatically excluded from Git commits.

### 5. Configure Database Connection
Edit `backend/.env` and update the database connection settings:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=elearning_db
DB_CONNECTION_LIMIT=10
PORT=3000
```

**⚠️ IMPORTANT**: You MUST set `DB_PASSWORD` to your actual MySQL password. The application will not start without it.

### 6. Start the Application
```bash
# Start the server
npm start

# Or for development with auto-restart
npm run dev
```

The application will be available at `http://localhost:3000`

## Security Features

### Environment Variables
- Database credentials are stored in `.env` file (excluded from Git)
- Sensitive configuration separated from code
- Easy deployment across different environments

### Password Security
- bcrypt hashing for password storage
- Configurable salt rounds
- No plain text passwords in database

### Data Protection
- SQL injection prevention with parameterized queries
- CORS configuration for API security
- Input validation and sanitization

## Quick Setup (Alternative)
For a faster setup, you can use the provided setup script:
```bash
# Make the script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

## Usage

### Default Test Accounts
- **Username**: `john_doe` | **Password**: `password123`
- **Username**: `jane_smith` | **Password**: `password123`
- **Username**: `bob_wilson` | **Password**: `password123`

### Getting Started
1. Visit `http://localhost:3000`
2. Login with test credentials or register a new account
3. Browse courses and enroll in available courses
4. Take quizzes to test your knowledge
5. View your progress on the dashboard
6. Check the leaderboard to see rankings
7. Earn certificates by scoring 80%+ on quizzes

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details with modules
- `POST /api/courses/enroll` - Enroll in a course
- `GET /api/students/:id/courses` - Get student's enrolled courses

### Quiz
- `GET /api/quiz/:courseId/questions` - Get random quiz questions
- `POST /api/quiz/submit` - Submit quiz answers

### Analytics
- `GET /api/students/:id/stats` - Get dashboard statistics
- `GET /api/students/:id/progress` - Get detailed progress
- `GET /api/leaderboard` - Get leaderboard data
- `GET /api/students/:id/certificates` - Get student certificates

## Database Features Explained

### Stored Procedures
- **`enroll_student()`**: Handles course enrollment with duplicate prevention
- **`get_random_quiz_questions()`**: Randomizes quiz questions for fair testing
- **`get_leaderboard()`**: Uses window functions for ranking calculations
- **`get_student_progress()`**: Complex progress tracking with status determination

### Triggers
- **`generate_certificate_on_completion`**: Automatically creates certificates when courses are completed
- **`update_progress_on_quiz`**: Updates progress percentage and completion status based on quiz scores

### Window Functions
- **RANK()** and **DENSE_RANK()**: Used in leaderboard for accurate ranking
- **OVER()** clause: Enables advanced analytics without subqueries

## Project Structure
```
first_try/
├── backend/
│   ├── package.json
│   └── server.js
├── database/
│   ├── schema.sql
│   ├── procedures.sql
│   ├── triggers.sql
│   └── sample_data.sql
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       ├── main.js
│   │       ├── dashboard.js
│   │       ├── courses.js
│   │       ├── quiz.js
│   │       └── leaderboard.js
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── courses.html
│   ├── course-detail.html
│   ├── quiz.html
│   ├── leaderboard.html
│   └── certificates.html
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- [ ] Video content integration
- [ ] Discussion forums
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Payment integration for premium courses
- [ ] Multi-language support
- [ ] Real-time notifications
- [ ] Social learning features
