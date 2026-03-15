import { useState, useEffect } from 'react';
import { electionsAPI } from '../../services/api';

const Results = ({ electionId }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (electionId) {
      fetchResults();
    }
  }, [electionId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await electionsAPI.getResults(electionId);
      setResults(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="card-header">Election Results</h3>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="card-header">Election Results</h3>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const maxVotes = Math.max(...results.candidates.map(c => c.voteCount), 1);

  return (
    <div className="card">
      <h3 className="card-header">Election Results: {results.name}</h3>
      
      <div className="results-summary">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{results.totalVotes}</div>
            <div className="stat-label">Total Votes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{results.candidates.length}</div>
            <div className="stat-label">Candidates</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{results.winner}</div>
            <div className="stat-label">Current Winner</div>
          </div>
        </div>

        <h4>Candidate Results</h4>
        {results.candidates.map((candidate) => (
          <div key={candidate.candidateId} className="result-item">
            <div className="result-label">
              <span>{candidate.name} ({candidate.party})</span>
              <span>{candidate.voteCount} votes</span>
            </div>
            <div className="result-bar" style={{ width: `${(candidate.voteCount / maxVotes) * 100}%` }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
