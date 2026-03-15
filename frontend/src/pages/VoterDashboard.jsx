import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { electionsAPI } from '../services/api';

const VoterDashboard = () => {
  const { user, isAuthenticated, isVoter } = useAuth();
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin');
    } else {
      fetchElections();
    }
  }, [isAuthenticated, user]);

  const fetchElections = async () => {
    try {
      const response = await electionsAPI.getAll();
      setElections(response.data.data);
    } catch (error) {
      console.error('Error fetching elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated || (user && user.role === 'admin')) {
    return null;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Voter Dashboard</h1>
        <p className="page-subtitle">Welcome, {user?.name}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{elections.filter(e => e.isActive).length}</div>
          <div className="stat-label">Active Elections</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{elections.length}</div>
          <div className="stat-label">Total Elections</div>
        </div>
      </div>

      <h2 className="page-title">Available Elections</h2>
      
      {loading ? (
        <div className="spinner"></div>
      ) : elections.length === 0 ? (
        <div className="alert alert-info">No elections available at the moment.</div>
      ) : (
        <div className="grid grid-2">
          {elections.map((election) => (
            <div key={election.electionId} className="election-card">
              <h3>{election.name}</h3>
              <p>{election.description}</p>
              <div style={{ marginTop: '1rem' }}>
                <span className={`election-status ${election.isActive ? 'active' : 'ended'}`}>
                  {election.isActive ? 'Active' : 'Ended'}
                </span>
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
                <p>Ends: {formatDate(election.endTime)}</p>
                <p>Candidates: {election.candidates?.length || 0}</p>
              </div>
              <Link to={`/election/${election.electionId}`} className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                View & Vote
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoterDashboard;
