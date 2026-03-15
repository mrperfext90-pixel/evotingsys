import { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import contractService from '../../services/contractService';
import { electionsAPI } from '../../services/api';

const Vote = ({ electionId, candidates }) => {
  const { signer, account } = useWeb3();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (account && electionId) {
      checkVoterStatus();
    }
  }, [account, electionId]);

  const checkVoterStatus = async () => {
    try {
      contractService.initialize(signer);
      const voted = await contractService.hasVotedFor(electionId, account);
      const registered = await contractService.isRegistered(electionId, account);
      setHasVoted(voted);
      setIsRegistered(registered);
    } catch (err) {
      console.error('Error checking voter status:', err);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      contractService.initialize(signer);
      await contractService.vote(electionId, selectedCandidate);
      
      // Also notify backend
      await electionsAPI.vote(electionId, { candidateId: selectedCandidate });
      
      setSuccess('Vote cast successfully!');
      setHasVoted(true);
    } catch (err) {
      setError(err.message || 'Failed to cast vote');
    } finally {
      setLoading(false);
    }
  };

  if (hasVoted) {
    return (
      <div className="card">
        <h3 className="card-header">Cast Your Vote</h3>
        <div className="alert alert-success">
          You have already voted in this election. Thank you for participating!
        </div>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="card">
        <h3 className="card-header">Cast Your Vote</h3>
        <div className="alert alert-error">
          You are not registered to vote in this election. Please contact the election administrator.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="card-header">Cast Your Vote</h3>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="candidates-list">
        {candidates.map((candidate) => (
          <div
            key={candidate.candidateId}
            className={`vote-option ${selectedCandidate === candidate.candidateId ? 'selected' : ''}`}
            onClick={() => setSelectedCandidate(candidate.candidateId)}
          >
            <h4>{candidate.name}</h4>
            <p>{candidate.party}</p>
          </div>
        ))}
      </div>

      <button 
        onClick={handleVote} 
        className="btn btn-success"
        disabled={loading || !selectedCandidate}
      >
        {loading ? 'Casting Vote...' : 'Cast Vote'}
      </button>
    </div>
  );
};

export default Vote;
