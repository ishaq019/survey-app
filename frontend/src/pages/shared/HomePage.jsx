import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const res = await api.get('/exams');

        const examList = res.data?.data || res.data || [];
        setExams(examList);

        // Automatically select first exam by default
        if (examList.length > 0) {
          setSelectedExamId(examList[0]._id);
        }
      } catch (error) {
        alert('Failed to load exams. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const requireExam = () => {
    if (!selectedExamId) {
      alert('Please select an exam first');
      return false;
    }
    return true;
  };

  const openManageSurvey = () => {
    if (!requireExam()) return;
    navigate(`/admin/exams/${selectedExamId}/survey-templates`);
  };

  const openPreSurvey = () => {
    if (!requireExam()) return;
    navigate(`/student/exams/${selectedExamId}/before-survey`);
  };

  const openPostSurvey = () => {
    if (!requireExam()) return;
    navigate(`/student/exams/${selectedExamId}/after-survey`);
  };

  const openReport = () => {
    if (!requireExam()) return;
    navigate(`/admin/exams/${selectedExamId}/survey-report`);
  };

  return (
    <div className="home-page">
      <div className="survey-card">
        <label className="survey-label">Select Exam</label>

        {loading ? (
          <p className="loading-text">Loading exams...</p>
        ) : (
          <select
            className="exam-dropdown"
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
          >
            {exams.length === 0 ? (
              <option value="">No exams found</option>
            ) : (
              exams.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.title || exam.name || 'Untitled Exam'}
                </option>
              ))
            )}
          </select>
        )}

        <div className="survey-actions">
          <button onClick={openManageSurvey}>Manage Survey</button>
          <button onClick={openPreSurvey}>Open Pre Survey</button>
          <button onClick={openPostSurvey}>Open Post Survey</button>
          <button onClick={openReport}>View Report</button>
        </div>
      </div>

      <div className="survey-card">
        <h2>Quiz App Integration Format</h2>
        <p>Use links like this from the Quiz application:</p>

        <code className="integration-code">
          http://localhost:5174/student/exams/&lt;examId&gt;/after-survey?returnUrl=http%3A%2F%2Flocalhost%3A5173%2Fresult&participantId=&lt;studentId&gt;
        </code>
      </div>
    </div>
  );
};

export default HomePage;