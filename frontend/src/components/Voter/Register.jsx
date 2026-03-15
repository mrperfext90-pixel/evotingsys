import { useState } from 'react';
import { electionsAPI } from '../../services/api';

const Register = ({ electionId, onSuccess }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await electionsAPI.registerVoter(electionId, { walletAddress });
      setWalletAddress('');
      setSuccess('Voter registered successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register voter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="card-header">Register Voter</h3>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Voter Wallet Address</label>
          <input
            type="text"
            className="form-input"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            required
            placeholder="0x..."
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register Voter'}
        </button>
      </form>
    </div>
  );
};

export default Register;
