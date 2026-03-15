
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { electionsAPI } from '../services/api';

const Home = () => {

  const { isAuthenticated, isAdmin } = useAuth();

  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await electionsAPI.getAll();
      console.log("Elections:", response.data.data);
      setElections(response.data.data);
    } catch (error) {
      console.error('Error fetching elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>

      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">Welcome to E-Voting System</h1>
        <p className="page-subtitle">
          Secure. Transparent. Official Government E-Voting Portal
        </p>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </>
          ) : (
            <Link to={isAdmin ? "/admin" : "/voter"} className="btn btn-primary">
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>


      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">
            {elections.filter(e => e.isActive).length}
          </div>
          <div className="stat-label">Active Elections</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">100%</div>
          <div className="stat-label">Transparent</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">Secure</div>
          <div className="stat-label">Blockchain</div>
        </div>
      </div>


      {/* ELECTION LIST */}
      <h2 className="page-title">Available Elections</h2>

      {loading ? (
        <div className="spinner"></div>
      ) : elections.length === 0 ? (
        <div className="alert alert-info">
          No elections available at the moment.
        </div>
      ) : (
        <div className="grid grid-3">

          {elections.map((election) => (
            <div key={election._id} className="election-card">

              <h3>{election.title}</h3>
              <p>{election.description}</p>

              <div style={{ marginTop: '1rem' }}>
                <span className={`election-status ${election.isActive ? 'active' : 'ended'}`}>
                  {election.isActive ? 'Active' : 'Ended'}
                </span>
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                <p>Starts: {formatDate(election.startDate)}</p>
                <p>Ends: {formatDate(election.endDate)}</p>
              </div>

              <Link
                to={`/election/${election._id}`}
                className="btn btn-primary"
                style={{ marginTop: '1rem', display: 'inline-block' }}
              >
                View Election
              </Link>

            </div>
          ))}

        </div>
      )}


      {/* HOW IT WORKS */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>How It Works</h3>

        <div className="grid grid-3" style={{ marginTop: '1rem' }}>

          <div>
            <h4>1. Connect Wallet</h4>
            <p>Connect your MetaMask wallet to get started.</p>
          </div>

          <div>
            <h4>2. Register</h4>
            <p>Register with your unique voter ID.</p>
          </div>

          <div>
            <h4>3. Vote</h4>
            <p>Cast your vote securely on the blockchain.</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Home;

