import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCandidates } from '../api';

/**
 * CandidateCard displays a single candidate's submission summary and allows
 * expansion to show individual answers and evaluation feedback.  It expects
 * a candidate object with answers (including evaluations).
 */
const CandidateCard = ({ candidate }) => {
  const [expanded, setExpanded] = useState(false);

  // Calculate total score across all answers if scores exist
  const scores = candidate.answers
    .map((ans) => ans.evaluation_score)
    .filter((score) => typeof score === 'number');
  const totalScore = scores.length > 0 ? (
    scores.reduce((sum, s) => sum + s, 0)
  ).toFixed(1) : null;

  // Maximum possible score: 10 MC questions (1pt each) + 6 SA questions (2pts each) = 22
  const maxScore = 22;

  return (
    <div className={`card${expanded ? ' expanded' : ''}`}>  {/* Card layout */}
      <div className="card-header" onClick={() => setExpanded((v) => !v)}>
        <div>
          <h3>{candidate.name}</h3>
          <p className="subtext">{candidate.phone}</p>
        </div>
        {totalScore && (
          <span className="score-chip">
            {totalScore}/{maxScore}
          </span>
        )}
      </div>
      {expanded && (
        <div className="card-body">
          {candidate.answers.map((ans, idx) => (
            <div className="answer" key={idx}>
              <p className="question"><strong>Q:</strong> {ans.question}</p>
              <p className="response">
                <strong>A:</strong> {ans.type === 'mc' ? ans.selected : ans.answer_text}
              </p>
              {ans.evaluation_score !== null && (
                <div className="evaluation">
                  <p><strong>AI Score:</strong> {ans.evaluation_score}</p>
                  <p><strong>AI Feedback:</strong> {ans.evaluation_feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * EmployerDashboard fetches and displays all candidate submissions.  Employers must
 * be authenticated; if no token exists the user is redirected to the login page.
 */
const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/employer');
      return;
    }
    async function loadCandidates() {
      try {
        const data = await fetchCandidates(token);
        
        // Sort candidates by total score (high to low)
        const sortedCandidates = data.sort((a, b) => {
          const getTotalScore = (candidate) => {
            const scores = candidate.answers
              .map((ans) => ans.evaluation_score)
              .filter((score) => typeof score === 'number');
            return scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) : 0;
          };
          
          const scoreA = getTotalScore(a);
          const scoreB = getTotalScore(b);
          
          return scoreB - scoreA; // Descending order (high to low)
        });
        
        setCandidates(sortedCandidates);
      } catch (err) {
        setError('Không thể tải danh sách ứng viên.');
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/employer');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Danh sách ứng viên</h1>
        <button className="secondary" onClick={handleLogout}>Đăng xuất</button>
      </div>
      {loading && <div className="dashboard-loading">Đang tải dữ liệu ứng viên…</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && candidates.length === 0 && !error && (
        <div className="dashboard-empty">
          <p>Chưa có đơn ứng tuyển nào.</p>
        </div>
      )}
      <div className="card-list">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
};

export default EmployerDashboard;