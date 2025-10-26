// frontend/assets/js/leaderboard.js

const student = checkAuth();

if (student) {
    loadLeaderboard();
}

async function loadLeaderboard() {
    try {
        const response = await fetch(`${API_URL}/leaderboard`);
        const data = await response.json();
        
        if (data.success) {
            displayLeaderboard(data.leaderboard);
        } else {
            document.getElementById('leaderboardList').innerHTML = 
                '<div class="empty-state">Error loading leaderboard. Please try again.</div>';
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        document.getElementById('leaderboardList').innerHTML = 
            '<div class="empty-state">Error loading leaderboard. Please check your connection.</div>';
    }
}

function displayLeaderboard(leaderboard) {
    const leaderboardList = document.getElementById('leaderboardList');
    
    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<div class="empty-state">No data available yet.</div>';
        return;
    }
    
    leaderboardList.innerHTML = leaderboard.map((entry, index) => {
        const rankClass = getRankClass(entry.rank_position);
        const isCurrentUser = entry.student_id === student.student_id;
        const rowClass = isCurrentUser ? 'current-user' : '';
        
        return `
            <div class="leaderboard-row ${rowClass}" style="${isCurrentUser ? 'background: rgba(99, 102, 241, 0.1); border: 1px solid var(--primary);' : ''}">
                <div class="rank ${rankClass}">${entry.rank_position}</div>
                <div>
                    <strong>${entry.full_name}</strong>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">@${entry.username}</div>
                </div>
                <div class="courses">${entry.courses_completed}</div>
                <div class="rank-col">${parseFloat(entry.avg_score).toFixed(1)}%</div>
                <div>
                    ${entry.courses_completed > 0 ? 
                        '<span class="badge badge-success">Active</span>' : 
                        '<span class="badge badge-info">New</span>'}
                </div>
            </div>
        `;
    }).join('');
}

function getRankClass(rank) {
    if (rank === 1) return 'top1';
    if (rank === 2) return 'top2';
    if (rank === 3) return 'top3';
    return '';
}

// Initialize navigation
initNav();