// frontend/assets/js/quiz.js

const student = checkAuth();
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('courseId');

let questions = [];
let answers = {};
let currentQuestionIndex = 0;

if (student && courseId) {
    loadQuiz();
} else {
    window.location.href = 'courses.html';
}

async function loadQuiz() {
    try {
        const response = await fetch(`${API_URL}/quiz/${courseId}/questions?count=5`);
        const data = await response.json();
        
        if (data.success && data.questions.length > 0) {
            questions = data.questions;
            displayQuestion();
            document.getElementById('quizActions').style.display = 'block';
        } else {
            document.getElementById('quizContent').innerHTML = 
                '<div class="empty-state">No quiz questions available for this course.</div>';
        }
    } catch (error) {
        console.error('Error loading quiz:', error);
        document.getElementById('quizContent').innerHTML = 
            '<div class="empty-state">Error loading quiz. Please try again.</div>';
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        submitQuiz();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    const quizContent = document.getElementById('quizContent');
    
    quizContent.innerHTML = `
        <div class="question-card">
            <h3>Question ${currentQuestionIndex + 1} of ${questions.length}</h3>
            <h3>${question.question_text}</h3>
            <div class="options">
                <div class="option" data-option="A" onclick="selectOption('A')">
                    <strong>A.</strong> ${question.option_a}
                </div>
                <div class="option" data-option="B" onclick="selectOption('B')">
                    <strong>B.</strong> ${question.option_b}
                </div>
                <div class="option" data-option="C" onclick="selectOption('C')">
                    <strong>C.</strong> ${question.option_c}
                </div>
                <div class="option" data-option="D" onclick="selectOption('D')">
                    <strong>D.</strong> ${question.option_d}
                </div>
            </div>
        </div>
    `;
    
    // Highlight previously selected option
    if (answers[question.question_id]) {
        const selectedOption = document.querySelector(`[data-option="${answers[question.question_id]}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
}

function selectOption(option) {
    const question = questions[currentQuestionIndex];
    answers[question.question_id] = option;
    
    // Remove previous selection
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to current option
    document.querySelector(`[data-option="${option}"]`).classList.add('selected');
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 500);
}

async function submitQuiz() {
    try {
        const response = await fetch(`${API_URL}/quiz/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_id: student.student_id,
                course_id: parseInt(courseId),
                answers: answers
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showQuizResult(data.score, data.correct, data.total);
        } else {
            document.getElementById('quizContent').innerHTML = 
                '<div class="empty-state">Error submitting quiz. Please try again.</div>';
        }
    } catch (error) {
        console.error('Error submitting quiz:', error);
        document.getElementById('quizContent').innerHTML = 
            '<div class="empty-state">Network error. Please try again.</div>';
    }
}

function showQuizResult(score, correct, total) {
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('quizActions').style.display = 'none';
    
    const resultScore = document.getElementById('resultScore');
    const resultMessage = document.getElementById('resultMessage');
    const quizResult = document.getElementById('quizResult');
    
    resultScore.textContent = `${score}%`;
    resultMessage.textContent = `You got ${correct} out of ${total} questions correct.`;
    
    if (score >= 80) {
        resultScore.style.color = 'var(--success)';
        resultMessage.textContent += ' Congratulations! You passed the quiz!';
    } else {
        resultScore.style.color = 'var(--warning)';
        resultMessage.textContent += ' You need 80% or higher to pass.';
    }
    
    quizResult.classList.add('show');
}

function retakeQuiz() {
    currentQuestionIndex = 0;
    answers = {};
    document.getElementById('quizContent').style.display = 'block';
    document.getElementById('quizActions').style.display = 'block';
    document.getElementById('quizResult').classList.remove('show');
    displayQuestion();
}

// Initialize navigation
initNav();
