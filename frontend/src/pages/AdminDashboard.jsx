import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { electionsAPI } from '../services/api';
import CreateElection from '../components/Admin/CreateElection';
import AddCandidates from '../components/Admin/AddCandidates'; // NOTE: Component not provided in context
import RegisterVoterForElection from '../components/Voter/Register'; // NOTE: Component not provided in context, renamed for clarity

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedElection, setSelectedElection] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/voter');
    } else {
      fetchElections();
    }
  }, [isAuthenticated, isAdmin]);

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

  const handleElectionCreated = () => {
    fetchElections();
    setSelectedElection(null);
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Manage elections and voters</p>
      </div>

      <div className="grid grid-2">
        <div>
          <CreateElection onSuccess={handleElectionCreated} />
          
          {selectedElection && (
            <>
              <AddCandidates 
                electionId={selectedElection} 
                onSuccess={fetchElections} 
              />
              <RegisterVoterForElection 
                electionId={selectedElection} 
                onSuccess={fetchElections} 
              />
            </>
          )}
        </div>

        <div>
          <div className="card">
            <h3 className="card-header">Your Elections</h3>
            {loading ? (
              <div className="spinner"></div>
            ) : elections.length === 0 ? (
              <p>No elections created yet.</p>
            ) : (
              <div>
                {elections.map((election) => (
                  <div 
                    key={election.electionId} 
                    style={{ 
                      padding: '1rem', 
                      border: '1px solid #ddd', 
                      marginBottom: '0.5rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      backgroundColor: selectedElection === election.electionId ? '#f0f4ff' : 'white'
                    }}
                    onClick={() => setSelectedElection(election.electionId)}
                  >
                    <h4>{election.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>
                      {election.description}
                    </p>
                    <span className={`election-status ${election.isActive ? 'active' : 'ended'}`}>
                      {election.isActive ? 'Active' : 'Ended'}
                    </span>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                      Candidates: {election.candidates?.length || 0}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
